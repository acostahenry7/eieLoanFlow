import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CustomerNavigation from "./CustomerNavigation";
import Icon from "react-native-vector-icons/FontAwesome5";
import PaymentNavigation from "./PaymentNavigation";
import AcountNavigation from "./AcountNavigation";
import GpsNavigation from "./GpsNavigation";
import useAuth from "../hooks/useAuth";

const Tab = createBottomTabNavigator();

export default function NavigationTab() {
  const { auth } = useAuth();

  return (
    <Tab.Navigator initialRouteName="Settings" screenOptions={{}}>
      <Tab.Screen
        name="GpsRoot"
        component={GpsNavigation}
        options={{
          tabBarLabel: "GPS",
          tabBarIcon: ({ color, size }) => (
            <Icon name="location-arrow" color={color} size={size} />
          ),
          unmountOnBlur: true,
        }}
      />

      {auth?.login != "admin" ? (
        <Tab.Screen
          name="PaymentsRoot"
          initialParams={{ loanNumber: null }}
          component={PaymentNavigation}
          options={{
            tabBarLabel: "Cobros",
            tabBarIcon: ({ color, size }) => (
              <Icon name="dollar-sign" color={color} size={size} />
            ),
          }}
        />
      ) : undefined}

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => (
            <Icon style={styles.homeIcon} name="home" color={color} />
          ),
        }}
      />

      {auth?.login != "admin" ? (
        <Tab.Screen
          name="Customers"
          component={CustomerNavigation}
          options={{
            tabBarLabel: "Clientes",
            tabBarIcon: ({ color, size }) => (
              <Icon name="users" color={color} size={size} />
            ),
            unmountOnBlur: true,
          }}
        />
      ) : undefined}

      <Tab.Screen
        name="Settings"
        component={AcountNavigation}
        options={{
          tabBarLabel: "Ajustes",
          tabBarIcon: ({ color, size }) => (
            <Icon name="sliders-h" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  homeIcon: {
    //marginTop: -35,
    borderWidth: 1,
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#2c7be5",
    color: "white",
    fontSize: 35,
    borderRadius: 50,
    paddingLeft: 11,
    paddingTop: 11,
  },
});
