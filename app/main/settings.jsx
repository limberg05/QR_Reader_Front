import React from "react";
import { View, Text, Button } from "react-native";
import { useAuthStore } from "../../utils/authStore";

const Settings = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings screen</Text>
      <Button
        title="LogOut"
        onPress={async () => {
          logout();
        }}
      />
    </View>
  );
};

export default Settings;
