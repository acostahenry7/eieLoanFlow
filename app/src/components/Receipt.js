import React from "react";
import {
  View,
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

export default function Receipt(props) {
  const {
    receiptDetails,
    receiptVisibility,
    setReceiptVisibility,
    quotas,
    navigation,
  } = props;

  receiptDetails.amortization = [...quotas];

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
      subtotal == true ? (param = item.fixedAmount) : (param = item.totalPaid);
      sum += parseFloat(param);
    });

    //console.log(sum);
    return sum;
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={receiptVisibility}
      style={{ height: 50, backgroundColor: "rgba(255, 255, 255, 0)" }}
    >
      <View style={{ height: "100%", backgroundColor: "rgba(0,0,0, 0.3)" }}>
        <View
          style={{
            backgroundColor: "white",
            marginTop: "auto",
            marginBottom: "auto",
            marginHorizontal: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            paddingVertical: 20,
            paddingHorizontal: 15,
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
            style={{ width: "100%", height: 90 }}
            source={{
              uri: "http://op.grupoavant.com.do:26015/assets/profile/banner1.png",
            }}
          />
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>{receiptDetails.outlet}</Text>
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
                    {receiptDetails?.firstName + " " + receiptDetails?.lastName}
                  </Text>
                </View>
                <View style={{ marginTop: 10, flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Zona:</Text>
                  <Text style={{ marginLeft: 5 }}>
                    {receiptDetails?.section || "Zona 2 - Villa Mella"}
                  </Text>
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
            <ScrollView style={{ marginTop: 20, maxHeight: 250 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "17%", fontWeight: "bold" }}>
                  No. Cuota:
                </Text>
                <Text style={{ width: "30%", fontWeight: "bold" }}>
                  Fecha cuota:
                </Text>
                <Text style={{ width: "20%", fontWeight: "bold" }}>Monto:</Text>
                <Text style={{ width: "17%", fontWeight: "bold" }}>Mora:</Text>
                <Text style={{ width: "20%", fontWeight: "bold" }}>
                  Pagado:
                </Text>
              </View>
              {quotas?.map((quota, index) => (
                <View key={index}>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <View style={{ width: "17%" }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {quotas[index].quota_number}
                      </Text>
                    </View>
                    <View style={{ width: "30%" }}>
                      <Text>{quota.date}</Text>
                    </View>
                    <View style={{ width: "20%" }}>
                      <Text>{quota.fixedAmount}</Text>
                    </View>
                    <View style={{ width: "17%" }}>
                      <Text>{quota.mora}</Text>
                    </View>
                    <View style={{ width: "20%" }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {quota.totalPaid}
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
                  RD${getTotalMora(quotas)}
                  .00
                </Text>
              </View>
              <View style={styles.totalSection}>
                <Text style={styles.totalSectionTitle}>SubTotal:</Text>
                <Text style={styles.totalSectionBody}>
                  RD${totalPaid(quotas, true) + receiptDetails.mora}
                  .00
                </Text>
              </View>
              <View style={styles.totalSection}>
                <Text style={styles.totalSectionTitle}>Descuentos:</Text>
                <Text style={styles.totalSectionBody}>
                  RD$ {receiptDetails.discount}.00
                </Text>
              </View>
              <View style={styles.totalSection}>
                <Text style={styles.totalSectionTitle}>Total:</Text>
                <Text style={styles.totalSectionBody}>
                  RD${" "}
                  {totalPaid(quotas, true) +
                    receiptDetails.mora -
                    receiptDetails.discount}
                  .00
                </Text>
              </View>
              <View style={styles.totalSection}>
                <Text style={styles.totalSectionTitle}>Monto Recibido:</Text>
                <Text style={styles.totalSectionBody}>
                  RD${totalPaid(quotas) + receiptDetails.cashBack}.00
                </Text>
              </View>
              <View style={styles.totalSection}>
                <Text style={styles.totalSectionTitle}>Saldo Pendiente:</Text>
                <Text style={styles.totalSectionBody}>
                  RD$
                  {totalPaid(quotas, true) +
                    receiptDetails.mora -
                    receiptDetails.discount -
                    totalPaid(quotas)}
                  .00
                </Text>
              </View>
              <View style={styles.totalSection}>
                <Text style={styles.totalSectionTitle}>Cambio:</Text>
                <Text style={styles.totalSectionBody}>
                  RD${receiptDetails.cashBack}.00
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 15, flexDirection: "row", bottom: 0 }}>
            <Text
              onPress={() =>
                navigation.navigate("Payments", {
                  loanNumber: receiptDetails.loanNumber,
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
                  const response = await printByBluetooth(receiptDetails);
                  console.log("Pay", response);
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
      </View>
    </Modal>
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
