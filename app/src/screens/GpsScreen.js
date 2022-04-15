import React from "react";
import { View, Text, ScrollView, SafeAreaView, Alert } from "react-native";
import { GOOGlE_MAPS_APIKEY } from "@env";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../redux/slices/navSlice";
import { useNavigation } from "@react-navigation/native";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";

export default function GpsScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, paddingHorizontal: 5 }}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        debounce={400}
        enablePoweredByContainer={false}
        returnKeyType={"search"}
        onPress={(data, details = null) => {
          dispatch(
            setOrigin({
              location: details.geometry.location,
              description: data.description,
            })
          );

          dispatch(setDestination(null));
          console.log(data, details);
        }}
        fetchDetails={true}
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            fontSize: 18,
          },
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        query={{
          key: "AIzaSyBo4DIGnZdB__TMfDnxrLtNB-Xe7Yl1hDY",
          language: "es",
        }}
      />

      <Text
        onPress={async () => {
          const permissions =
            await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
              interval: 10000,
              fastInterval: 5000,
            });
          console.log(permissions);
          if (permissions == "already-enabled") {
            navigation.navigate("GpsRoot", { screen: "Maps" });
          } else if (permissions == "enabled") {
            Alert.alert("Ubicación activada!", "Acceda a la navegación.");
          }
        }}
      >
        Go to Map Screen
      </Text>
    </View>
  );
}

// <View>
//     <GooglePlacesAutocomplete
//         placeholder='A donde vamos?'
//         debounce={400}
//         onPress={(data, details = null) => {
//             // 'details' is provided when fetchDetails = true
//             console.log(data, details);
//           }}
//         style={{
//             flex: 0
//         }}
//         nearbyPlacesAPI='GooglePlacesSearch'
//         query={{
//             key: 'AIzaSyBo4DIGnZdB__TMfDnxrLtNB-Xe7Yl1hDY',
//             language: 'es',
//         }}
//     />
// </View>

// <Text style={{textAlignVertical: 'center', textAlign: 'center', color: 'black'}}>Modulo GPS</Text>
// <Text style={{textAlignVertical: 'center', textAlign: 'center', color: 'grey'}}>Actualmente en Desarrollo</Text>
