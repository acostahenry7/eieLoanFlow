import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import Map from "../components/Map";
import Geolocation from "@react-native-community/geolocation";

const MapScreen = (props) => {
  //console.log(props);
  const [test, setTest] = useState(null);

  Geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      setTest(position.coords);
    },
    (error) => {
      // Alert.alert(
      //   "Error de GPS",
      //   "Error accediendo a su ubicación, habilite la ubicación por gps en su dispositivo."
      // );
    },
    { enableHighAccuracy: false, timeout: 20000 }
  );

  return (
    <View>
      <View style={tw`h-1/2`}>
        <Map origin={test} />
      </View>
      <View style={tw`h-1/2`}>
        <Text>{test?.latitude}</Text>
      </View>
    </View>
  );
};

export default MapScreen;
