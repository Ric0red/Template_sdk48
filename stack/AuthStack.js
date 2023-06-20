import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Screens
import HomeScreen from "../screens/auth/HomeScreen";
import LogIn from "../screens/auth/LogIn";
import SignIn from "../screens/auth/SignIn";
import ForgotPassword from "../screens/auth/ForgotPassword";

// Main Auth Stack
const Auth = createNativeStackNavigator();
// Navigator Options
const Options = {
  initialRouteName: "HomeScreen",
  headerShown: false,
  animation: "slide_from_right",
};

const AuthStack = () => {
  return (
    <Auth.Navigator screenOptions={Options}>
      <Auth.Screen name="HomeScreen" component={HomeScreen} />
      <Auth.Screen name="LogIn" component={LogIn} />
      <Auth.Screen name="SignIn" component={SignIn} />
      <Auth.Screen name="ForgotPassword" component={ForgotPassword} />
    </Auth.Navigator>
  );
};

export default AuthStack;
