import { View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import React, { useEffect, useState } from "react";
import { getCustomerImgApi } from "../api/camera";
import EIECamera from "../components/Camera";

export default function CustomerIcon(props) {
  const { size, imageSize, data, trigger } = props;
  var [uri, setUri] = useState(data?.image_url);

  useEffect(() => {
    (() => {
      setUri((uri += `?${Date.now()}`));
    })();
  }, [trigger]);

  return (
    <View style={{ ...styles.customIcon, width: size, height: size }}>
      {data?.image_url ? (
        <Image
          style={{ width: imageSize, height: imageSize, borderRadius: 100 }}
          source={{
            uri: uri,
          }}
        />
      ) : (
        <Image
          style={{ width: imageSize, height: imageSize, borderRadius: 100 }}
          source={{
            uri: "https://tanzolymp.com/images/default-non-user-no-photo-1.jpg",
          }}
        />
      )}
      {/* <Icon name="user" size={70} color="whitesmoke" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  customIcon: {
    backgroundColor: "#dee2e6",
    marginTop: 10,
    //marginLeft: "auto",
    //marginRight: "auto",
    //marginTop: 15,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    padding: 5,
    borderColor: "#757575",
    borderWidth: 1,

    color: "white",
  },
});
