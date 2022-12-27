import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Icon from "react-native-vector-icons/Entypo";
import IonIcon from "react-native-vector-icons/Ionicons";
import React from "react";
import CustomerIcon from "../components/CustomerIcon";
import { useNavigation } from "@react-navigation/native";
import { capitalize } from "../utils/stringFuctions";
import { WINDOW_DIMENSION as windowsDimenssion } from "../utils/constants";

export default function CardTemplate(props) {
  const {
    mainText,
    mainTitle,
    uid,
    data,
    secondaryText,
    secondaryTitle,
    menuOptions,
    actionParam,
    actionParam2,
    screen,
    admin,
  } = props;

  const formatText = (str) => {
    var result = "";

    if (str) {
      if (str.split(" ").length > 4) {
        result = `${str.split(" ")[0]} ${str.split(" ")[1]} ${
          str.split(" ")[2]
        } ${str.split(" ")[3]}`;
        console.log();
        return capitalize(result);
      } else {
        return capitalize(str);
      }
    } else {
      return;
    }
  };

  const navigation = useNavigation();

  return (
    <View>
      {screen != "Recibo" ? (
        <View style={styles.cardContainer}>
          <View style={styles.cardRow}>
            <View
              style={{
                marginRight: 10,
                justifyContent: "center",
              }}
            >
              <CustomerIcon size={80} imageSize={80} data={data} />
            </View>

            <View>
              <View
                style={{
                  ...styles.section,
                  marginLeft: 0,
                  justifyContent: "flex-start",
                  paddingTop: 12,
                  width: "100%",
                }}
              >
                <Text style={styles.title}>{mainTitle}</Text>
                <Text style={styles.mainText}>{formatText(mainText)}</Text>
              </View>
              <View style={{ marginTop: 7 }}>
                <Text style={styles.title}>{secondaryTitle}</Text>
                <Text style={styles.secondaryText}>
                  {capitalize(secondaryText)}
                </Text>
              </View>
            </View>
            <View style={{}}>
              {admin == true && (
                <Menu>
                  <MenuTrigger>
                    <IonIcon
                      name={"menu"}
                      size={25}
                      style={{
                        zIndex: 99,
                      }}
                    />
                  </MenuTrigger>
                  <MenuOptions
                    customStyles={{ optionText: { fontSize: 15 } }}
                    optionsContainerStyle={{ marginLeft: 6 }}
                  >
                    {menuOptions?.map((option, index) => (
                      <MenuOption
                        key={index}
                        text={option.name}
                        style={styles.menuOption}
                        onSelect={async () => {
                          //console.log(option);
                          option.action(actionParam);
                        }}
                      />
                    ))}
                  </MenuOptions>
                </Menu>
              )}
            </View>
          </View>
          {screen != "collectors" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: 12,
                justifyContent: "space-around",
              }}
            >
              <Icon
                name="location"
                size={20}
                color={"crimson"}
                onPress={() => {
                  navigation.navigate("GpsRoot", { screen: "Gps" });
                }}
              />

              <Icon
                name="user"
                size={20}
                color={"#5f9ea0"}
                onPress={() => {
                  navigation.navigate("Customers", {
                    screen: "Customer",
                    params: { id: uid },
                  });
                }}
              />
              <IonIcon name="qr-code" size={18} />
            </View>
          )}
        </View>
      ) : (
        <TouchableWithoutFeedback>
          <View
            style={{
              ...styles.rCardContainer,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View>
              <Text style={styles.title}>{mainTitle}</Text>
              <Text>{mainText}</Text>
            </View>
            <View>
              <Text style={styles.title}>{secondaryTitle}</Text>
              <Text>{capitalize(secondaryText)}</Text>
            </View>
            <View>
              <Menu>
                <MenuTrigger>
                  <Icon
                    name="dots-three-vertical"
                    style={{
                      top: 0,
                      fontSize: 18,
                      color: "black",
                      paddingHorizontal: 13,
                      paddingVertical: 6,
                      borderRadius: 50,
                    }}
                  />
                </MenuTrigger>
                <MenuOptions
                  customStyles={{ optionText: { fontSize: 15 } }}
                  optionsContainerStyle={{ marginLeft: 6 }}
                >
                  {menuOptions?.map((option, index) => (
                    <MenuOption
                      key={index}
                      text={option.name}
                      style={styles.menuOption}
                      onSelect={async () => {
                        //console.log(option);
                        option.action(actionParam);
                      }}
                    />
                  ))}
                </MenuOptions>
              </Menu>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    elevation: 3,
    //marginTop: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderLeftColor: "#4682b4",
    borderLeftWidth: 7,
    marginHorizontal: 1,
    marginBottom: 10,
  },

  rCardContainer: {
    elevation: 3,
    //marginTop: 10,
    backgroundColor: "white",
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 10,
    borderLeftColor: "#4682b4",
    borderLeftWidth: 7,
    marginHorizontal: 1,
    marginBottom: 4,
  },

  section: {},

  cardRow: {
    paddingBottom: 10,
    flexDirection: "row",
    borderBottomColor: "rgba(95,158,160,0.3)",
    borderBottomWidth: 0.2,
  },

  title: {
    fontSize: 13,
    minWidth: windowsDimenssion.width - 180,
  },

  mainText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  secondaryText: {
    fontWeight: "bold",
    fontSize: 14,
    width: 250,
  },

  menuOption: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    fontSize: 25,
  },
});
