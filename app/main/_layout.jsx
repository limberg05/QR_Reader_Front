import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthStore } from "../../utils/authStore";

const AppLayout = () => {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "blue",
      }}
    >
      <Tabs.Protected guard={isAdmin}>
        <Tabs.Screen
          name="movements"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="list" size={24} color={color} />
            ),
          }}
        />
      </Tabs.Protected>
      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="camera" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default AppLayout;
