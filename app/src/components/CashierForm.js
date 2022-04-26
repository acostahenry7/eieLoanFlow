import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Keyboard,
  Button,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../hooks/useAuth";
import { createRegisterApi } from "../api/payments";

export default function CashierForm(props) {
  const { navigation, setIsCustomer, setIsOpenedComment } = props;
  const [visible, setVisible] = useState(true);
  const { auth } = useAuth();

  const formik = useFormik({
    initialValues: { amount: "", description: "" },
    validationSchema: Yup.object(validationSchema()),
    validateOnChange: false,
    onSubmit: async (values) => {
      //setOpenCashier(false)
      Keyboard.dismiss();
      console.log(auth);
      const data = {
        amount: parseInt(values.amount),
        description: values.description,
        userId: auth.user_id,
        outletId: auth.outlet_id,
        createdBy: auth.login,
        lastModifiedBy: auth.login,
      };

      //const response = await createRegisterApi(data);

      //if (response) setOpenCashier(!openCashier);

      setVisible(false);

      formik.setFieldValue("amount", "");
      formik.setFieldValue("description", "");
    },
  });

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        <ScrollView
          contentContainerStyle={styles.modalView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ ...styles.formGroup, flexDirection: "row" }}>
            <Text
              style={{
                fontWeight: "bold",
                marginBottom: 20,
                fontSize: 16,
                width: 300,
                textAlign: "center",
              }}
            >
              Crear Comentario
            </Text>
            <Icon
              style={{ paddingTop: 2, textAlign: "right", fontSize: 19 }}
              name="times"
              onPress={() => {
                setIsCustomer(true);
                setIsOpenedComment(false);
              }}
            />
          </View>
          <View style={styles.formGroup}>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={{ ...styles.textInput, height: 100 }}
              value={formik.values.amount}
              onChangeText={(text) => formik.setFieldValue("amount", text)}
            />
          </View>
          <Text style={styles.error}>{formik.errors.amount}</Text>
          <View style={styles.formGroup}>
            <Button
              style={{ width: "100%" }}
              title="Guardar"
              onPress={formik.handleSubmit}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function validationSchema() {
  return {
    amount: Yup.string().required("No puede crear un comentario vacío"),
    description: Yup.string(),
  };
}

const styles = StyleSheet.create({
  modalContainer: {
    height: "100%",
    marginTop: "auto",
    paddingTop: 0,
  },

  modalView: {
    marginTop: "auto",
    marginBottom: "auto",
    marginHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
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
    paddingTop: 10,
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

  container: {
    paddingTop: 15,
    //paddingHorizontal: 25
  },

  searchInput: {
    width: "80%",
    height: 40,
    backgroundColor: "#D3DBE1",
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  infoContent: {
    flexDirection: "row",
  },

  icon: {
    backgroundColor: "skyblue",
    padding: 10,
    width: 70,
    height: 70,
    borderRadius: 50,
  },

  iconText: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
  },

  customerInfoContent: {
    paddingVertical: 20,
    paddingLeft: 15,
  },

  customerInfoName: {
    fontWeight: "bold",
    fontSize: 17,
  },

  spinner: {
    marginTop: 40,
  },
  error: {
    color: "red",
    fontSize: 12,
    textAlign: "left",
  },
});
