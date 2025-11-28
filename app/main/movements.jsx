import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { fetchMovementsPerProduct } from '../../services/movements';
import { useProductStore } from '../../utils/productStore';

const Movements = () => {
  const selectedBarcode = useProductStore((state) => state.selectedBarcode);

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedBarcode) {
      getMovementsByProduct();
    }
  }, [selectedBarcode]);

  const getMovementsByProduct = async () => {
    if (!selectedBarcode) return;
    setLoading(true);
    try {
      const movementsData = await fetchMovementsPerProduct(selectedBarcode);

      const sorted = [...movementsData].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setResult(sorted);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setResult([]);
        setError(null);
      } else {
        setError(err.message);
        setResult(null);
      }
    }
    setLoading(false);
  };

  const MovementsView = ({ movements }) => {
    if (!movements || movements.length === 0) {
      return (
        <View className="mt-4">
          <Text className="text-gray-800 text-center">
            No se encontraron movimientos para este producto.
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Text className="text-gray-800 text-center mb-4 text-xl font-bold">
          Movimientos del producto {selectedBarcode}
        </Text>

        {movements.map((movement, index) => (
          <View
            key={index}
            className="mt-4 bg-white p-4 rounded-2xl border border-gray-200 ml-4 mr-4"
          >
            <Text className="text-blue-600 text-lg font-semibold mb-3">
              Movimiento #{movement.id}
            </Text>

            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] space-y-2">
                <View>
                  <Text className="text-gray-500 text-xs">Barcode</Text>
                  <Text className="text-base font-medium">
                    {movement.barcode}
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-500 text-xs">Cantidad</Text>
                  <Text
                    className={
                      movement.quantity < 0
                        ? 'text-red-500 font-semibold'
                        : 'text-green-600 font-semibold'
                    }
                  >
                    {movement.quantity}
                  </Text>
                </View>
              </View>

              <View className="w-[48%] space-y-2">
                <View>
                  <Text className="text-gray-500 text-xs">Usuario</Text>
                  <Text className="text-base font-medium">
                    {movement.user_id}
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-500 text-xs">Notas</Text>
                  <Text className="text-base">{movement.notes ?? '—'}</Text>
                </View>
              </View>
            </View>

            <Text className="text-gray-500 text-xs mt-4">
              {movement.timestamp}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1 pt-6">
        <View className="flex-1">
          {!selectedBarcode && (
            <View className="flex-1 justify-center items-center px-6">
              <Text className="text-lg font-bold text-gray-700 text-center">
                Escanea un producto en la pantalla de productos
                {'\n'}para ver sus movimientos aquí.
              </Text>
            </View>
          )}

          {selectedBarcode && (
            <>
              <ScrollView>
                {result && <MovementsView movements={result} />}
                {error && (
                  <Text className="text-red-400 mt-3 text-center">{error}</Text>
                )}
              </ScrollView>

              <View className="absolute bottom-6 right-6">
                <TouchableOpacity
                  disabled={loading}
                  className={`px-8 py-4 rounded-xl ${
                    loading ? 'bg-blue-300' : 'bg-blue-600'
                  }`}
                  onPress={getMovementsByProduct}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-xl font-bold text-white">
                      Actualizar
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Movements;
