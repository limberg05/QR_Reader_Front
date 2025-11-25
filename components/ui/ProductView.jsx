import React from "react";
import { View, Text } from "react-native";

export const ProductView = ({ product, darkMode = false }) => (
  <View
    className={
      darkMode
        ? "mt-4 bg-white/20 p-5 rounded-xl border border-white/20"
        : "mt-4 bg-gray-100 p-5 rounded-xl border border-gray-300"
    }
  >
    <Text
      className={
        darkMode
          ? "text-white text-center mb-4 text-xl font-bold"
          : "text-gray-800 text-center mb-4 text-xl font-bold"
      }
    >
      Producto encontrado
    </Text>

    {Object.entries(product).map(([key, value]) => (
      <View className="mb-4" key={key}>
        <Text
          className={
            darkMode
              ? "text-white mb-1 capitalize"
              : "text-gray-700 mb-1 capitalize"
          }
        >
          {key}:
        </Text>

        <View className="bg-white rounded-lg px-3 py-2">
          <Text className="text-black">{String(value)}</Text>
        </View>
      </View>
    ))}
  </View>
);
