import { Text, View, StyleSheet, Button } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useUserState } from "../hooks/authStore";

const LoginScreen = () => {
  const isLoggedIn = useUserState((state) => state.isLoggedIn);
  const logIn = useUserState((state) => state.logIn);

  const loginHandler = async () => {
    try {
      logIn();
      console.log(isLoggedIn);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={loginHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
