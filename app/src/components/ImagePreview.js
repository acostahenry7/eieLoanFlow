import { View, Text, Modal, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { imageUploadHandler, updateCustomerImg } from "../api/camera";
import useAuth from "../hooks/useAuth";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function ImagePreview(props) {
  const { image, visibility, unsetImage, customer } = props;
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { auth } = useAuth();
  const navigation = useNavigation();

  console.log("auth", auth);
  const data = {
    customerId: customer.key,
    customerImage: image.currentUri,
    fileName: image.filename,
  };

  useEffect(() => {
    (() => {
      console.log("VISIBILITY", visibility);
      setVisible(visibility);
    })();
  }, [visibility]);

  return (
    <View>
      <Modal visible={visible} animationType="slide">
        <View>
          <View style={{ height: "90%" }}>
            <Image
              source={{ uri: image.currentUri + "?v=" }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View
            style={{
              height: "10%",
              backgroundColor: "black",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Icon
              name="close"
              color={"red"}
              size={35}
              onPress={() => {
                setVisible(false);
                unsetImage(false);
              }}
            />
            {isLoading && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 999,
                }}
              >
                <ActivityIndicator
                  size={"small"}
                  color="white"
                  style={{ position: "absolute" }}
                />
              </View>
            )}
            <Icon
              name="check"
              color={"green"}
              size={35}
              onPress={() => {
                setIsLoading(true);
                imageUploadHandler(image, data).then(() => {
                  updateCustomerImg(data).then(() => {
                    setIsLoading(false);
                    setVisible(false);

                    navigation.navigate("Customers", {
                      screen: {
                        screen: "Customer",
                        params: { id: customer.key },
                      },
                    });
                  });
                });
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
