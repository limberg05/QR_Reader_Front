import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchProduct,
  createProduct,
  updateStock,
} from "../../services/products";
import ProductView from "../../components/ProductView";
import AddProductForm from "../../components/AddProductForm";
import { useProductStore } from "../../utils/productStore";

import "@/global.css";

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

export default function QrReader() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [hasScanned, setHasScanned] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const [newName, setNewName] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("");
  const [marca, setMarca] = useState("");
  const [imgurl, setImgurl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [showStockModal, setShowStockModal] = useState(false);
  const [newStockValue, setNewStockValue] = useState("");
  const [notes, setNotes] = useState("");
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");

  const [showProductPanel, setShowProductPanel] = useState(true);

  const cameraRef = useRef(null);

  const setSelectedBarcode = useProductStore(
    (state) => state.setSelectedBarcode
  );

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);

    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  useEffect(() => {
    if (!permission?.granted) requestPermission();
    if (Constants.appOwnership !== "expo") {
      MediaLibrary.requestPermissionsAsync().catch(() => {});
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (hasScanned) return;
    setShowProductPanel(true);
    setHasScanned(true);
    setLastScan({ type, data });

    try {
      const productData = await fetchProduct(data);
      setResult(productData);
      setError(null);

      setSelectedBarcode(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("NOT_FOUND");
      } else {
        setError(err.message);
      }
      setResult(null);
    }

    setTimeout(() => setHasScanned(false), 1500);
  };

  const toggleCameraFacing = () =>
    setFacing((current) => (current === "back" ? "front" : "back"));

  const handleCreateProduct = async () => {
    if (!newName.trim() || !buyPrice || !sellPrice) {
      setError("Por favor completa los campos requeridos");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      await createProduct({
        barcode: lastScan?.data,
        name: newName,
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        stock: Number(stock) || 0,
        marca,
        imageUrl: imgurl,
      });

      const refreshed = await fetchProduct(lastScan.data);
      setResult(refreshed);
      setShowProductPanel(true);
      setError(null);

      setNewName("");
      setBuyPrice("");
      setSellPrice("");
      setStock("");
      setMarca("");
      setImgurl("");
    } catch {
      setError("Error al crear producto");
    } finally {
      setIsCreating(false);
    }
  };

  const openStockUpdater = () => {
    setNewStockValue(String(result?.stock ?? ""));
    setNotes("");
    setShowStockModal(true);
  };

  const handleUpdateStock = async () => {
    if (isUpdatingStock) return; // Prevenir múltiples clics

    try {
      if (!newStockValue.trim()) {
        showToast("Ingresa el nuevo stock", "error");
        return;
      }

      setIsUpdatingStock(true);

      await updateStock(result.barcode, Number(newStockValue), notes);

      const refreshed = await fetchProduct(result.barcode);
      setResult(refreshed);

      setNewStockValue("");
      setNotes("");

      setShowStockModal(false);
      setShowProductPanel(false);

      setError(null);

      showToast("Stock actualizado correctamente", "success");
    } catch (err) {
      setError("Error actualizando stock");
      showToast("Error actualizando el stock", "error");
    } finally {
      setIsUpdatingStock(false);
    }
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-red-100 p-4 rounded-full mb-4">
            <Ionicons name="camera-off" size={48} color="#dc2626" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Permisos de cámara requeridos
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Necesitamos acceso a tu cámara para escanear códigos de barras
          </Text>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3 rounded-xl"
            onPress={() => {
              if (permission?.canAskAgain === false) {
                Alert.alert(
                  "Permiso bloqueado",
                  "Debes habilitar la cámara manualmente desde los Ajustes del dispositivo."
                );
                return;
              }

              requestPermission();
            }}
          >
            <Text className="text-white font-bold text-base">Dar permisos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!showCamera) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="items-center mb-6">
              <View className="bg-blue-100 p-4 rounded-full mb-3">
                <Ionicons name="qr-code" size={40} color="#2563eb" />
              </View>
              <Text className="text-2xl font-bold text-gray-800">
                Lector de códigos
              </Text>
              <Text className="text-gray-600 text-center mt-1">
                Escanea productos para ver o agregar información
              </Text>
            </View>

            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center mb-6"
              onPress={() => setShowCamera(true)}
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Abrir cámara
              </Text>
            </TouchableOpacity>

            {showProductPanel && result && (
              <ProductView
                product={result}
                onUpdateStockPress={openStockUpdater}
              />
            )}

            {error === "NOT_FOUND" && (
              <AddProductForm
                newName={newName}
                setNewName={setNewName}
                buyPrice={buyPrice}
                setBuyPrice={setBuyPrice}
                sellPrice={sellPrice}
                setSellPrice={setSellPrice}
                stock={stock}
                setStock={setStock}
                marca={marca}
                setMarca={setMarca}
                imgurl={imgurl}
                setImgurl={setImgurl}
                error={error}
                isCreating={isCreating}
                onCreateProduct={handleCreateProduct}
              />
            )}

            {error !== "NOT_FOUND" && error && (
              <View className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                <Text className="text-red-600 text-center">{error}</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        {showStockModal && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="absolute bottom-0 left-0 right-0"
            style={{ zIndex: 50 }}
          >
            <View className="bg-white p-6 rounded-t-3xl shadow-2xl">
              <Text className="text-lg font-bold mb-3 text-gray-800">
                Actualizar Stock
              </Text>

              <TextInput
                value={newStockValue}
                onChangeText={setNewStockValue}
                keyboardType="numeric"
                className="bg-gray-100 px-4 py-3 rounded-xl mb-4 border border-gray-300"
                placeholder="Nuevo stock"
              />

              <TextInput
                value={notes}
                onChangeText={setNotes}
                className="bg-gray-100 px-4 py-3 rounded-xl mb-4 border border-gray-300"
                placeholder="Notas (opcional)"
              />

              <TouchableOpacity
                className={`py-4 rounded-xl ${
                  isUpdatingStock ? "bg-blue-400" : "bg-blue-600"
                }`}
                onPress={handleUpdateStock}
                disabled={isUpdatingStock}
              >
                <Text className="text-center text-white font-bold">
                  {isUpdatingStock ? "Guardando..." : "Guardar cambios"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-3 py-3 rounded-xl"
                onPress={() => setShowStockModal(false)}
              >
                <Text className="text-center text-gray-600 font-bold">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {toastMessage && (
          <View
            style={{
              position: "absolute",
              bottom: 40,
              left: 20,
              right: 20,
              backgroundColor: toastType === "success" ? "#16a34a" : "#dc2626",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 12,
              zIndex: 9999,
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              {toastMessage}
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        autoFocus="on"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
      />

      <SafeAreaView
        className="absolute top-0 left-0 right-0"
        style={{ zIndex: 10 }}
      >
        <View className="flex-row justify-between px-5 py-3">
          <TouchableOpacity
            className="bg-black/50 p-3 rounded-full"
            onPress={() => setShowCamera(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-black/50 p-3 rounded-full"
            onPress={toggleCameraFacing}
          >
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {showProductPanel && (lastScan || result || error) && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
          style={{ maxHeight: "70%", zIndex: 20 }}
        >
          <TouchableOpacity
            onPress={() => setShowProductPanel(false)}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              padding: 6,
              zIndex: 50,
            }}
          >
            <Ionicons name="close" size={28} color="#555" />
          </TouchableOpacity>

          <ScrollView
            className="px-5"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {lastScan && (
              <View className="bg-gray-100 rounded-xl p-3 mb-4 mt-2">
                <Text className="text-gray-600 text-center text-sm">
                  Código escaneado
                </Text>
                <Text className="text-gray-900 text-center font-bold text-base">
                  {lastScan.data}
                </Text>
              </View>
            )}

            {result && (
              <ProductView
                product={result}
                onUpdateStockPress={openStockUpdater}
              />
            )}

            {error === "NOT_FOUND" && (
              <AddProductForm
                newName={newName}
                setNewName={setNewName}
                buyPrice={buyPrice}
                setBuyPrice={setBuyPrice}
                sellPrice={sellPrice}
                setSellPrice={setSellPrice}
                stock={stock}
                setStock={setStock}
                marca={marca}
                setMarca={setMarca}
                imgurl={imgurl}
                setImgurl={setImgurl}
                error={error}
                isCreating={isCreating}
                onCreateProduct={handleCreateProduct}
              />
            )}

            {error !== "NOT_FOUND" && error && (
              <View className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                <Text className="text-red-600 text-center">{error}</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {showStockModal && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="absolute bottom-0 left-0 right-0"
          style={{ zIndex: 50 }}
        >
          <View className="bg-white p-6 rounded-t-3xl shadow-2xl">
            <Text className="text-lg font-bold mb-3 text-gray-800">
              Actualizar Stock
            </Text>

            <TextInput
              value={newStockValue}
              onChangeText={setNewStockValue}
              keyboardType="numeric"
              className="bg-gray-100 px-4 py-3 rounded-xl mb-4 border border-gray-300"
              placeholder="Nuevo stock"
            />

            <TextInput
              value={notes}
              onChangeText={setNotes}
              className="bg-gray-100 px-4 py-3 rounded-xl mb-4 border border-gray-300"
              placeholder="Notas (opcional)"
            />

            <TouchableOpacity
              className={`py-4 rounded-xl ${
                isUpdatingStock ? "bg-blue-400" : "bg-blue-600"
              }`}
              onPress={handleUpdateStock}
              disabled={isUpdatingStock}
            >
              <Text className="text-center text-white font-bold">
                {isUpdatingStock ? "Guardando..." : "Guardar cambios"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 py-3 rounded-xl"
              onPress={() => setShowStockModal(false)}
            >
              <Text className="text-center text-gray-600 font-bold">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {toastMessage && (
        <View
          style={{
            position: "absolute",
            bottom: 40,
            left: 20,
            right: 20,
            backgroundColor: toastType === "success" ? "#16a34a" : "#dc2626",
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            zIndex: 9999,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 6,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            {toastMessage}
          </Text>
        </View>
      )}
    </View>
  );
}
