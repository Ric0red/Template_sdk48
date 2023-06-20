import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// TO SHOW ALERT
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
// TO REGISTER MY TOKEN
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "13cf9775-2d47-4a37-bdae-308680c73bfd",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const notificationContext = createContext();

export function NotificationContextProvider({ children }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  // VIEW STATE FORM MEMORY
  const [notificationLocal, setNotificationLocal] = useState([]);
  // ARRAY OF NOTIFICATIONS
  const [notifications, setNotifications] = useState([]);

  const navigation = useNavigation();
  const notificationListener = useRef();
  const responseListener = useRef();

  // Función para manejar las notificaciones recibidas
  const handleNotification = async (notification) => {
    // Añadimos la notificación recibida al estado del componente
    setNotifications((notifications) => [
      ...notifications,
      { ...notification, isRead: false },
    ]);
    // Almacenamos las notificaciones de forma persistente en el dispositivo
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify([...notifications, { ...notification, isRead: false }])
    );
  };

  useEffect(() => {
    // EXEC - REGISTER MY TOKEN
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // NOTIFICATION LISTENER
    // Escuchar las notificaciones entrantes
    notificationListener.current =
      Notifications.addNotificationReceivedListener(handleNotification);
    // Obtenemos las notificaciones almacenadas de forma persistente en el dispositivo
    AsyncStorage.getItem("notifications").then((data) => {
      if (data) {
        // Actualizamos el estado del componente con las notificaciones almacenadas
        setNotifications(JSON.parse(data));
      }
    });

    // ON USER PRESS LISTENER
    // Escuchar las interacciones del usuario con las notificaciones
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const notificationId = response.notification.request.identifier;
        const notificationData = response.notification.request.content.data;
        // Comparando el id es el seleccionado y marcandolo como abierto.
        setNotifications((notifications) =>
          notifications.map((notification) => {
            if (notification.request.identifier === notificationId) {
              return { ...notification, isRead: true };
            }
            return notification;
          })
        );
        // Navegar a otra pantalla
        navigation.navigate("OnPay", { notificationData: notificationData });
      });

    // UNSUBSCRIBE LISTENERS
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // RETURN VALUES
  return (
    <notificationContext.Provider
      value={{
        expoPushToken,
        notifications,
        setNotifications,
        notificationLocal,
        setNotificationLocal,
      }}
    >
      {children}
    </notificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(notificationContext);
}
