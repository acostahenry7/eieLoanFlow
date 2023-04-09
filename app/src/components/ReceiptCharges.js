import { View, Text, Modal, ScrollView, Button } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import Loading from "../components/Loading";
import { printByBluetooth } from "../api/bluetooth/Print";
import { Alert } from "react-native";

export default function ReceiptCharges(props) {
  const {
    receiptDetails,
    receiptVisibility,
    setReceiptVisibility,
    navigation,
    origin,
  } = props;

  const time = (time) => {
    var res = time?.split(".");

    res ? (time = res[0]) : (time = 0);

    return time;
  };

  return (
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
          {/* <Image
            style={{ width: "100%", height: 100 }}
            source={{
              uri: "http://op.grupoavant.com.do:26015/assets/profile/banner1.png",
            }}
          /> */}
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
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>Cajero:</Text>
                  <Text>{receiptDetails.login}</Text>
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
              Gastos
            </Text>
            <ScrollView
              style={{ marginTop: 20, maxHeight: 250 }}
              nestedScrollEnabled={true}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold" }}>Descripción</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <Text>{receiptDetails.description}</Text>
                <Text>{receiptDetails.amount}</Text>
                {/* <Text>{quotas.length}</Text> */}
              </View>
            </ScrollView>
            <View></View>
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
  );
}
