import React from "react";
import { View, Text, Button } from "react-native";
import { useUserState } from "../../hooks/authStore";

const Settings = () => {
  const logOut = useUserState((state) => state.logOut);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings screen</Text>
      <Button
        title="LogOut"
        onPress={async () => {
          console.log("logOut presionado");
          logOut();
        }}
      />
    </View>
  );
};

export default Settings;
