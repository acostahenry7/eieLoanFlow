import {
  View,
  Text,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import Map from "../components/Map";
import Geolocation from "@react-native-community/geolocation";
import { generateCoordsByAddress } from "../api/geolocation/locations";
import Loading from "../components/Loading";
import { getPayementRoutes } from "../api/payments";
import useAuth from "../hooks/useAuth";
import Geocoder from "react-native-geocoding";
import { WINDOW_DIMENSION as windowDimensions } from "../utils/constants";

const MapScreen = (props) => {
  //console.log(props);
  const [test, setTest] = useState(null);
  const [address, setAddress] = useState({ lng: 0, lat: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchedCustomer, setSearchedCustomer] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [currentCustomer, setCurrentCustomer] = useState();
  const { auth } = useAuth();

  Geocoder.init("AIzaSyCV2wvw5V8c1hjTjaKyuCXppDjs81uk-n4", { language: "es" });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await getPayementRoutes(auth.employee_id);
      setCurrentCustomer(response.data[0]);
      setIsLoading(false);
      setCustomers(response.data);
      setSearchedCustomer(response.data);
      console.log(response.data);
    })();
  }, []);

  let backgroundColor;

  useEffect(() => {
    (() => {
      console.log(
        currentCustomer?.location
          .replace("C/", "Calle ")
          .replace("NO.", "# ")
          .replace("¥", "Ñ")
      );

      Geocoder.from(
        "Republica Dominicana, Santo Domingo," +
          currentCustomer?.section.replace("-", " ") +
          " " +
          currentCustomer?.location
            .replace("C/", "Calle ")
            .replace("NO.", "# ")
            .replace("¥", "ñ")
      )
        .then((response) => {
          setAddress({
            lng: response.results[0].geometry.location.lng,
            lat: response.results[0].geometry.location.lat,
          });
        })
        .catch((err) => {
          console.log(err);
          Alert.alert(
            "Error al buscar ubicación",
            "No se pudo obtener esta dirección desde maps."
          );
        });
    })();
  }, [currentCustomer]);

  useEffect(() => {
    (() => {
      let searchedCustomers = [];

      if (searchStatus.length > 0) {
        searchedCustomers = customers.filter((customer) => {
          return customer.name
            .toLowerCase()
            .includes(searchStatus.toLowerCase());
        });

        setSearchedCustomer(searchedCustomers);
      } else {
        setSearchedCustomer(customers);
      }
    })();
  }, [searchStatus]);

  return (
    <View style={{}}>
      <View style={{ height: "50%" }}>
        {address && <Map address={address} customer={currentCustomer} />}
      </View>
      <View
        style={{
          height: "50%",
          borderTopStartRadius: 20,
          borderTopEndRadius: 20,
          borderTopColor: "blue",
          borderWidth: 0,
          borderBottomWidth: 0,
          elevation: 7,
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
          <View style={{ height: "100%" }}>
            <TextInput
              placeholder="Escribe el nombre del cliente..."
              onChangeText={(text) => setSearchStatus(text)}
              keyboardType="web-search"
              style={{
                marginTop: 5,
                marginBottom: 10,
                marginLeft: "auto",
                marginRight: "auto",
                height: 20,
                borderWidth: 1,
                borderColor: "#D1D7DB",
                width: 375,
                height: 40,
                paddingHorizontal: 10,
                borderRadius: 3,
                flexDirection: "row",
                backgroundColor: "rgba(255,255,255,0.4)",
                paddingBottom: 0,
              }}
            />
            <ScrollView>
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {searchedCustomer?.map((item, index) => (
                  <TouchableWithoutFeedback
                    onPress={() => setCurrentCustomer(item)}
                    key={index}
                  >
                    <View style={{}}>
                      <View
                        style={{
                          padding: 10,
                          backgroundColor:
                            currentCustomer.name === item.name
                              ? "#4682b4"
                              : "white",
                          marginVertical: 5,
                          elevation: 4,
                          width: windowDimensions.width <= 393 ? 176 : 185,
                          height: 110,
                          position: "relative",
                          alignItems: "center",
                          justifyContent: "center",
                          marginHorizontal: 4,
                          borderRadius: 10,
                          borderLeftWidth: 2,
                          borderBottomWidth: 1,
                          borderColor:
                            currentCustomer.name === item.name
                              ? "#4682b4"
                              : "#4682b4",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            color:
                              currentCustomer.name === item.name
                                ? "white"
                                : "black",
                          }}
                        >
                          {item.name}
                        </Text>
                        {/* <Text style={{ color: "skyblue", fontWeight: "bold" }}>
                      Ver ubicación
                    </Text> */}
                        {/* <Text>{item.section + " " + item.location}</Text> */}
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

export default MapScreen;
