import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { customPrintData } from "../api/bluetooth/Print";
import { reportPrinting } from "../api/bluetooth/Reports";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function PrintBtn(props) {
  const { data, header, description } = props;
  const [isLoading, setIsLoading] = useState(false);

  console.log("From brn", header);

  return (
    <View>
      <Modal visible={isLoading} transparent={true}>
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,1)",
              paddingHorizontal: 10,
              paddingVertical: 15,
              borderRadius: 4,
              elevation: 5,
            }}
          >
            <ActivityIndicator color={"#4682b4"} size={50} />
            <Text style={{ color: "rgba(0,0,0,0.5)" }}>
              Imprimiendo, porfavor espere...
            </Text>
          </View>
        </View>
      </Modal>
      <TouchableWithoutFeedback>
        <View
          style={{
            position: "absolute",
            backgroundColor: "#4682b4",
            bottom: 30,
            right: 0,
            paddingVertical: 10,
            paddingHorizontal: 10,
            marginHorizontal: 10,
            borderRadius: 50,
            elevation: 5,
            //height: 50,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              marginTop: "auto",
              marginBottom: "auto",
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
            onPress={async () => {
              setIsLoading(true);
              try {
                await reportPrinting({
                  data,
                  header,
                  reportDescription: description,
                });
              } catch (error) {
                Alert.alert(
                  "Error accediendo al printer. Diríjase a Dispositivos y añada una."
                );
              }

              setIsLoading(false);
              console.log("hi");
            }}
          >
            <Icon name="print" size={40} />
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
