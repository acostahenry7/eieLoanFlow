import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Modal,
  Button,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { printByBluetooth } from "../api/bluetooth/Print";
import { Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAuth from "../hooks/useAuth";
import ReceiptHtml from "./ReceiptHtml";
import Loading from "../components/Loading";
import { significantFigure } from "../utils/math";

export default function Receipt(props) {
  const {
    receiptDetails,
    receiptVisibility,
    setReceiptVisibility,
    quotas,
    navigation,
    origin,
    customHtml,
    isLoading,
  } = props;

  const { auth } = useAuth();

  const [isPrinting, setIsPrinting] = useState(false);

  if (origin == "payment") {
    receiptDetails.amortization = [...quotas];
  }
  //console.log("From receipt", receiptDetails);

  const time = (time) => {
    var res = time?.split(".");

    res ? (time = res[0]) : (time = 0);

    return time;
  };

  const totalPaid = (arr, subtotal) => {
    var sum = 0;
    let param;

    arr.map((item) => {
      //console.log(item);
      subtotal == true ? (param = item.amount) : (param = item.totalPaid);

      console.log("PARAM", param);
      sum += parseFloat(param);
    });

    //console.log(sum);
    return sum;
  };

  const paidTotalAmount = (arr) => {
    var result = 0;
  };

  return (
    <View>
      {origin == "payment" ? (
        <Modal
          transparent={true}
          animationType="fade"
          visible={receiptVisibility}
          style={{ height: 50, backgroundColor: "rgba(255, 255, 255, 0)" }}
        >
          <ScrollView
            style={{
              height: "100%",
              maxWidth: "100%",
              backgroundColor: "rgba(0,0,0, 0.3)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                marginVertical: 15,
                borderRadius: 5,
                marginHorizontal: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                paddingVertical: 20,
                paddingHorizontal: 10,
              }}
            >
              <View>
                <Icon
                  name="close"
                  size={25}
                  onPress={() => setReceiptVisibility(false)}
                  style={{ textAlign: "right" }}
                />
              </View>
              <Image
                style={{ width: "100%", height: 100 }}
                source={{
                  uri: "http://op.grupoavant.com.do:26015/assets/profile/banner1.png",
                }}
              />
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold" }}>
                  {receiptDetails.outlet}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  RNC: {receiptDetails.rnc}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    backgroundColor: "black",
                    width: "100%",
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  RECIBO
                </Text>
              </View>
              <View>
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  <View style={{ width: "50%" }}>
                    <View>
                      <Text style={{ fontWeight: "bold" }}>Número Recibo:</Text>
                      <Text>{receiptDetails?.receiptNumber}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontWeight: "bold" }}>Préstamo:</Text>
                      <Text>{receiptDetails?.loanNumber}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontWeight: "bold" }}>Tipo de Pago:</Text>
                      <Text>{receiptDetails?.paymentMethod}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontWeight: "bold" }}>Cajero:</Text>
                      <Text>{auth.login}</Text>
                    </View>
                  </View>
                  <View style={{ width: "50%" }}>
                    <View>
                      <Text style={{ fontWeight: "bold" }}>Fecha de Pago:</Text>
                      <Text>
                        {receiptDetails?.date} {time(receiptDetails?.time)}
                      </Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontWeight: "bold" }}>Cliente:</Text>
                      <Text>
                        {receiptDetails?.firstName +
                          " " +
                          receiptDetails?.lastName}
                      </Text>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: "column" }}>
                      <Text style={{ fontWeight: "bold" }}>Zona:</Text>
                      <Text style={{}}>{receiptDetails?.section || ""}</Text>
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Transacciones
                </Text>
                <ScrollView
                  style={{ marginTop: 20, maxHeight: 250 }}
                  nestedScrollEnabled={true}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ width: "17%", fontWeight: "bold" }}>
                      No. Cuota:
                    </Text>
                    <Text style={{ width: "30%", fontWeight: "bold" }}>
                      Fecha cuota:
                    </Text>
                    <Text style={{ width: "20%", fontWeight: "bold" }}>
                      Monto:
                    </Text>
                    <Text style={{ width: "17%", fontWeight: "bold" }}>
                      Mora:
                    </Text>
                    <Text style={{ width: "20%", fontWeight: "bold" }}>
                      Pagado:
                    </Text>
                  </View>
                  {quotas?.map((quota, index) => (
                    <View key={index}>
                      <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={{ width: "17%" }}>
                          <Text style={{ fontWeight: "bold" }}>
                            {quotas[index].quotaNumber}/
                            {receiptDetails?.fixedQuotas}
                          </Text>
                        </View>
                        <View style={{ width: "30%" }}>
                          <Text>
                            {quota.date
                              .split("T")[0]
                              .split("-")
                              .reverse()
                              .join("/")}
                          </Text>
                        </View>
                        <View style={{ width: "20%" }}>
                          <Text>
                            {significantFigure(
                              parseFloat(quota.amount).toFixed(2)
                            )}
                          </Text>
                        </View>
                        <View style={{ width: "17%" }}>
                          <Text>
                            {parseFloat(
                              significantFigure(quota.fixedMora)
                            ).toFixed(2)}
                          </Text>
                        </View>
                        <View style={{ width: "20%" }}>
                          <Text style={{ fontWeight: "bold" }}>
                            {quota.statusType != "COMPOST"
                              ? significantFigure(
                                  (
                                    parseFloat(quota.totalPaid) +
                                    parseFloat(quota.fixedMora) -
                                    quota.currentPaid
                                  ).toFixed(2)
                                )
                              : significantFigure(
                                  (
                                    parseFloat(quota.totalPaid) +
                                    parseFloat(quota.totalPaidMora)
                                  ).toFixed(2)
                                )}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          marginBottom: 5,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Icon
                          name="subdirectory-arrow-right"
                          size={18}
                          color="gray"
                        />
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              marginTop: 5,
                              marginLeft: 5,
                              fontSize: 12,
                              textAlignVertical: "center",
                              textAlign: "center",
                              color: "gray",
                            }}
                          >
                            Desc. Mora: RD${quota.discountMora || 0}
                          </Text>
                          <Text
                            style={{
                              marginTop: 5,
                              marginLeft: 20,
                              fontSize: 12,
                              textAlignVertical: "center",
                              textAlign: "center",
                              color: "gray",
                            }}
                          >
                            Desc. Interés: RD${quota.discountInterest || 0}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={{ marginTop: 15 }}>
                  <View style={styles.totalSection}>
                    <Text style={styles.totalSectionTitle}>Total Mora:</Text>
                    <Text style={styles.totalSectionBody}>
                      RD${" "}
                      {hasDecimal(receiptDetails.mora)
                        ? significantFigure(receiptDetails.mora.toFixed(2))
                        : receiptDetails.mora + ".00"}
                    </Text>
                  </View>
                  <View style={styles.totalSection}>
                    <Text style={styles.totalSectionTitle}>SubTotal:</Text>
                    <Text style={styles.totalSectionBody}>
                      RD${" "}
                      {hasDecimal(totalPaid(quotas, true) + receiptDetails.mora)
                        ? significantFigure(
                            (
                              totalPaid(quotas, true) + receiptDetails.mora
                            ).toFixed(2)
                          )
                        : significantFigure(
                            (
                              totalPaid(quotas, true) + receiptDetails.mora
                            ).toFixed(2)
                          )}
                    </Text>
                  </View>
                  <View style={styles.totalSection}>
                    <Text style={styles.totalSectionTitle}>Descuentos:</Text>
                    <Text style={styles.totalSectionBody}>
                      RD${" "}
                      {significantFigure(receiptDetails.discount?.toFixed(2))}
                    </Text>
                  </View>
                  <View style={styles.totalSection}>
                    <Text style={styles.totalSectionTitle}>Total:</Text>
                    <Text style={styles.totalSectionBody}>
                      RD$
                      {significantFigure(
                        (
                          totalPaid(quotas, true) +
                          receiptDetails.mora -
                          receiptDetails.discount
                        ).toFixed(2)
                      )}
                    </Text>
                  </View>
                  <View style={styles.totalSection}>
                    <Text style={styles.totalSectionTitle}>
                      Monto Recibido:
                    </Text>
                    <Text style={styles.totalSectionBody}>
                      RD${" "}
                      {significantFigure(
                        receiptDetails.receivedAmount?.toFixed(2)
                      )}
                    </Text>
                  </View>
                  <View style={styles.totalSection}>
                    <Text style={styles.totalSectionTitle}>Total Pagado:</Text>
                    <Text style={styles.totalSectionBody}>
                      RD${" "}
                      {significantFigure(receiptDetails.totalPaid?.toFixed(2))}
                    </Text>
                  </View>
                  {/* <View style={styles.totalSection}>
                    <Text style={styles.totalSectionTitle}>
                      Saldo Pendiente:
                    </Text>
                    <Text style={styles.totalSectionBody}>
                      RD${" "}
                      {significantFigure(
                        receiptDetails?.pendingAmount?.toFixed(2)
                      )}
                    </Text>
                  </View> */}
                  <View style={styles.totalSection}>
                    <Text style={styles.totalSectionTitle}>Cambio:</Text>
                    <Text style={styles.totalSectionBody}>
                      RD${" "}
                      {significantFigure(receiptDetails.cashBack?.toFixed(2))}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 15, flexDirection: "row", bottom: 0 }}>
                <Text
                  onPress={() =>
                    navigation.navigate("PaymentsRoot", {
                      screen: "Payments",
                      params: {
                        loanNumber: receiptDetails.loanNumber,
                        origin: "customerInfo",
                      },
                    })
                  }
                  style={{
                    width: "50%",
                    textAlignVertical: "center",
                    color: "blue",
                  }}
                >
                  Volver a Cobros
                </Text>
                <View style={{ width: "50%" }}>
                  <Button
                    style={{ marginLeft: "auto", right: 0 }}
                    title="Imprimir"
                    onPress={async () => {
                      const response = await printByBluetooth(
                        receiptDetails,
                        origin
                      );
                      //console.log("Pay", response);
                      if (response == true) {
                        navigation.navigate("Payments", {
                          loanNumber: receiptDetails.loanNumber,
                        });
                      } else {
                        Alert.alert(
                          "Error de Impresión",
                          "Verifique que la impresora no esté ihnibida e inténtelo nuevamente."
                        );
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      ) : (
        <Modal
          transparent={true}
          animationType="fade"
          visible={receiptVisibility}
          style={{ height: 50, backgroundColor: "rgba(255, 255, 255, 0)" }}
        >
          <ScrollView
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              paddingBottom: 15,
              backgroundColor: "rgba(0,0,0, 0.3)",
            }}
          >
            <View
              style={{
                height: 800,
                backgroundColor: "white",
                marginVertical: 20,
                borderRadius: 5,
                marginHorizontal: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                paddingVertical: 20,
                paddingHorizontal: 0,
              }}
            >
              <View style={{ paddingHorizontal: 10 }}>
                <Icon
                  name="close"
                  size={25}
                  onPress={() => setReceiptVisibility(false)}
                  style={{ textAlign: "right" }}
                />
              </View>

              {isPrinting && <Loading text="Imprimiendo..." />}
              <ReceiptHtml html={customHtml} />

              <View
                style={{
                  marginTop: 15,
                  flexDirection: "row",
                  bottom: 0,
                  paddingHorizontal: 10,
                }}
              >
                <Text
                  onPress={() =>
                    navigation.navigate("PaymentsRoot", {
                      screen: "Payments",
                      params: {
                        loanNumber: receiptDetails.loanNumber,
                        origin: "customerInfo",
                      },
                    })
                  }
                  style={{
                    width: "50%",
                    textAlignVertical: "center",
                    color: "blue",
                  }}
                >
                  Volver a Cobros
                </Text>
                <View style={{ width: "50%" }}>
                  {/* <Button
                    style={{ marginLeft: "auto", right: 0 }}
                    title="Imprimir"
                    onPress={async () => {
                      setIsPrinting(true);
                      const response = await printByBluetooth(
                        receiptDetails,
                        origin
                      );
                      setIsPrinting(false);
                      //console.log("Pay", response);
                      if (response == true) {
                        navigation.navigate("Payments", {
                          loanNumber: receiptDetails.loanNumber,
                        });
                      } else {
                        Alert.alert("Error de Impresión", response.message);
                      }
                    }}
                  /> */}
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  totalSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  totalSectionTitle: {
    fontSize: 14,
    textAlign: "right",
  },

  totalSectionBody: {
    fontSize: 16,
    textAlign: "right",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

function getTotalMora(arr) {
  var sum = 0;

  arr.map((item) => {
    sum += parseInt(item.mora);
  });

  return sum.toString();
}

function hasDecimal(num) {
  console.log("has decimal", !!(parseFloat(num) % 1));
  return !!(parseFloat(num) % 1);
}
