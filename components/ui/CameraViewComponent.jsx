import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Dimensions,
} from "react-native";
import { CameraView } from "expo-camera";
import { ProductView } from "./ProductView";
import { AddProductForm } from "./AddProductForm";

const BARCODE_TYPES = [
  "codabar",
  "code39",
  "code93",
  "code128",
  "datamatrix",
  "ean8",
  "ean13",
  "itf14",
  "pdf417",
  "qr",
  "upc_a",
  "upc_e",
];

export const CameraViewComponent = ({
  cameraRef,
  facing,
  onBarcodeScanned,
  onToggleFacing,
  onClose,
  lastScan,
  result,
  error,
  formData,
  onFormChange,
  onCreateProduct,
  isCreating,
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Calcular altura máxima del contenedor inferior
  const bottomContainerHeight = keyboardVisible
    ? screenHeight - keyboardHeight - 150 // 100 para los botones superiores
    : 400;

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        autoFocus="on"
        onBarcodeScanned={onBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
      />

      <TouchableOpacity
        className="absolute top-20 right-5 bg-black/40 px-4 py-2 rounded-lg"
        onPress={onToggleFacing}
      >
        <Text className="text-white text-lg">Voltear</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="absolute top-20 left-5 bg-black/40 px-4 py-2 rounded-lg"
        onPress={onClose}
      >
        <Text className="text-white text-lg">Cerrar</Text>
      </TouchableOpacity>

      <View
        style={{
          position: "absolute",
          bottom: keyboardVisible ? keyboardHeight : 0,
          width: "100%",
          maxHeight: bottomContainerHeight,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          paddingTop: 12,
          paddingBottom: keyboardVisible ? 0 : 20,
          paddingHorizontal: 10,
        }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            paddingBottom: keyboardVisible ? 0 : 30,
          }}
        >
          {lastScan && (
            <Text className="text-white text-center mb-3 text-lg">
              Código: {lastScan.data}
            </Text>
          )}

          {result && <ProductView product={result} darkMode />}
          {error === "NOT_FOUND" && (
            <AddProductForm
              darkMode
              formData={formData}
              onFormChange={onFormChange}
              onSubmit={onCreateProduct}
              isCreating={isCreating}
            />
          )}
          {error !== "NOT_FOUND" && error && (
            <Text className="text-red-400 mt-3 text-center">{error}</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};
