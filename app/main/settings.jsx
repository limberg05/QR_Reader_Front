import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useAuthStore } from "../../utils/authStore";
import { jwtDecode } from "jwt-decode";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { fetchUser } from "../../services/users";
import { registerUser } from "../../services/users";
import { Ionicons } from "@expo/vector-icons";

const Settings = () => {
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const [userInfo, setUserInfo] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");

  const showToast = (msg, isError = false) => {
    setToast(msg);
    setToastType(isError ? "error" : "success");
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.sub;

    loadUser(userId);
  }, [token]);

  const loadUser = async (id) => {
    try {
      const data = await fetchUser(id);
      setUserInfo(data);
    } catch (err) {
      console.log("Error cargando usuario:", err);
    }
  };

  if (!userInfo) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 text-lg mt-2">Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-5">
      <StatusBar style="dark" />

      <Text className="text-3xl font-extrabold text-gray-900 mt-4 mb-6">
        Configuración
      </Text>

      <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
        <Text className="text-xl font-semibold text-gray-800 mb-4">
          Información del Usuario
        </Text>

        <Info label="Nombre" value={userInfo.name} />
        <Info label="Email" value={userInfo.email} />
        <Info label="ID" value={userInfo.id} />
        <Info
          label="Rol"
          value={userInfo.isAdmin ? "Administrador" : "Usuario"}
        />
      </View>

      {isAdmin && (
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-2xl flex-row items-center justify-center shadow-md mt-8"
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="person-add" size={22} color="white" />
          <Text className="text-white text-lg font-semibold ml-2">
            Agregar Usuario
          </Text>
        </TouchableOpacity>
      )}

      <View className="mt-10 items-center mb-10">
        <TouchableOpacity
          className="bg-red-600 px-6 py-4 rounded-2xl shadow-md flex-row items-center"
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={22} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>

      <AddUserModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(msg, error) => showToast(msg, error)}
      />

      {toast && (
        <View
          className={`absolute bottom-10 left-6 right-6 p-4 rounded-2xl shadow-lg ${
            toastType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <Text className="text-white text-center font-semibold">{toast}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Settings;

const Info = ({ label, value }) => (
  <View className="mb-4">
    <Text className="text-gray-500 text-sm">{label}</Text>
    <Text className="text-gray-900 font-medium text-base">{value}</Text>
    <View className="h-[1px] bg-gray-200 mt-2" />
  </View>
);

const AddUserModal = ({ visible, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleSave = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Campos incompletos", "Todos los campos son requeridos.");
      return;
    }

    Alert.alert("Confirmar", "¿Deseas crear este usuario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Crear",
        onPress: () => submitUser(),
      },
    ]);
  };

  const submitUser = async () => {
    setLoading(true);
    try {
      const userObject = {
        name,
        email,
        password,
        isAdmin,
      };

      await registerUser(userObject);

      onSuccess("Usuario creado correctamente");

      setName("");
      setEmail("");
      setPassword("");
      setIsAdmin(false);

      onClose();
    } catch (err) {
      console.log(err);
      onSuccess("Error creando usuario", true);
    }
    setLoading(false);
  };

  return (
    <View className="absolute inset-0 bg-black/50 justify-center px-6 z-50">
      <View className="bg-white rounded-3xl p-6 shadow-xl">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Agregar nuevo usuario
        </Text>

        <Text className="text-gray-600 mb-1">Nombre</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nombre"
          className="bg-gray-100 px-4 py-3 rounded-xl mb-4"
        />

        <Text className="text-gray-600 mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="email@ejemplo.com"
          className="bg-gray-100 px-4 py-3 rounded-xl mb-4"
        />

        <Text className="text-gray-600 mb-1">Contraseña</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Contraseña"
          className="bg-gray-100 px-4 py-3 rounded-xl mb-4"
        />
        <View className="flex-row items-center justify-between bg-gray-100 px-4 py-3 rounded-xl mb-4">
          <Text className="text-gray-800 font-medium">Administrador</Text>

          <TouchableOpacity
            onPress={() => setIsAdmin(!isAdmin)}
            activeOpacity={0.8}
            className={`w-14 h-8 rounded-full flex-row items-center px-1 ${
              isAdmin ? "bg-blue-600" : "bg-gray-400"
            }`}
          >
            <View
              className={`w-6 h-6 rounded-full bg-white shadow ${
                isAdmin ? "ml-6" : "ml-0"
              }`}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            className="px-6 py-3 bg-gray-300 rounded-xl"
            onPress={onClose}
          >
            <Text className="font-semibold text-gray-800">Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-6 py-3 rounded-xl ${
              loading ? "bg-blue-300" : "bg-blue-600"
            }`}
            onPress={handleSave}
            disabled={loading}
          >
            <Text className="font-semibold text-white">
              {loading ? "Guardando..." : "Guardar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
