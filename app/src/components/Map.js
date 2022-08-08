import { View, Text, StyleSheet, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { useSelector } from "react-redux";
import { selectOrigin } from "../redux/slices/navSlice";
import Geolocation from "@react-native-community/geolocation";

export default function Map(props) {
  const { address, customer } = props;

  const [customerName, setCustomerName] = useState("customer");

  useEffect(() => {
    (() => {
      setCustomerName(customer.name);
    })();
  }, [customer]);

  const [newCustomers, setNewCustomers] = useState([]);

  return (
    <MapView
      style={{ flex: 1 }}
      mapType={"standard"}
      initialRegion={{
        latitude: address.lat,
        longitude: address.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      region={{
        latitude: address.lat,
        longitude: address.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {
        address && (
          <Marker
            coordinate={{
              latitude: address.lat || 0,
              longitude: address.lng || 0,
            }}
            title={customerName}
            //description={origin.description}
            identifier="origin"
            onPress={() => {
              setCustomerName("");
              Linking.openURL(
                `https://www.waze.com/ul?ll=${address.lat}%2C${address.lng}&navigate=yes&zoom=17`
              );
            }}
          />
        )

        /* {origin && (
        <Marker
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          title="Tu ubicación"
          description={origin.description}
          identifier="origin"
        />
      )} */
      }
    </MapView>
  );
}
