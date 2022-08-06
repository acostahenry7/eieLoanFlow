import { View, Text, StyleSheet, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { useSelector } from "react-redux";
import { selectOrigin } from "../redux/slices/navSlice";
import Geolocation from "@react-native-community/geolocation";

export default function Map(props) {
  const { address } = props;

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
            title="Tu ubicación"
            //description={origin.description}
            identifier="origin"
            onPress={() => {
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
