import { View, Text, Modal } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { RNCamera, Camera } from "react-native-camera";
import { useCamera } from "react-native-camera-hooks";
import Icon from "react-native-vector-icons/Entypo";
import RNFS from "react-native-fs";
import ImagePreview from "./ImagePreview";
import { isEmpty } from "lodash";

export default function EIECamera(props) {
  const { visible, trigger, customer } = props;
  const [{ cameraRef }, { takePicture }] = useCamera(null);

  useEffect(() => {
    console.log(visible);
    (() => {
      setCamVisibility(visible);
    })();
  }, [trigger]);

  const [camVisibility, setCamVisibility] = useState(visible);
  const [imageCaptured, setImageCaptured] = useState(false);
  const [image, setImage] = useState({});

  console.log(imageCaptured);

  const handleCapture = async () => {
    try {
      const data = await takePicture();
      const currentLocation = data.uri;
      console.log(data);
      const filename = `${customer.key}${Date.now()}.jpg`;
      const newLocation = RNFS.ExternalDirectoryPath + filename;
      console.log("CURRENT URI", newLocation);
      setImage({ ...data, currentUri: `file://${newLocation}`, filename });
      RNFS.moveFile(currentLocation, newLocation)
        .then(() => {
          console.log(`Image moved from ${currentLocation} to ${newLocation}`);
          setImageCaptured(true);
          //setCamVisibility(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Modal visible={camVisibility} animationType="fade">
        <RNCamera
          ref={cameraRef}
          type={RNCamera.Constants.Type.back}
          style={{
            //flex: 1,
            zIndex: 0,
            //height: '100%',
            width: "100%",
          }}
        >
          <View
            style={{
              height: "80%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
          >
            <View
              style={{
                width: 370,
                height: 370,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderWidth: 4,
                borderColor: "white",
                borderRadius: 320,
              }}
            ></View>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: "20%",
              backgroundColor: "rgba(0,0,0,0.95)",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 50,
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setCamVisibility(false);
              }}
            >
              <Icon
                name="chevron-thin-left"
                size={20}
                color="white"
                onPress={() => {
                  setCamVisibility(false);
                }}
              />
            </View>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 50,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: "rgba(0,0,0,0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 30, color: "transparent" }}
                  onPress={() => handleCapture()}
                >
                  O
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 50,
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: "rgba(0,0,0,0.1)",
                }}
              ></View>
            </View>
          </View>
        </RNCamera>
      </Modal>

      <ImagePreview
        visibility={imageCaptured}
        image={image}
        unsetImage={setImageCaptured}
        customer={customer}
      />
    </View>
  );
}
