import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../utils/authStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const LoginScreen = () => {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const resetError = useAuthStore((state) => state.resetError);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    resetError();
  }, [resetError]);

  const loginHandler = async () => {
    if (loading) return;
    if (!email.trim() || !password) {
      setLocalError("Ingrese correo y contraseña");
      return;
    }
    setLocalError(null);
    try {
      await login(email, password);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 px-6 justify-center">
              {/* Icon */}
              <View className="bg-blue-100 p-5 rounded-full self-center mb-6">
                <Ionicons name="qr-code" size={40} color="#1E63EE" />
              </View>

              {/* Title */}
              <Text className="text-3xl font-bold text-center">Bienvenido</Text>
              <Text className="text-gray-500 text-center mb-8">
                Inicia sesión con tu cuenta
              </Text>

              {/* Email */}
              <Text className="font-semibold mb-1">Correo</Text>
              <TextInput
                placeholder="Ingresa tu correo"
                className="h-12 border border-gray-300 rounded-xl px-3 bg-gray-50 mb-4"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Password */}
              <Text className="font-semibold mb-1">Contraseña</Text>
              <View className="relative">
                <TextInput
                  placeholder="Ingresa tu contraseña"
                  secureTextEntry={!showPassword}
                  className="h-12 border border-gray-300 rounded-xl px-3 bg-gray-50 mb-4"
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 p-1"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#999"
                  />
                </Pressable>
              </View>

              {(localError || error) && (
                <Text className="text-red-500 text-center mb-2">
                  {localError || error}
                </Text>
              )}

              {/* Button - igual al estilo movements */}
              <TouchableOpacity
                disabled={loading}
                onPress={loginHandler}
                className={`h-14 rounded-xl justify-center items-center mt-3 ${
                  loading ? "bg-blue-300" : "bg-blue-600"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-lg font-bold">
                    Iniciar sesión
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LoginScreen;
