import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Card } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { getClientByloan, getRegisterStatusApi } from "../api/payments";
import { useFormik } from "formik";
import * as Yup from "yup";
import { isEmpty } from "lodash";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import CashierForm from "../components/CashierForm";
import { WINDOW_DIMENSION } from "../utils/constants";

import { formatFullName, extractIconText } from "../utils/stringFuctions";
import { goToPage } from "../utils/navigation";
import useAuth from "../hooks/useAuth";
import { createRegisterApi } from "../api/payments";

export default function PaymentScreen(props) {
  const isFocused = useIsFocused();

  var {
    route: { params },
    navigation,
  } = props;
  const { auth } = useAuth();

  const data = {
    amount: 0,
    description: (() => {
      //Date
      const date = new Date().getDate();
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      //Time
      const hour = new Date().getHours();
      const minute = new Date().getMinutes();
      var dayTime = hour >= 12 ? "PM" : "AM";

      const fullDate = `${date}/${month}/${year}  ${hour}:${minute} ${dayTime}`;
      return fullDate.toString();
    })(),
    userId: auth?.user_id,
    outletId: auth?.outlet_id,
    createdBy: auth?.login,
    lastModifiedBy: auth?.login,
  };

  const [customer, setCustomer] = useState({});
  const [registerInfo, setRegisterInfo] = useState({});
  const [loans, setLoans] = useState([]);
  const [quotas, setQuotas] = useState({});
  const [text, setText] = useState("");
  const [loan, setLoan] = useState("");
  const [openedCashier, setOpenedCashier] = useState(true);
  const [openCashier, setOpenCashier] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [isOpenedComment, setIsOpenedComment] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: { searchKey: "" },
    validateOnChange: false,
    validationSchema: Yup.object(validationSchema()),
    enableReinitialize: true,
    onSubmit: async (value) => {
      Keyboard.dismiss();
      setIsLoading(true);
      setOpenCashier(!openCashier);

      if (openedCashier == true) {
        if (value.searchKey != "") {
          await retriveCustomer(value.searchKey);
        } else {
          if (params) {
            await retriveCustomer(params.loanNumber.toString());
          }
        }
      } else {
        console.log("No puedes, has sido desconectado");
      }

      setIsLoading(false);
      setLoan(value.searchKey);

      formik.setFieldValue("searchKey", "");
    },
  });

  useEffect(() => {
    (async () => {
      const response = await getRegisterStatusApi(auth?.user_id);
      if (response?.status == false) {
        //const register = await createRegisterApi(data)
        const register = true;
        setOpenedCashier(true);
        setRegisterInfo(register);
      } else {
        setOpenedCashier(true);
      }

      //console.log(response);
    })();
  }, [auth]);

  useEffect(() => {
    (() => {
      if (params && params.origin == "customerInfo") {
        setLoan(params.loanNumber.toString());
        console.log("Params", params);
        formik.setFieldValue("searchKey", params.loanNumber.toString());
        formik.handleSubmit();
      }
    })();
  }, [params?.origin]);

  useEffect(() => {
    (() => {
      setIsCustomer(false);
    })();
  }, [auth]);

  const retriveCustomer = async (key) => {
    let currentCustomer = [];
    let currentLoans = [];
    let currentQuotas = [];
    try {
      const response = await getClientByloan({
        searchKey: key,
        employeeId: auth.employee_id,
      });

      console.log("what", response);

      if (!isEmpty(response)) {
        setIsCustomer(true);

        for (var item of response?.customer) {
          currentCustomer.push({
            customer_id: item.customer_id,
            first_name: item.first_name,
            last_name: item.last_name,
            doc: item.identification,
          });
        }

        for (var l of response?.loans) {
          currentLoans.push({
            loanId: l.loan_id,
            number: l.loan_number_id,
            balance: l.balance,
            quotasNum: l.quota_amount,
            quotaAmount: parseInt(l.balance) / parseInt(l.quota_amount),
          });
        }
      } else {
        setIsCustomer(false);
        setLoan(key);
        setError(
          `El cliente con No. préstamo/cédula ${loan} no existe, o no se encuentra entre tus zonas asignadas`
        );
      }

      //console.log(currentQuotas);
      setLoans(currentLoans);
      setCustomer(...currentCustomer);
      setQuotas(response?.quotas);

      console.log("hey", currentCustomer[0]);

      //console.log(customer);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      {
        auth ? (
          openedCashier != true ? (
            <Text></Text>
          ) : (
            <View style={styles.container}>
              <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
                <TextInput
                  style={{ ...styles.searchInput, marginRight: 10 }}
                  placeholder="#préstamo"
                  value={formik.values.searchKey}
                  onChangeText={(text) =>
                    formik.setFieldValue("searchKey", text)
                  }
                />
                <Button
                  style={{ borderRadius: 50 }}
                  title="Buscar"
                  onPress={formik.handleSubmit}
                />
              </View>
              <Text style={styles.error}>{formik.errors.searchKey}</Text>
              <View>
                {isCustomer == true ? (
                  <PaymentCustomerCard
                    customer={customer}
                    register={registerInfo}
                    setIsCustomer={setIsCustomer}
                    isCustomer={isEmpty(customer)}
                    navigation={navigation}
                    loans={loans}
                    loan={loan}
                    quotas={quotas}
                    isOpenedComment={isOpenedComment}
                    setIsOpenedComment={setIsOpenedComment}
                  />
                ) : (
                  <Text style={{ ...styles.error }}>{error}</Text>
                )}
                {isLoading && (
                  <ActivityIndicator size="large" style={styles.spinner} />
                )}
              </View>
            </View>
          )
        ) : (
          <View style={{ alignItems: "center", paddingTop: 40 }}>
            <Text style={{ fontSize: 19, fontWeight: "bold" }}>
              OH oh... No te ecuentras conectado...
            </Text>
            <Text
              style={{ fontSize: 16, color: "blue", marginTop: 15 }}
              onPress={() => navigation.navigate("Settings")}
            >
              Conectarse
            </Text>
          </View>
        )
        //navigation.navigate('Settings')
      }

      {isOpenedComment && (
        <CashierForm
          setIsOpenedComment={setIsOpenedComment}
          setIsCustomer={setIsCustomer}
        />
      )}
    </View>
  );
}

function PaymentCustomerCard(props) {
  const {
    customer,
    loans,
    isCustomer,
    setIsCustomer,
    navigation,
    loan,
    quotas,
    register,
    setIsOpenedComment,
    isOpenedComment,
  } = props;

  return !isCustomer ? (
    <TouchableWithoutFeedback>
      <Card>
        <View style={styles.infoContent}>
          <View style={{ ...styles.row, ...styles.icon }}>
            <Text style={styles.iconText}>
              {extractIconText(formatFullName(customer?.first_name, customer))}
            </Text>
          </View>
          <View style={styles.customerInfoContent}>
            <Text style={styles.customerInfoName}>
              {formatFullName(customer?.first_name, customer)}
            </Text>
          </View>

          <Menu>
            <MenuTrigger>
              <Icon
                name="ellipsis-v"
                style={{
                  top: 0,
                  fontSize: 18,
                  width: 33,
                  paddingHorizontal: 13,
                  paddingVertical: 6,
                  borderRadius: 50,
                }}
              />
            </MenuTrigger>
            <MenuOptions
              customStyles={{ optionText: { fontSize: 15 } }}
              optionsContainerStyle={{ marginLeft: 6 }}
            >
              <MenuOption
                style={styles.menuOption}
                onSelect={() =>
                  goToPage("PaymentsForm", navigation, {
                    ...customer,
                    loans,
                    loan,
                    quotas,
                    register,
                  })
                }
                text="Cobrar"
              />
              <MenuOption
                style={styles.menuOption}
                text="Ver Recibo"
                onSelect={() =>
                  navigation.navigate("Receipt", {
                    customer,
                    loans: loans,
                    loan,
                  })
                }
              />
              <MenuOption
                style={styles.menuOption}
                onSelect={() => {
                  setIsOpenedComment(!isOpenedComment);
                  setIsCustomer(false);
                }}
                text="Crear Comentario"
              />
            </MenuOptions>
          </Menu>
        </View>
      </Card>
    </TouchableWithoutFeedback>
  ) : (
    <Text></Text>
  );
}

function validationSchema() {
  return {
    //searchKey: Yup.number().required("Este campo no puede estar vacío")
  };
}

const styles = StyleSheet.create({
  modalContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
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

  container: {
    paddingTop: 15,
    //paddingHorizontal: 25
  },

  searchInput: {
    width: "79%",
    height: 40,
    backgroundColor: "#D3DBE1",
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  infoContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    backgroundColor: "skyblue",
    width: 70,
    height: 70,
    borderRadius: 50,
  },

  iconText: {
    marginTop: "auto",
    marginBottom: "auto",
    fontSize: 30,
    color: "white",
    textAlign: "center",
  },

  customerInfoContent: {
    alignContent: "center",
    justifyContent: "center",
    paddingLeft: 15,
    marginRight: 15,
    width: WINDOW_DIMENSION.width <= 360 ? 180 : 230,
  },

  customerInfoName: {
    fontWeight: "bold",
    fontSize: 17,
  },

  spinner: {
    marginTop: 40,
  },
  error: {
    color: "#b25353",
    fontSize: 15,
    marginTop: 15,
    textAlign: "center",
  },
  menuOption: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    fontSize: 25,
  },
});
