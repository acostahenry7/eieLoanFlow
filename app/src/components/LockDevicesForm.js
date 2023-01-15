import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Formik, useFormik } from "formik";

export default function LockDevicesForm(props) {
  const [visible, setVisible] = useState(props.visible);

  const form = useFormik({
    initialValues: { mac: "" },
    validateOnChange: false,
    onSubmit: (values) => {
      console.log(values.mac);
      Alert.alert("Warning!", "Device added");
      setVisible(false);
      props.setFormVisible(false);
    },
  });

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: 18 }}> Añadir dispositvo</Text>
          </View>

          <View style={styles.formGroup}>
            <Text>Dirección MAC</Text>
            <TextInput
              value={form.values.mac}
              onChangeText={(text) => form.setFieldValue("mac", text)}
              style={styles.textInput}
              placeholder="ej. aa:bf:89:86:bb:19"
            />
          </View>

          <View
            style={{
              ...styles.formGroup,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableWithoutFeedback
              style={{ width: 30 }}
              onPress={() => {
                setVisible(false);
                props.setFormVisible(false);
              }}
            >
              <Text
                style={{
                  //backgroundColor: "red",
                  color: "red",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                cancelar
              </Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              style={{ width: 30 }}
              onPress={form.handleSubmit}
            >
              <Text
                style={{
                  backgroundColor: "skyblue",
                  color: "white",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                Guardar
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    height: "100%",
    marginTop: "auto",
    paddingTop: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalView: {
    marginTop: "auto",
    marginBottom: "auto",
    marginHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  formGroup: {
    paddingTop: 30,
    width: "100%",
  },

  textInput: {
    marginTop: 5,
    height: 20,
    borderWidth: 1,
    borderColor: "#D1D7DB",
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 3,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 0,
  },
});
