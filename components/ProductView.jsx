import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProductView = ({ product }) => {
  return (
    <View className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <View className="flex-row items-center justify-center mb-4">
        <View className="bg-green-100 p-2 rounded-full mr-2">
          <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
        </View>
        <Text className="text-gray-800 text-lg font-bold">
          Producto encontrado
        </Text>
      </View>

      {Object.entries(product).map(([key, value]) => {
        if (key === "_id" || key === "__v") return null;

        return (
          <View className="mb-3" key={key}>
            <Text className="text-gray-600 text-xs font-semibold uppercase mb-1">
              {key === "buyPrice"
                ? "Precio Compra"
                : key === "sellPrice"
                ? "Precio Venta"
                : key === "barcode"
                ? "Código"
                : key === "imgurl"
                ? "Imagen"
                : key}
            </Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Text className="text-gray-900 text-base">
                {key === "buyPrice" || key === "sellPrice"
                  ? `$${Number(value).toFixed(2)}`
                  : String(value)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ProductView;
