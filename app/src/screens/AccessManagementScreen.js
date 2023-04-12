import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";

import {
  listLockedUsersApi,
  unlockUserApi,
  listDevicesApi,
  changeDeviceStatusApi,
  unregisterDeviceApi,
} from "../api/auth/accessControl";
import Loading from "../components/Loading";
import LockDevicesForm from "../components/LockDevicesForm";
import Entypo from "react-native-vector-icons/Entypo";

export default function AccessManagement() {
  let [data, setData] = useState([]);
  let [devices, setDevices] = useState([]);
  let [isDevFormVisible, setIsDevFormVisible] = useState(false);
  let [device, setDevice] = useState({});
  let [isLoading, setIsLoading] = useState(false);
  let [isMacFormLoading, setIsMacFormLoading] = useState(false);

  useEffect(() => {
    (async () => {
      await unlock();
      await listDevices();
    })();
  }, []);

  const listDevices = async () => {
    let deviceList = await listDevicesApi();
    await setDevices(deviceList);
  };

  const unlock = async (username) => {
    setIsLoading(true);
    let response = await listLockedUsersApi();

    setData([...data, ...response]);

    setIsLoading(false);
  };

  const unlockUser = async (username) => {
    setIsLoading(true);
    let res = await unlockUserApi(username);
    let response = await listLockedUsersApi();
    console.log("hi");
    setData(response);
    setIsLoading(false);
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        minHeight: "100%",
        maxHeight: "100%",
        paddingBottom: 20,
      }}
    >
      {isDevFormVisible && (
        <LockDevicesForm
          visible={isDevFormVisible}
          setFormVisible={setIsDevFormVisible}
          device={device}
        />
      )}
      {isLoading && <Loading />}
      {isMacFormLoading && <Loading />}
      <View>
        <View style={{ ...styles.section, marginBottom: 30 }}>
          <Text style={styles.sectionTitle}>Usuarios bloqueados</Text>
        </View>

        {data.map((item, index) => (
          <View
            key={index}
            style={{
              marginVertical: 10,
              backgroundColor: "white",
              paddingVertical: 10,
              paddingHorizontal: 5,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text>
              Username: <Text style={{ fontWeight: "bold" }}>{item}</Text>
            </Text>
            <Text onPress={async () => await unlockUser(item)}>
              Desbloquear
            </Text>
          </View>
        ))}
      </View>
      <View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Devices</Text>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 35 }}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            height: "88%",
          }}
        >
          {devices.map((device, index) => (
            <View key={index}>
              <Entypo
                name="circle-with-cross"
                size={30}
                color={"darkred"}
                style={{
                  textAlign: "right",
                  width: "100%",
                  elevation: 5,
                }}
                onPress={async () => {
                  try {
                    let res = await unregisterDeviceApi(
                      device.app_access_control_id
                    );
                    await listDevices();
                    Alert.alert("Listo", res?.message);
                  } catch (error) {
                    Alert.alert("Error", error);
                  }
                }}
              />

              <View
                style={{
                  zIndex: 1,
                  marginTop: -15,
                  backgroundColor: "whitesmoke",
                  marginVertical: 10,
                  padding: 10,
                  borderColor: "rgba(0,0,0,0.3)",
                  borderWidth: 0.5,
                  borderRadius: 5,
                  elevation: 4,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <View status={{ flexDirection: "column" }}>
                  <Text style={{ width: 200 }}>
                    <Text style={{ fontWeight: "bold" }}>Dispostivo: </Text>
                    {device.description}
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Mac: </Text>
                    {device.mac_address}
                  </Text>

                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Estado Acceso: </Text>
                    {device.status_type == "ALLOWED" ? "Permitido" : "Denegado"}
                  </Text>
                </View>
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <Entypo
                      name="block"
                      style={styles.devicesIcons}
                      size={25}
                      color="red"
                      onPress={async () => {
                        let res = await changeDeviceStatusApi({
                          id: device.app_access_control_id,
                          status: "BLOCKED",
                        });
                        await listDevices();
                        Alert.alert("Listo", res?.message + "bloqueado.");
                      }}
                    />
                    <Entypo
                      name="check"
                      style={{ ...styles.devicesIcons, marginLeft: 5 }}
                      size={25}
                      color="green"
                      onPress={async () => {
                        let res = await changeDeviceStatusApi({
                          id: device.app_access_control_id,
                          status: "ALLOWED",
                        });
                        //setDevice(device);
                        setIsMacFormLoading(true);
                        await listDevices();
                        setIsMacFormLoading(false);

                        Alert.alert("Listo", res?.message + "permitido.");
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#4682b4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  sectionTitle: {
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 14,

    color: "white",
  },

  icon: {
    fontSize: 30,
    backgroundColor: "#4682b4",
    textAlign: "center",
    color: "white",
    width: 60,
    borderLeftColor: "white",
    borderLeftWidth: 4,
    borderRightColor: "white",
    borderRightWidth: 4,
  },

  devicesIcons: {
    backgroundColor: "#ecf9ff",
    padding: 6,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 0.5,
    borderRadius: 3,
    width: 50,
    elevation: 4,
    textAlign: "center",
  },
});
