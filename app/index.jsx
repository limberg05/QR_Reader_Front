import {
  Text,
  View,
  StyleSheet,
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
    if (loading) return; // prevent double submit
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
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      )}
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.iconContainer}>
                <Ionicons name="qr-code" size={40} color="#1E63EE" />
              </View>

              <Text style={styles.title}>Bienvenido</Text>
              <Text style={styles.subtitle}>Inicia sesión con tu cuenta</Text>

              {/* Form */}
              <Text style={styles.label}>Correo</Text>
              <TextInput
                placeholder="Ingresa tu correo"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Correo electrónico"
              />

              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Ingresa tu contraseña"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  accessibilityLabel="Contraseña"
                />
                <Pressable
                  style={styles.togglePassword}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#999"
                  />
                </Pressable>
              </View>

              {(localError || error) && (
                <Text style={{ color: "red" }}>{localError || error}</Text>
              )}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={loginHandler}
                disabled={loading}
                accessibilityLabel="Iniciar sesión"
              >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
    justifyContent: "center",
  },
  iconContainer: {
    backgroundColor: "#E6EEFF",
    padding: 18,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
  },
  label: {
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1E63EE",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
  },
  passwordContainer: {
    position: "relative",
  },
  togglePassword: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
  },
});
export default LoginScreen;
