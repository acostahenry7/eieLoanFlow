import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import React from "react";
import { customPrintData } from "../api/bluetooth/Print";
import { reportPrinting } from "../api/bluetooth/Reports";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function PrintBtn(props) {
  const { data, header, description } = props;

  console.log("From brn", header);

  return (
    <View>
      <Modal visible={true}>
        <View style={{ height: "100%" }}></View>
      </Modal>
      <TouchableWithoutFeedback>
        <View
          style={{
            position: "absolute",
            backgroundColor: "skyblue",
            bottom: 0,
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
              await reportPrinting({
                data,
                header,
                reportDescription: description,
              });
              console.log("hi");
            }}
          >
            <Icon name="print" size={50} />
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
