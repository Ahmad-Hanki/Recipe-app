import { COLORS } from "@/constants/colors";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Stack, Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Layout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderWidth: 1,
          paddingBottom: 7,
          paddingTop: 7,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        options={{
          title: "Recipes",
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused ? "restaurant" : "restaurant-outline"}
              size={size}
              color={color}
            />
          ),
        }}
        name="index"
      />
      <Tabs.Screen
        options={{
          title: "Search",
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
        }}
        name="search"
      />
      <Tabs.Screen
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
        name="favorites"
      />
    </Tabs>
  );
}
