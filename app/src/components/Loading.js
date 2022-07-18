import { View, Text, ActivityIndicator, Modal } from "react-native";
import React from "react";

export default function Loading(props) {
  const { text } = props;

  return (
    <Modal visible={true} transparent={true}>
      <View
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.0)",
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
            {text || "Cargando, porfavor espere..."}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
