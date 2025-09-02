import { useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );

  useEffect(() => {
    // Register device for push notifications
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    // Get Android channels
    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }

    // Listeners
    const notificationListener = Notifications.addNotificationReceivedListener(
      (n) => setNotification(n)
    );
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) =>
        console.log("Notification response:", response)
      );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // Function to schedule a notification
  const scheduleNotification = async (
    title: string,
    body: string,
    data: Record<string, unknown> = {},
    seconds = 2
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: {
        type: "timeInterval", // ✅ must include type
        seconds, // time interval in seconds
        repeats: false, // optional
      } as Notifications.TimeIntervalTriggerInput, // explicit type cast
    });
  };

  return {
    expoPushToken,
    notification,
    channels,
    scheduleNotification,
  };
}

// Function to register device for push notifications
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) throw new Error("Project ID not found");

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Expo Push Token:", token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  return token;
}
