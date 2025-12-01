import { Stack } from "expo-router";
import { useAuthStore } from "../utils/authStore";
import "@/global.css";

const RootLayout = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="index" />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="main" />
      </Stack.Protected>
      {/* Expo Router includes all routes by default. Adding Stack.Protected creates exceptions for these screens. */}
    </Stack>
  );
};

export default RootLayout;
