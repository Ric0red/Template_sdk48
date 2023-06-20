import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useUserAuth } from "../context/UserAuthContext";

// import screens
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
// navigator options
const Options = { headerShown: false };

const Main = createNativeStackNavigator();

const MainStack = () => {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(true);
  // user context -- NOTA: evaluar el usuario logeado con types
  //const { user } = useUserAuth;

  if (loading) {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color={"purple"} />
      </View>
    );
  }

  if (user) {
    return (
      <Main.Navigator screenOptions={Options}>
        <Main.Screen name="App" component={AppStack} />
      </Main.Navigator>
    );
  }

  if (loading) {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color={"purple"} />
      </View>
    );
  }

  return (
    <Main.Navigator screenOptions={Options}>
      <Main.Screen name="Auth" component={AuthStack} />
    </Main.Navigator>
  );
};
export default MainStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
