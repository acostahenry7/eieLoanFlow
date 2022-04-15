import { View, Text, Button, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { customPrintData } from "../api/bluetooth/Print";

export default function PrintBtn(props) {
  const { data, header } = props;

  console.log("From brn", header);

  return (
    <View>
      <TouchableWithoutFeedback>
        <View
          style={{
            position: "absolute",
            backgroundColor: "skyblue",
            bottom: 0,
            right: 0,
            paddingHorizontal: 10,
            marginHorizontal: 10,
            borderRadius: 30,
            height: 50,
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
              await customPrintData({ data, header });
              console.log("hi");
            }}
          >
            Imprimir
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
