import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchProduct, createProduct } from "../../services/products";
import ProductView from "../../components/ProductView";
import AddProductForm from "../../components/AddProductForm";
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

  const handleCreateProduct = async () => {
    if (!newName.trim() || !buyPrice || !sellPrice) {
      setError("Por favor completa los campos requeridos");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const created = await createProduct({
        barcode: lastScan?.data,
        name: newName,
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        stock: Number(stock) || 0,
        marca,
        imgurl,
      });

      setResult(created);
      setError(null);

      // Reset form
      setNewName("");
      setBuyPrice("");
      setSellPrice("");
      setStock("");
      setMarca("");
      setImgurl("");
    } catch (err) {
      setError(err.message || "Error al crear producto");
    } finally {
      setIsCreating(false);
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
            onPress={requestPermission}
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
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
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

            {/* Botón abrir cámara */}
            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center mb-6 shadow-sm"
              onPress={() => setShowCamera(true)}
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Abrir cámara
              </Text>
            </TouchableOpacity>

            {/* Resultados */}
            {result && <ProductView product={result} />}
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
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Cámara - Pantalla completa */}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        autoFocus="on"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
      />

      {/* Botones superiores - Sobre la cámara */}
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

      {/* Panel inferior con resultados */}
      {(lastScan || result || error) && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl"
          style={{ maxHeight: "70%", zIndex: 20 }}
        >
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-3 mb-2" />

          <ScrollView
            className="px-5"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
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

            {result && <ProductView product={result} />}
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
    </View>
  );
}
