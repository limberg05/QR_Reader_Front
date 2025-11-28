import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductView = ({ product, onUpdateStockPress }) => {
  return (
    <View className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      {/* Encabezado */}
      <View className="flex-row items-center justify-center mb-4">
        <View className="bg-green-100 p-2 rounded-full mr-2">
          <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
        </View>
        <Text className="text-gray-800 text-lg font-bold">
          Producto encontrado
        </Text>
      </View>

      {/* Campos */}
      {Object.entries(product).map(([key, value]) => {
        if (key === '_id' || key === '__v') return null;

        return (
          <View className="mb-3" key={key}>
            <Text className="text-gray-600 text-xs font-semibold uppercase mb-1">
              {key}
            </Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Text className="text-gray-900 text-base">{String(value)}</Text>
            </View>
          </View>
        );
      })}

      {/* Botón actualizar stock */}
      <TouchableOpacity
        className="bg-blue-600 mt-4 py-4 rounded-xl"
        onPress={onUpdateStockPress}
      >
        <Text className="text-center text-white font-bold">
          Actualizar Stock
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductView;
