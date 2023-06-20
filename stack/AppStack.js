import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../src/core/theme";
import { MD3Colors } from "react-native-paper";
// Screens
import Home from "../screens/navigator/Home";
import Search from "../screens/navigator/Search";
import Profile from "../screens/navigator/Profile";

// Main Stack
const App = createMaterialBottomTabNavigator();
// Nested Stacks
const Home_Stack = createNativeStackNavigator();
const Search_Stack = createNativeStackNavigator();
const Profile_Stack = createNativeStackNavigator();
// Navigator nested Options
const Options = {
  initialRouteName: "Home",
  headerShown: false,
  animation: "slide_from_right",
};

// Nested navigator --Home
const HomeStack = () => {
  return (
    <Home_Stack.Navigator screenOptions={Options}>
      <Home_Stack.Screen name="Home_" component={Home} />
    </Home_Stack.Navigator>
  );
};
// Nested navigator --Search
const SearchStack = () => {
  return (
    <Search_Stack.Navigator screenOptions={Options}>
      <Search_Stack.Screen name="Search_" component={Search} />
    </Search_Stack.Navigator>
  );
};
// Nested navigator --Profile
const ProfileStack = () => {
  return (
    <Profile_Stack.Navigator screenOptions={Options}>
      <Profile_Stack.Screen name="Profile_" component={Profile} />
    </Profile_Stack.Navigator>
  );
};

const AppStack = () => {
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ color, size, focused }) => {
      let iconName;
      iconName = focused ? "desktop-mac-dashboard" : "monitor-dashboard";
      if (route.name === "Home") {
      } else if (route.name === "Search") {
        iconName = focused ? "file-search" : "file-search-outline";
      } else if (route.name === "Profile") {
        iconName = focused ? "account-circle" : "account-circle-outline";
      }
      return (
        <MaterialCommunityIcons
          name={iconName}
          size={focused ? 28 : 24}
          color={color}
        />
      );
    },
    tabBarHideOnKeyboard: true,
    //headerShown: false,
  });

  return (
    <App.Navigator
      screenOptions={screenOptions}
      activeColor={theme.colors.primary}
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: MD3Colors.neutral100, paddingBottom: 0 }}
    >
      <App.Screen name="Home" component={HomeStack} />
      <App.Screen name="Search" component={SearchStack} />
      <App.Screen name="Profile" component={ProfileStack} />
    </App.Navigator>
  );
};

export default AppStack;
