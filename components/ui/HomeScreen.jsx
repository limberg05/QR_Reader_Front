import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { ProductView } from "./ProductView";
import { AddProductForm } from "./AddProductForm";
import Ionicons from "@expo/vector-icons/Ionicons";

export const HomeScreen = ({
  onOpenCamera,
  result,
  error,
  formData,
  onFormChange,
  onCreateProduct,
  isCreating,
}) => {
  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-white shadow-sm">
        <Text className="text-3xl font-bold text-gray-800 text-center">
          Lector de Códigos
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-2">
          Escanea productos fácilmente
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 32 }}
      >
        {/* Scanner Card */}
        <View className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <View className="items-center mb-4">
            <View className="bg-blue-100 rounded-full p-4 mb-4">
              <Ionicons name="camera" size={36} color="#1E63EE" />
            </View>
            <Text className="text-lg font-semibold text-gray-700 mb-2">
              Escanear Código de Barras
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-4">
              Presiona el botón para abrir la cámara y escanear
            </Text>
          </View>

          <TouchableOpacity
            className="bg-blue-600 active:bg-blue-700 px-8 py-4 rounded-xl shadow-md"
            onPress={onOpenCamera}
          >
            <Text className="text-xl font-bold text-white text-center">
              Abrir Cámara
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {(result || error) && (
          <View className="bg-white rounded-2xl shadow-lg p-6">
            <View className="flex-row items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Resultado del Escaneo
              </Text>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={140}
            >
              {result && <ProductView product={result} />}
              {error === "NOT_FOUND" && (
                <AddProductForm
                  formData={formData}
                  onFormChange={onFormChange}
                  onSubmit={onCreateProduct}
                  isCreating={isCreating}
                />
              )}
              {error !== "NOT_FOUND" && error && (
                <View className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <Text className="text-red-600 text-center font-medium">
                    ⚠️ {error}
                  </Text>
                </View>
              )}
            </KeyboardAvoidingView>
          </View>
        )}

        {/* Instructions Card */}
        {!result && !error && (
          <View className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Instrucciones
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-start mb-2">
                <Text className="text-indigo-600 font-bold mr-2">1.</Text>
                <Text className="text-gray-600 flex-1">
                  Presiona "Abrir Cámara" para iniciar el escáner
                </Text>
              </View>
              <View className="flex-row items-start mb-2">
                <Text className="text-indigo-600 font-bold mr-2">2.</Text>
                <Text className="text-gray-600 flex-1">
                  Apunta la cámara hacia el código de barras
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-indigo-600 font-bold mr-2">3.</Text>
                <Text className="text-gray-600 flex-1">
                  El producto se mostrará automáticamente
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
