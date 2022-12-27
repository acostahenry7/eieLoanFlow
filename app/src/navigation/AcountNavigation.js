import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AcountScreen from "../screens/AcountScreen";
import QRScreen from "../screens/QRScreen";
import QRImageScreen from "../screens/QRImageScreen";
import PrinterScreen from "../screens/PrinterScreen";
import ReportsScreen from "../screens/ReportsScreen";
import SyncScreen from "../screens/SyncScreen";

const Stack = createStackNavigator();

export default function AcountNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Acount"
        component={AcountScreen}
        options={{
          headerShown: true,
          title: "Cuenta",
        }}
      />
      <Stack.Screen
        name="QRManagement"
        component={QRScreen}
        options={{
          title: "Administración de QR",
        }}
      />
      <Stack.Screen
        name="QRPreview"
        component={QRImageScreen}
        options={{
          title: "Generar QR",
        }}
      />

      <Stack.Screen name="Printers" component={PrinterScreen} />

      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: "Reportes",
        }}
      />
      <Stack.Screen
        name="Sync"
        component={SyncScreen}
        options={{
          title: "Sincronización",
        }}
      />
    </Stack.Navigator>
  );
}
