import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import { Provider } from "react-native-paper";
import { theme } from "./src/core/theme";
//import { NotificationContextProvider } from "./context/NotificationContext";
import Main from "./stack/Main";

export default function App() {
  return (
    <Provider theme={theme}>
      <UserAuthContextProvider>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </UserAuthContextProvider>
    </Provider>
  );
}
