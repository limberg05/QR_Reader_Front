import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useAuthStore } from "../../utils/authStore";
import { jwtDecode } from "jwt-decode";

const Settings = () => {
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  let userInfo = {};
  try {
    userInfo = token ? jwtDecode(token) : {};
  } catch (e) {
    console.log("Error decoding token:", e);
    userInfo = {};
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-black">
      <View className="px-5 py-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </Text>

        {/* ---- USER INFO CARD ---- */}
        <View className="bg-white dark:bg-white/10 rounded-2xl border border-gray-200 dark:border-white/20 p-5">
          <Text className="text-gray-900 dark:text-white text-lg font-semibold mb-2">
            Información del Usuario
          </Text>

          <Text className="text-gray-700 dark:text-white/80">
            <Text className="font-semibold">Email: </Text>
            {userInfo.email || "No disponible"}
          </Text>

          <Text className="text-gray-700 dark:text-white/80 mt-2">
            <Text className="font-semibold">ID: </Text>
            {userInfo.sub || "No disponible"}
          </Text>

          <Text className="text-gray-700 dark:text-white/80 mt-2">
            <Text className="font-semibold">Rol: </Text>
            {isAdmin ? "Administrador" : "Usuario"}
          </Text>
        </View>

        {isAdmin && (
          <View className="mt-6">
            <TouchableOpacity
              className="bg-blue-600 px-6 py-4 rounded-xl shadow-md"
              onPress={() => console.log("Open Add User Modal")}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Agregar Usuario
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="mt-10 items-center">
          <TouchableOpacity
            className="bg-red-600 px-6 py-3 rounded-xl shadow-md"
            onPress={logout}
          >
            <Text className="text-white font-semibold text-lg">
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
