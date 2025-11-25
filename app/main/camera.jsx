import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Constants from "expo-constants";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { fetchProduct, createProduct } from "../../services/products";
import { CameraViewComponent } from "../../components/ui/CameraViewComponent";
import { HomeScreen } from "../../components/ui/HomeScreen";
import "@/global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function QrReader() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [hasScanned, setHasScanned] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Estado del formulario consolidado
  const [formData, setFormData] = useState({
    name: "",
    buyPrice: "",
    sellPrice: "",
    stock: "",
    marca: "",
    imgurl: "",
  });

  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
    if (Constants.appOwnership !== "expo") {
      MediaLibrary.requestPermissionsAsync().catch(() => {});
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (hasScanned) return;

    setHasScanned(true);
    setLastScan({ type, data });

    try {
      const productData = await fetchProduct(data);
      setResult(productData);
      setError(null);
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

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateProduct = async () => {
    try {
      setIsCreating(true);

      const created = await createProduct({
        barcode: lastScan?.data,
        name: formData.name,
        buyPrice: Number(formData.buyPrice),
        sellPrice: Number(formData.sellPrice),
        stock: Number(formData.stock),
        marca: formData.marca,
        imgurl: formData.imgurl,
      });

      setResult(created);
      setError(null);

      // Resetear formulario
      setFormData({
        name: "",
        buyPrice: "",
        sellPrice: "",
        stock: "",
        marca: "",
        imgurl: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  // Vista de permisos
  if (!permission?.granted) {
    return (
      <GluestackUIProvider>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg mb-4">No hay permisos de camara</Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={requestPermission}
          >
            <Text className="text-white font-bold">Dar permisos</Text>
          </TouchableOpacity>
        </View>
      </GluestackUIProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        {!showCamera ? (
          <HomeScreen
            onOpenCamera={() => setShowCamera(true)}
            result={result}
            error={error}
            formData={formData}
            onFormChange={handleFormChange}
            onCreateProduct={handleCreateProduct}
            isCreating={isCreating}
          />
        ) : (
          <CameraViewComponent
            cameraRef={cameraRef}
            facing={facing}
            onBarcodeScanned={handleBarCodeScanned}
            onToggleFacing={toggleCameraFacing}
            onClose={() => setShowCamera(false)}
            lastScan={lastScan}
            result={result}
            error={error}
            formData={formData}
            onFormChange={handleFormChange}
            onCreateProduct={handleCreateProduct}
            isCreating={isCreating}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
