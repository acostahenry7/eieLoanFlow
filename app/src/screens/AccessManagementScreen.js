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
} from "../api/auth/accessControl";
import Loading from "../components/Loading";
import LockDevicesForm from "../components/LockDevicesForm";
import Entypo from "react-native-vector-icons/Entypo";

export default function AccessManagement() {
  let [data, setData] = useState([]);
  let [devices, setDevices] = useState([]);
  let [isDevFormVisible, setIsDevFormVisible] = useState(false);
  let [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      await unlock();
      await listDevices();
    })();
  }, []);

  const listDevices = async () => {
    let devices = await listDevicesApi();
    await setDevices(devices);
  };

  const unlock = async (username) => {
    setIsLoading(true);
    let response = await listLockedUsersApi();

    setData([...data, ...response]);

    setIsLoading(false);
  };

  const unlockUser = async (username) => {
    setIsLoading(true);
    //let res = await unlockUserApi(username);
    let response = await listLockedUsersApi();

    setData(response);
    setIsLoading(false);
  };

  return (
    <View style={{ backgroundColor: "white", minHeight: "100%" }}>
      {isDevFormVisible && (
        <LockDevicesForm
          visible={isDevFormVisible}
          setFormVisible={setIsDevFormVisible}
        />
      )}
      {isLoading && <Loading />}
      <View>
        <View style={{ ...styles.section, marginBottom: 30 }}>
          <Text style={styles.sectionTitle}>Usuarios bloqueados</Text>
          <TouchableWithoutFeedback
            onPress={() => Alert.alert("Error", "Option not available!")}
          >
            <Text style={styles.icon}>+</Text>
          </TouchableWithoutFeedback>
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

          <TouchableWithoutFeedback onPress={() => setIsDevFormVisible(true)}>
            <Text style={styles.icon}>+</Text>
          </TouchableWithoutFeedback>
        </View>
        <ScrollView style={{ paddingHorizontal: 15, paddingVertical: 15 }}>
          {devices.map((device) => (
            <View
              style={{
                backgroundColor: "whitesmoke",
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
                <Text>
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

              <Entypo
                name="block"
                style={styles.devicesIcons}
                size={28}
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
                style={styles.devicesIcons}
                size={28}
                color="green"
                onPress={async () => {
                  let res = await changeDeviceStatusApi({
                    id: device.app_access_control_id,
                    status: "ALLOWED",
                  });

                  await listDevices();
                  Alert.alert("Listo", res?.message + "permitido.");
                }}
              />
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
