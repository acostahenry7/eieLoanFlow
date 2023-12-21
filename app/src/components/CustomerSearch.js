import React from "react";
import { View, StyleSheet, TextInput } from "react-native";

export default function CustomerSearch({ searchStatus, setSearchValue }) {
  const onSearchValueChange = (e) => {
    setSearchValue(e.target.value);
    console.log(e.target);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputItem}
        placeholder="Buscar por nombre, cédula o negocio..."
        onChangeText={(text) => setSearchValue(text)}
        value={searchStatus}
        keyboardType="web-search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 30,
  },

  inputItem: {
    height: 40,
    backgroundColor: "whitesmoke",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 15,
    borderRadius: 50,
  },
});
