import { View, Text, StyleSheet } from "react-native";
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
  } = props;

  console.log(data);

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
    <View style={styles.cardContainer}>
      <View style={styles.cardRow}>
        <View
          style={{
            marginRight: 10,
            justifyContent: "center",
          }}
        >
          <CustomerIcon size={95} imageSize={95} data={data} />
        </View>
        <View>
          <View
            style={{
              ...styles.section,
              marginLeft: 0,
              justifyContent: "flex-start",
              paddingTop: 12,
            }}
          >
            <Text style={styles.title}>{mainTitle}</Text>
            <Text style={styles.mainText}>{formatText(mainText)}</Text>
          </View>
          <View style={{ marginTop: 7 }}>
            <Text style={styles.title}>{secondaryTitle}</Text>
            <Text style={styles.secondaryText}>
              {formatText(secondaryText)}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingTop: 10,
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
        <IonIcon name="qr-code" size={20} />
      </View>
      {/*<View>
        <Menu>
          <MenuTrigger>
            <Icon
              name="more-vert"
              style={{
                top: 0,
                fontSize: 24,
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
                  console.log(option);
                  option.action(actionParam);
                }}
              />
            ))}
          </MenuOptions>
        </Menu>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    elevation: 3,
    //marginTop: 10,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    borderLeftColor: "#4682b4",
    borderLeftWidth: 7,
    marginHorizontal: 1,
    marginBottom: 4,
    height: 180,
  },

  section: {},

  cardRow: {
    paddingBottom: 10,
    flexDirection: "row",
    borderBottomColor: "rgba(95,158,160,0.3)",
    borderBottomWidth: 0.2,
  },

  title: {
    fontWeight: "bold",
  },

  mainText: {},

  secondaryText: {},

  menuOption: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    fontSize: 25,
  },
});
