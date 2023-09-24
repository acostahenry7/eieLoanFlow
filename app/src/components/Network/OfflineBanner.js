import { View, Text, StyleSheet } from "react-native";
import FtIcon from "react-native-vector-icons/Feather";
import React from "react";

const OfflineBanner = () => {
  return (
    <View style={styles.container}>
      <FtIcon style={styles.icon} name="wifi-off" />
      <View style={styles.textContainer}>
        <Text style={styles.text}>No tiene conexión a Internet</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 70,
    color: "darkred",
  },

  textContainer: {
    paddingVertical: 15,
  },

  text: {
    color: "darkred",
    fontWeight: "bold",
  },
});

export { OfflineBanner };
