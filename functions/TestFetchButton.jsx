import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { fetchProduct } from '../services/products';

export default function TestFetchButton() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    try {
      const data = await fetchProduct(0);
      setResult(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  // 🔹 Componente auxiliar para mostrar cada campo en un recuadro
  const FieldBox = ({ label, value }) => (
    <View className="bg-white shadow p-3 rounded-lg mb-3 border border-gray-300">
      <Text className="text-gray-600 font-semibold">{label}</Text>
      <Text className="text-black text-lg">{String(value)}</Text>
    </View>
  );

  return (
    <View className="w-full mt-4">
      <TouchableOpacity
        className="items-center justify-center bg-blue-500 rounded-lg py-3"
        onPress={handleTest}
      >
        <Text className="text-white font-semibold text-center">
          Probar GET del endpoint
        </Text>
      </TouchableOpacity>

      {/* RESULTADO EN RECUADROS */}
      {result && (
        <View className="mt-4">
          <Text className="text-xl font-bold mb-3">📦 Datos del producto</Text>

          {/* 🔥 Crear recuadros dinámicos en base al JSON */}
          {Object.entries(result).map(([key, value]) => (
            <FieldBox key={key} label={key} value={value} />
          ))}
        </View>
      )}

      {error && (
        <Text className="text-red-500 mt-3 text-center">Error: {error}</Text>
      )}
    </View>
  );
}
