import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import CustomerScreen from "../screens/CustomerScreen";
import CustomerInfoScreen from "../screens/CustomerInfoScreen";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

const Stack = createStackNavigator();

export default function CustomerNavigation(props) {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName="Customers"
      screenOptions={{ unmountOnBlur: true }}
    >
      <Stack.Screen
        name="Customers"
        component={CustomerScreen}
        options={{
          title: "Clientes",
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name="Customer"
        component={CustomerInfoScreen}
        options={{
          title: "Cliente",
          headerLeft: () => (
            <Icon
              name="arrow-left"
              size={18}
              color={"black"}
              onPress={() =>
                navigation.navigate("Customers", { screen: "Customers" })
              }
              style={{
                paddingHorizontal: 25,
                paddingVertical: 10,
              }}
            />
          ),
          unmountOnBlur: true,
        }}
      />
    </Stack.Navigator>
  );
}

//
