import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { useSelector } from "react-redux";
import { selectOrigin } from "../redux/slices/navSlice";
import Geolocation from "@react-native-community/geolocation";
import { generateCoordsByAddress } from "../api/geolocation/locations";

export default function Map(props) {
  const origin = props.origin;

  const [address, SetAddress] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);

  const customers = [
    {
      id: 1,
      address: "Calle 4 33, Ensanche La Paz",
      description: "Location 1",
    },
    {
      id: 1,
      latitude: 18.47839250079818,
      longitude: -69.90586041245985,
      description: "Location 2",
    },
  ];

  let arr = [];
  customers.map((item) => {
    arr.push({
      id: item.id,
      longitude: (async () => {
        const response = await generateCoordsByAddress(
          "Calle 4 33, Ensanche La Paz"
        );
        const result = await response?.results[0].geometry.location.lng;

        console.log(await result);
        return await result;
      })(),
      // latitude: (async () => {
      //   const response = await generateCoordsByAddress(item.address);

      //   return response?.results[0].geometry.location.lat;
      // })(),

      description: item.location,
    });
  });

  useEffect(() => {
    (async () => {
      console.log(await arr);
    })();
  }, []);

  return (
    <MapView
      style={{ flex: 1 }}
      mapType={"standard"}
      initialRegion={{
        latitude: origin?.latitude,
        longitude: origin?.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {
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

        newCustomers?.map(
          (item, index) =>
            // <Marker
            //   key={index}
            //   coordinate={{
            //     latitude: item.latitude - 0.0001,
            //     longitude: item.longitude - 0.00025,
            //     latitudeDelta: 0.5,
            //     longitudeDelta: 2.0,
            //   }}
            //   title="Tu ubicación"
            //   description={item.description}
            //   identifier="origin"
            // />
            undefined
        )
      }
    </MapView>
  );
}
