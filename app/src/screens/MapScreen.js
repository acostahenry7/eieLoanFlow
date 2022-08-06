import {
  View,
  Text,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import Map from "../components/Map";
import Geolocation from "@react-native-community/geolocation";
import { generateCoordsByAddress } from "../api/geolocation/locations";
import Loading from "../components/Loading";
import { getPayementRoutes } from "../api/payments";
import useAuth from "../hooks/useAuth";

const MapScreen = (props) => {
  //console.log(props);
  const [test, setTest] = useState(null);
  const [address, setAddress] = useState({ lng: 0, lat: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState();
  const { auth } = useAuth();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await getPayementRoutes(auth.employee_id);
      setCurrentCustomer(response.data[0]);
      setIsLoading(false);
      setCustomers(response.data);
      console.log(response.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await generateCoordsByAddress(
        currentCustomer?.section.replace("-", " ") +
          " " +
          currentCustomer.location.replace("C/", "Calle ").replace("NO.", "# ")
      );
      setAddress({
        lng: response.results[0].geometry.location.lng,
        lat: response.results[0].geometry.location.lat,
      });
      console.log("hi", address);
    })();
  }, [currentCustomer]);

  // useEffect(() => {
  //   ((async) => {
  //     Geolocation.getCurrentPosition(
  //       (position) => {
  //         console.log("POSITION", position);
  //         setTest(position.coords);
  //       },
  //       (error) => {
  //         Alert.alert(
  //           "Error de GPS",
  //           "Error accediendo a su ubicación, habilite la ubicación por gps en su dispositivo."
  //         );
  //       },
  //       { enableHighAccuracy: false, timeout: 20000 }
  //     );
  //   })();
  // }, []);

  return (
    <View style={{}}>
      <View style={{ height: "50%" }}>
        {address && <Map address={address} customer={currentCustomer} />}
      </View>
      <ScrollView
        style={{
          height: "50%",
          borderTopStartRadius: 20,
          borderTopEndRadius: 20,
          borderTopColor: "black",
          borderWidth: 0.5,
          borderBottomWidth: 0,
          elevation: 4,
          backgroundColor: "whitesmoke",
        }}
      >
        <Text
          style={{
            padding: 5,
            textAlign: "center",
            color: "rgba(0,0,0,0.3)",
          }}
        >
          Clientes en Ruta
        </Text>
        {isLoading ? (
          <Loading />
        ) : (
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 15,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {customers?.map((item) => (
              <TouchableWithoutFeedback
                onPress={() => setCurrentCustomer(item)}
              >
                <View style={{}}>
                  <View
                    style={{
                      padding: 10,
                      backgroundColor: "white",
                      marginVertical: 5,
                      elevation: 4,
                      width: 185,

                      alignItems: "center",
                      justifyContent: "center",
                      marginHorizontal: 4,
                      borderRadius: 10,
                      borderLeftWidth: 2,
                      borderBottomWidth: 1,
                      borderColor: "grey",
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    <Text>{item.section + " " + item.location}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MapScreen;
