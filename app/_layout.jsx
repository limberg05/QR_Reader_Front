import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

const RootLayout = () => {
  // Nota: AsyncStorage persiste los datos entre reinicios de la aplicación,
  // por lo que el token de usuario se mantiene y la sesión permanecerá iniciada.
  // Si necesita comportamiento distinto (ej. cerrar sesión al salir) o mayor seguridad,
  // considere usar un almacenamiento seguro (p. ej. SecureStore) o eliminar el token
  // en el flujo de cierre de sesión.

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      console.log("este es el usertoken en layout");
      console.log(userToken);

      if (userToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="main" />
      </Stack.Protected>
      {/* Expo Router includes all routes by default. Adding Stack.Protected creates exceptions for these screens. */}
    </Stack>
  );

  //   const [user, setUser] = useState(null);
  //   const [isLoading, setIsLoading] = useState(true);
  //   const router = useRouter();

  //   useEffect(() => {
  //     checkAuthentication();
  //   }, []);

  //   const checkAuthentication = async () => {
  //     try {
  //       const userToken = await AsyncStorage.getItem("userToken");
  //       if (userToken) {
  //         setUser({ name: "user", isAdmin: true, token: userToken });
  //       } else {
  //         setUser(false);
  //       }
  //     } catch (e) {
  //       console.error(e);
  //       setUser(false);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     if (!isLoading) {
  //       if (!user) {
  //         console.log("Redirecting to login");
  //         router.replace("/login");
  //       } else {
  //         console.log("Redirecting to camera");
  //         router.replace("/(app)/camera");
  //       }
  //     }
  //   }, [user, isLoading, router]);

  //   if (isLoading) {
  //     return (
  //       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  //         <Text>Loading...</Text>
  //       </View>
  //     );
  //   }

  //   Mientras redirige, mostrar pantalla de transición
  //   router.replace("/login");
};

export default RootLayout;
