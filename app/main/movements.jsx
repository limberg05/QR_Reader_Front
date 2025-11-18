import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { fetchMovements } from "../../services/movements";

const Movements = ({ darkMode }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMovements();
  }, []);

  const getMovements = async () => {
    setLoading(true);
    try {
      const movementsData = await fetchMovements();
      setResult(movementsData);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("NOT_FOUND");
      } else {
        setError(err.message);
      }
      setResult(null);
    }
    setLoading(false);
  };

  const MovementsView = ({ movements }) => {
    if (!movements || movements.length === 0) {
      return (
        <View className="mt-4">
          <Text className={darkMode ? "text-white" : "text-gray-800"}>
            No se encontraron Movimientos.
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Text
          className={
            darkMode
              ? "text-white text-center mb-4 text-xl font-bold"
              : "text-gray-800 text-center mb-4 text-xl font-bold"
          }
        >
          Movimientos encontrados
        </Text>

        {movements.map((movement, index) => (
          <View
            key={index}
            className={
              darkMode
                ? "mt-4 bg-white/10 p-4 rounded-2xl border border-white/10 ml-4 mr-4"
                : "mt-4 bg-white p-4 rounded-2xl border border-gray-200 ml-4 mr-4"
            }
          >
            <Text
              className={
                darkMode
                  ? "text-blue-400 text-lg font-semibold mb-3"
                  : "text-blue-600 text-lg font-semibold mb-3"
              }
            >
              Movimiento #{movement.id}
            </Text>

            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] space-y-2">
                <View>
                  <Text className="text-gray-500 text-xs dark:text-white/70">
                    Barcode
                  </Text>
                  <Text className="text-base font-medium dark:text-white">
                    {movement.barcode}
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-500 text-xs dark:text-white/70">
                    Quantity
                  </Text>
                  <Text
                    className={
                      movement.quantity < 0
                        ? "text-red-500 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {movement.quantity}
                  </Text>
                </View>
              </View>

              <View className="w-[48%] space-y-2">
                <View>
                  <Text className="text-gray-500 text-xs dark:text-white/70">
                    User
                  </Text>
                  <Text className="text-base font-medium dark:text-white">
                    {movement.user_id}
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-500 text-xs dark:text-white/70">
                    Notes
                  </Text>
                  <Text className="text-base dark:text-white">
                    {movement.notes ?? "—"}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              className={
                darkMode
                  ? "text-white/60 text-xs mt-4"
                  : "text-gray-500 text-xs mt-4"
              }
            >
              {movement.timestamp}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <ScrollView>
          {result && <MovementsView movements={result} />}
          {error !== "NOT_FOUND" && error && (
            <Text className="text-red-400 mt-3 text-center">{error}</Text>
          )}
        </ScrollView>
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            disabled={loading}
            className={`px-8 py-4 rounded-xl ${
              loading ? "bg-blue-300" : "bg-blue-600"
            }`}
            onPress={getMovements}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-xl font-bold text-white">Actualizar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Movements;
