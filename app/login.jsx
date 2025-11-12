import { Text, View, StyleSheet, Button } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const LoginScreen = () => {
  const loginHandler = async () => {
    try {
      console.log("inicio del handler");
      const userToken = "super token"; // logica para el login
      await AsyncStorage.setItem("userToken", userToken);
      console.log("token en el botón del handler");
      console.log(await AsyncStorage.getItem("userToken"));
    } catch (e) {
      console.log(e);
    } finally {
      console.log("se presionó el botón");
    }
  };
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={loginHandler} />
    </View>
  );

  // const router = useRouter();
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // const loginHandler = async () => {
  //   setLoading(true);
  //   try {
  //     const userToken = "super token"; // logica para el login
  //     await AsyncStorage.setItem("userToken", userToken);

  //     //redirect
  //     router.replace("/(app)/camera");
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // return (
  //   <View style={styles.container}>
  //     <Text>Login Screen</Text>
  //     {error && <Text style={styles.error}>{error}</Text>}
  //     <Button title="Login" onPress={loginHandler} />
  //   </View>
  // );
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
