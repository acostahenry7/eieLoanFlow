import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
  Alert,
} from "react-native";
import { Card } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { getClientByloan, getRegisterStatusApi } from "../api/payments";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loading from "../components/Loading";
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
import { significantFigure } from "../utils/math";
import { useNetInfo } from "@react-native-community/netinfo";

export default function PaymentScreen(props) {
  const isFocused = useIsFocused();
  const netInfo = useNetInfo();

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
  const [isRegisterOpened, setIsRegisterOpened] = useState(true);
  const [cashierVisible, setCashierVisible] = useState(false);
  const [openCashier, setOpenCashier] = useState(false);
  const [currentCashier, setCurrentCashier] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [isOpenedComment, setIsOpenedComment] = useState(false);
  const [error, setError] = useState("");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [charges, setCharges] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getRegisterStatusApi(
          auth?.user_id,
          netInfo?.isConnected
        );
        if (response?.status == false) {
          setIsRegisterOpened(false);
        } else {
          setRegisterInfo(response.register);
          setIsRegisterOpened(true);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const formik = useFormik({
    initialValues: { searchKey: "" },
    validateOnChange: false,
    validationSchema: Yup.object(validationSchema()),
    enableReinitialize: true,
    onSubmit: async (value) => {
      Keyboard.dismiss();
      setIsLoading(true);
      setOpenCashier(!openCashier);

      try {
        const response = await getRegisterStatusApi(
          auth?.user_id,
          netInfo?.isConnected
        );
        if (response?.status == false) {
          setIsRegisterOpened(false);
        }

        if (isRegisterOpened == true) {
          if (value.searchKey != "") {
            await retriveCustomer(value.searchKey);
          } else {
            if (params) {
              await retriveCustomer(params.loanNumber?.toString());
            }
          }
          setIsLoading(false);
          setLoan(value.searchKey);
          console.log(response);
        } else {
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }

      formik.setFieldValue("searchKey", "");
    },
  });

  const cashierForm = useFormik({
    initialValues: { amount: "", description: "" },
    validateOnChange: false,
    onSubmit: async (values) => {
      let data = {
        amount: values.amount || 0,
        description: values.description,
        userId: auth.user_id,
        outletId: auth.outlet_id,
        createdBy: auth.login,
        lastModifiedBy: auth.login,
      };

      const register = await createRegisterApi(data);
      if (register.err) {
        Alert.alert("Error", register.err);
      } else {
        setRegisterInfo(register);
        setIsRegisterOpened(true);
      }
    },
  });

  useEffect(() => {
    (async () => {})();
  }, [currentCashier]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getRegisterStatusApi(
          auth?.user_id,
          netInfo?.isConnected
        );
        if (response?.status == false) {
          //const register = await createRegisterApi(data)
          const register = true;
          setOpenedCashier(true);
          setRegisterInfo(register);
        } else {
          setOpenedCashier(true);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [auth]);

  useEffect(() => {
    (() => {
      if (params && params.origin == "customerInfo") {
        setLoan(params?.loanNumber?.toString());
        formik.setFieldValue("searchKey", params?.loanNumber?.toString());
        formik.handleSubmit();
      }
    })();
  }, [params, isFocused]);

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
        netStatus: netInfo?.isConnected,
      });

      if (!isEmpty(response)) {
        setIsCustomer(true);
        console.log("mannnnnn, the charges again", response.charges);
        if (response.charges?.length > 0) {
          // console.log("mannnnnn, the charges again", response);
          setCharges(response.charges);
        } else {
          setCharges([]);
        }

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
        if (loan == undefined) {
          setError("");
        } else {
          setError(
            `El cliente con No. préstamo/cédula ${loan} no existe, o no se encuentra entre tus zonas asignadas`
          );
        }
      }

      setLoans(currentLoans);
      setCustomer(...currentCustomer);
      setQuotas(response?.quotas);
      setGlobalDiscount(response?.globalDiscount);
    } catch (error) {
      console.log(error);
      //Alert.alert(error.message)
    }
  };

  return (
    <View>
      {isLoading ? (
        <Loading />
      ) : (
        <View>
          {
            isRegisterOpened ? (
              auth ? (
                openedCashier != true ? (
                  <Text></Text>
                ) : (
                  <View style={styles.container}>
                    <View
                      style={{ flexDirection: "row", paddingHorizontal: 15 }}
                    >
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
                          charges={charges}
                          quotas={quotas}
                          isOpenedComment={isOpenedComment}
                          setIsOpenedComment={setIsOpenedComment}
                          globalDiscount={globalDiscount}
                        />
                      ) : (
                        <Text style={{ ...styles.error }}>{error}</Text>
                      )}
                      {isLoading && <Loading />}
                      {/* <Text>Limpiar Búsqueda</Text> */}
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
            ) : (
              <View>
                {cashierVisible == true ? (
                  <Modal visible={cashierVisible} transparent={true}>
                    <View
                      style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: "rgba(0,0,0,0.3)",
                      }}
                    >
                      <View
                        style={styles.modalView}
                        keyboardShouldPersistTaps="handled"
                      >
                        <View>
                          <Text style={{}}>Abrir Caja</Text>
                          <View
                            style={{
                              ...styles.formGroup,
                            }}
                          >
                            <Text>Monto de apertura</Text>
                            <TextInput
                              style={styles.textInput}
                              keyboardType="number-pad"
                              value={formik.values.amount}
                              onChangeText={(text) =>
                                cashierForm.setFieldValue("amount", text)
                              }
                            />
                          </View>
                          <View>
                            <Text>Descripción</Text>
                            <TextInput
                              style={{ ...styles.textInput, height: 80 }}
                              multiline={true}
                              value={formik.values.description}
                              onChangeText={(text) =>
                                cashierForm.setFieldValue("description", text)
                              }
                            />
                          </View>
                        </View>
                        <View>
                          <View style={styles.footContainer}>
                            <TouchableWithoutFeedback>
                              <Text
                                onPress={() => setCashierVisible(false)}
                                style={{
                                  ...styles.btn,
                                  backgroundColor: "white",
                                  color: "blue",
                                }}
                              >
                                Cancelar
                              </Text>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                              onPress={cashierForm.handleSubmit}
                            >
                              <Text style={styles.btn}>Guardar</Text>
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Modal>
                ) : (
                  <View
                    style={{
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableWithoutFeedback
                      title="Abrir Caja"
                      onPress={() => setCashierVisible(true)}
                    >
                      <Text
                        style={{
                          ...styles.btn,
                          width: "60%",
                          fontWeight: "bold",
                          textAlign: "center",
                          paddingVertical: 15,
                        }}
                      >
                        Abrir Caja
                      </Text>
                    </TouchableWithoutFeedback>
                  </View>
                )}
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
      )}
    </View>
  );
}

function PaymentCustomerCard(props) {
  const {
    customer,
    loans,
    charges,
    isCustomer,
    setIsCustomer,
    navigation,
    loan,
    quotas,
    register,
    setIsOpenedComment,
    isOpenedComment,
    globalDiscount,
  } = props;

  let pendingAmount = quotas[loan]
    ?.reduce((acc, item) => acc + parseFloat(item.quota_amount), 0)
    .toFixed(2);

  return !isCustomer ? (
    <View>
      <TouchableWithoutFeedback>
        <Card>
          <View style={styles.infoContent}>
            <View style={{ ...styles.row, ...styles.icon }}>
              <Text style={styles.iconText}>
                {extractIconText(
                  formatFullName(customer?.first_name, customer)
                )}
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
                      charges,
                      quotas,
                      register,
                      globalDiscount,
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
      <View
        style={{
          marginHorizontal: 15,
          marginVertical: 15,
          padding: 15,
          borderRadius: 10,
          borderColor: "rgba(0,0,0,0.3)",
          borderWidth: 0.5,
          backgroundColor: "rgba(255,255,255,0.7)",
        }}
      >
        <View>
          {quotas[loan]?.length > 0 ? (
            <View>
              <Text style={styles.cITitle}>
                Situación Crediticia del Cliente
              </Text>
              <Text style={{ color: "red" }}>Préstamo: {loan}</Text>
              <View style={{ marginTop: 15 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.cItext}>
                    Cantidad de cuotas pendientes:
                  </Text>
                  <Text style={styles.cIValue}> {quotas[loan]?.length}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.cItext}>Monto por cuota:</Text>
                  <Text style={styles.cIValue}>
                    {" "}
                    RD${" "}
                    {significantFigure(
                      quotas[loan][1]?.amount_of_fee ||
                        quotas[loan][0].amount_of_fee
                    )}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.cItext}>Monto total Pendiente:</Text>
                  <Text style={styles.cIValue}>
                    {" "}
                    RD$ {significantFigure(pendingAmount)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.cItext}>Monto total en atraso:</Text>
                  <Text style={styles.cIValue}>
                    {" "}
                    RD${" "}
                    {significantFigure(
                      quotas[loan]
                        .filter((item) => item.status_type == "DEFEATED")
                        .reduce(
                          (acc, item) => acc + parseFloat(item.quota_amount),
                          0
                        )
                        .toFixed(2)
                    ) || 0}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.cItext}>
                    Descuento global al saldar préstamo:{" "}
                  </Text>
                  <Text
                    style={{ ...styles.cIValue, textAlignVertical: "bottom" }}
                  >
                    {significantFigure(globalDiscount) == 0
                      ? "- - - - - - - - - -"
                      : `RD$ ${significantFigure(globalDiscount)}`}
                  </Text>
                </View>
              </View>
            </View>
          ) : undefined}
        </View>
      </View>
    </View>
  ) : (
    <Text></Text>
  );
}

function validationSchema() {
  return {
    //searchKey: Yup.number().required("Este campo no puede estar vacío")
  };
}

function hasDecimal(num) {
  // console.log("has decimal", !!(parseFloat(num) % 1));
  return !!(parseFloat(num) % 1);
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

  footContainer: {
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },

  btn: {
    backgroundColor: "#3289cc",
    marginHorizontal: 15,
    color: "white",
    padding: 5,
    borderRadius: 5,
  },

  cITitle: {
    color: "rgba(0,0,0,0.8)",
    fontWeight: "bold",
  },

  cItext: {
    color: "rgba(0,0,0,0.4)",
    width: 220,
    // textAlign: "right",
  },

  cIValue: {
    fontWeight: "600",
  },
});
