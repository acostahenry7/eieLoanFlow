import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GpsScreen from "../screens/GpsScreen";
import MapScreen from "../screens/MapScreen";

const Stack = createStackNavigator();

export default function GpsNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Gps"
      screenOptions={{ unmountOnBlur: true }}
    >
      {/* <Stack.Screen name="Gps" component={GpsScreen} /> */}
      <Stack.Screen name="Maps" component={MapScreen} />
    </Stack.Navigator>
  );
}
