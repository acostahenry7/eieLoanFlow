import { View, Text, TextInput } from "react-native";
import React from "react";

export default function SearchEngine(props) {
  const { currentState, setSearchedState } = props;

  return (
    <TextInput
      placeholder="Escribe para buscar..."
      onChangeText={(text) => console.log(text)}
      style={{
        marginTop: 5,
        marginLeft: "auto",
        marginRight: "auto",
        height: 20,
        borderWidth: 1,
        borderColor: "#D1D7DB",
        width: 375,
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 3,
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.5)",
        paddingBottom: 0,
      }}
    />
  );
}
