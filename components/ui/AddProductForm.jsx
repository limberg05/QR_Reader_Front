import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export const AddProductForm = ({
  darkMode = false,
  formData,
  onFormChange,
  onSubmit,
  isCreating = false,
}) => {
  return (
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
        Producto no encontrado
      </Text>

      <View>
        <Text className={darkMode ? "text-white mb-1" : "text-gray-700 mb-1"}>
          Nombre:
        </Text>
        <TextInput
          className="bg-white rounded-lg px-3 py-2"
          onChangeText={(val) => onFormChange("name", val)}
          value={formData.name}
        />
      </View>

      <View className="mt-4">
        <Text className={darkMode ? "text-white mb-1" : "text-gray-700 mb-1"}>
          Precio compra:
        </Text>
        <TextInput
          className="bg-white rounded-lg px-3 py-2"
          keyboardType="numeric"
          onChangeText={(val) => onFormChange("buyPrice", val)}
          value={formData.buyPrice}
        />
      </View>

      <View className="mt-4">
        <Text className={darkMode ? "text-white mb-1" : "text-gray-700 mb-1"}>
          Precio venta:
        </Text>
        <TextInput
          className="bg-white rounded-lg px-3 py-2"
          keyboardType="numeric"
          onChangeText={(val) => onFormChange("sellPrice", val)}
          value={formData.sellPrice}
        />
      </View>

      <View className="mt-4">
        <Text className={darkMode ? "text-white mb-1" : "text-gray-700 mb-1"}>
          Stock:
        </Text>
        <TextInput
          className="bg-white rounded-lg px-3 py-2"
          keyboardType="numeric"
          onChangeText={(val) => onFormChange("stock", val)}
          value={formData.stock}
        />
      </View>

      <View className="mt-4">
        <Text className={darkMode ? "text-white mb-1" : "text-gray-700 mb-1"}>
          Marca:
        </Text>
        <TextInput
          className="bg-white rounded-lg px-3 py-2"
          onChangeText={(val) => onFormChange("marca", val)}
          value={formData.marca}
        />
      </View>

      <View className="mt-4">
        <Text className={darkMode ? "text-white mb-1" : "text-gray-700 mb-1"}>
          Imagen URL:
        </Text>
        <TextInput
          className="bg-white rounded-lg px-3 py-2"
          onChangeText={(val) => onFormChange("imgurl", val)}
          value={formData.imgurl}
        />
      </View>

      <TouchableOpacity
        className="bg-green-600 py-3 rounded-lg mt-5"
        onPress={onSubmit}
        disabled={isCreating}
      >
        <Text className="text-white text-center font-bold text-lg">
          {isCreating ? "Guardando..." : "Agregar producto"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
