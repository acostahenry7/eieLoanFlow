import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { WINDOW_DIMENSION, SCREEN_DIMENSION } from "../utils/constants";
import {
  getSavedConnectionUrlApi,
  saveConnectionUrlApi,
} from "../api/server/connection";

import { loginApi } from "../api/auth/login";
import useAuth from "../hooks/useAuth";
import { getDeviceName, getMacAddress } from "react-native-device-info";
import { PermissionsAndroid } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

export default function LoginForm(props) {
  const { login, logout } = useAuth();

  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(true);
  const [configMenuVisible, setConfigMenuVisible] = useState(false);
  const [configForm, setConfigForm] = useState(false);
  const netInfo = useNetInfo();

  useEffect(() => {
    (async () => {
      let res = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    })();
  }, []);

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: Yup.object(validationSchema()),
    validateOnChange: false,
    onSubmit: async (values) => {
      setError("");
      setIsLoading(true);
      const { username, password } = values;

      let devMac = await getMacAddress();
      let devName = await getDeviceName();

      let deviceInfo = {
        description: devName,
        mac: devMac,
        status_type: "BLOCKED",
      };

      const response = await loginApi(
        username,
        password,
        deviceInfo,
        netInfo.isConnected
      );
      setIsLoading(false);

      formik.setFieldValue("username", "");
      formik.setFieldValue("password", "");

      if (netInfo.isConnected == false) {
        if (response.error) {
          setError(response.error);
        } else {
          login(response);
        }
      } else {
        if (response.error) {
          if (response.errorCode == 1) {
            Alert.alert("Error de Conexión", response.error);
          } else {
            if (response.error == "MMVERSION") {
              setError(
                "Esta utilizando una versión desactualizada de al app. Favor acturalizar a la version más reciente."
              );
            } else {
              setError(response.error);
            }
          }
        } else {
          if (response.successfullLogin == true) {
            console.log("Mi user logged", response);
            login(response.userData);
            navigation.navigate("Home");
          } else {
            if (response.error == "MMVERSION") {
              setError(
                "Esta utilizando una versión desactualizada de al app. Favor acturalizar a la version más reciente."
              );
            } else {
              setError("El usuario o la contraseña son incorrectos!");
            }
          }
        }
      }
    },
  });

  const connectionForm = useFormik({
    initialValues: { url: "" },
    validateOnChange: false,
    onSubmit: async (values) => {
      const url = values.url;
      await saveConnectionUrlApi(url);
      setConfigForm(false);
    },
  });

  return (
    <View>
      <Modal visible={visible} style={styles.formContainer}>
        <View style={styles.modalView}>
          <View
            style={{
              position: "absolute",
              width: "100%",
              alignItems: "center",
              paddingTop: 120,
            }}
          >
            <Icon
              name="attach-money"
              style={{
                fontSize: 50,
                color: "white",
                marginBottom: 8,
              }}
            />
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>
              EIE Loanflow
            </Text>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text
                style={{ fontWeight: "bold", marginBottom: 20, fontSize: 18 }}
              >
                Login
              </Text>
            </View>
            <View style={styles.formGroup}>
              <TextInput
                value={formik.values.username}
                onChangeText={(text) => formik.setFieldValue("username", text)}
                placeholder="Usuario"
                autoFocus={true}
                autoCapitalize="none"
                multiline={true}
                numberOfLines={4}
                style={{ ...styles.textInput }}
              />
              <Text style={styles.error}>{formik.errors.username}</Text>
            </View>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color={"blue"}
                style={{ position: "absolute", top: 138 }}
              />
            )}
            <View style={styles.formGroup}>
              <TextInput
                placeholder="Contraseña"
                value={formik.values.password}
                onChangeText={(text) => formik.setFieldValue("password", text)}
                autoCapitalize="none"
                secureTextEntry={true}
                style={{ ...styles.textInput }}
              />
              <Text style={styles.error}>{formik.errors.password}</Text>
            </View>
            <Text style={styles.error}>{error}</Text>
            <View style={styles.formGroup}>
              <Button
                style={{ width: "100%" }}
                title="Ingresar"
                onPress={formik.handleSubmit}
              />
            </View>
          </View>
          <Icon
            name="settings"
            color={"black"}
            style={styles.configIcon}
            onPress={() => setConfigMenuVisible(true)}
          />
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={configMenuVisible}
      >
        <View style={{ height: "100%", backgroundColor: "#00000020" }}>
          <View
            style={{
              ...styles.modalBody,
              marginBottom: 0,
              marginHorizontal: 0,
              height: 300,
            }}
          >
            <Icon
              style={{ marginLeft: "auto" }}
              name="close"
              size={25}
              onPress={() => setConfigMenuVisible(false)}
            />
            <View style={{ paddingHorizontal: 10, width: "100%" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Configuración
              </Text>
              <View
                style={{
                  ...styles.formGroup,
                  borderColor: "#00000020",
                  borderTopWidth: 0.2,
                  borderBottomWidth: 0.2,
                  marginTop: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Icon name="construction" size={20} />
                  <Text
                    onPress={() => {
                      setConfigForm(true);
                      setConfigMenuVisible(false);
                    }}
                    style={{ color: "grey", marginLeft: 10 }}
                  >
                    Configurar la url conexión Conexión
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={configForm}
        style={styles.formContainer}
        transparent={true}
      >
        <View style={{ height: "100%", backgroundColor: "#00000080" }}>
          <View style={{ ...styles.modalBody }}>
            <Icon
              style={{ marginLeft: "auto" }}
              name="close"
              size={25}
              onPress={() => {
                setConfigMenuVisible(true);
                setConfigForm(false);
              }}
            />
            <View style={styles.formGroup}>
              <Text
                style={{ fontWeight: "bold", marginBottom: 20, fontSize: 15 }}
              >
                Configurar de la Conexión
              </Text>
            </View>
            <View style={styles.formGroup}>
              <TextInput
                placeholder="http://server:port/url/"
                value={connectionForm.values.url}
                onChangeText={(text) =>
                  connectionForm.setFieldValue("url", text)
                }
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formGroup}>
              <Button title="Guardar" onPress={connectionForm.handleSubmit} />
            </View>
            <Text style={styles.error}>{error}</Text>
          </View>
          <Icon
            name="settings"
            color={"black"}
            style={styles.configIcon}
            onPress={() => setConfigMenuVisible(true)}
          />
        </View>
      </Modal>
    </View>
  );
}

function validationSchema() {
  return {
    username: Yup.string().required("Usuario requerido"),
    password: Yup.string().required("Contraseña requerida"),
  };
}

const styles = StyleSheet.create({
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 0,
  },
  modalView: {
    backgroundColor: "#4682b4",

    height: "100%",

    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5
  },
  modalBody: {
    borderRadius: 5,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "white",
    marginHorizontal: 15,
    marginBottom: "auto",
    marginTop: "auto",
    alignItems: "center",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  formGroup: {
    paddingVertical: 10,
  },

  textInput: {
    marginTop: 5,
    height: 20,
    borderWidth: 1,
    borderColor: "#D1D7DB",
    width: 330,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 3,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 0,
  },

  error: {
    color: "red",
    fontSize: 12,
  },

  configIcon: {
    position: "absolute",
    right: 20,
    top:
      SCREEN_DIMENSION.height -
      (SCREEN_DIMENSION.height - WINDOW_DIMENSION.height) -
      50,
    fontSize: 30,
    color: "white",
  },
});
