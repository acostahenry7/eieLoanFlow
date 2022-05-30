import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import React, { useEffect, useState } from "react";
import { getVisitsApi } from "../../api/visit";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/stringFuctions";
import DatePicker from "react-native-date-picker";
import PrintBtn from "../PrintBtn";

export default function Visits(props) {
  const { auth } = useAuth();
  const [visits, setVisits] = useState();
  const [startingDate, setStartingDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    (async () => {
      let data = {
        userId: auth.user_id,
        startingDate: formatDate(startingDate.toISOString(), false, "dash"),
        endDate: formatDate(endDate.toISOString(), false, "dash"),
      };
      console.log(data);
      const response = await getVisitsApi(data);
      console.log(response);
      setVisits(response);
    })();
  }, [startingDate, endDate]);

  const fields = [
    {
      field: "Ubicación",
      valueKey: "actual_location",
    },
    {
      field: "Fecha",
      valueKey: "visit_date",
    },
    {
      field: "Cliente",
      valueKey: "name",
    },
    {
      field: "Comentario",
      valueKey: "commentary",
    },
  ];

  var searchedVisits = [];

  if (searchValue.length > 0) {
    console.log("hi");
    searchedVisits = visits.filter((visit) => {
      let reference = visit.name.toLowerCase();
      let searchedText = searchValue.toLowerCase();
      return reference.includes(searchedText);
    });
  } else {
    searchedVisits = visits;
  }

  return (
    <View
      style={{
        paddinTop: 5,
        paddingHorizontal: 10,
        width: "100%",
        height: "100%",
      }}
    >
      <View
        style={{
          backgroundColor: "#4682b4",
          alignItems: "center",
          paddingVertical: 15,
          marginTop: 10,
          marginBottom: 15,
          elevation: 5,
          borderRadius: 4,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          Reporte de Visitas
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.textInput}
          placeholder="Buscar cliente"
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
        <Icon name={"search"} size={20} style={styles.icon} />
      </View>
      <View style={{ marginVertical: 20, width: "100%" }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%", paddingHorizontal: 5 }}>
            <Text
              style={{
                paddingVertical: 2,
                paddingHorizontal: 5,
                borderRadius: 2,
                backgroundColor: "#4682b4",
                color: "white",
                textAlign: "center",
              }}
              onPress={() => setStartDateOpen(true)}
            >
              Desde
            </Text>
            <Text style={{ textAlign: "center" }}>
              {formatDate(startingDate.toISOString())}
            </Text>
          </View>
          <View
            style={{
              width: "50%",
              paddingHorizontal: 5,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                paddingVertical: 2,
                paddingHorizontal: 5,
                borderRadius: 2,
                backgroundColor: "#4682b4",
                color: "white",
                textAlign: "center",
              }}
              onPress={() => setEndDateOpen(true)}
            >
              Hasta
            </Text>
            <Text style={{ textAlign: "center" }}>
              {formatDate(endDate.toISOString(), false)}
            </Text>
          </View>
        </View>
        <DatePicker
          modal
          mode="date"
          open={startDateOpen}
          date={startingDate}
          onConfirm={(date) => {
            setStartDateOpen(false);
            console.log("hi");
            setStartingDate(date);
          }}
          onCancel={() => {
            setStartDateOpen(false);
          }}
        />
        <DatePicker
          modal
          mode="date"
          open={endDateOpen}
          date={endDate}
          onConfirm={(date) => {
            setEndDateOpen(false);
            setEndDate(date);
          }}
          onCancel={() => {
            setEndDateOpen(false);
          }}
        />
      </View>
      <FlatList
        keyExtractor={(item) => item.visit_id}
        data={searchedVisits}
        renderItem={({ item, index }) => (
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10,
              paddingVertical: 15,
              marginVertical: 5,
              elevation: 5,
              borderRadius: 4,
            }}
          >
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={{}}>
                {fields.map((field, index) => (
                  <View key={index} style={{ flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold", width: 120 }}>
                      {field.field}:
                    </Text>
                    {field.valueKey == "visit_date" ? (
                      <Text style={{ width: "65%" }}>
                        {item[field.valueKey]}
                      </Text>
                    ) : (
                      <Text style={{ width: "68%" }}>
                        {item[field.valueKey]}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
              {/* <View style={{ width: "72%" }}>
                <Text>{item.actual_location}</Text>
                <Text>{formatDate(item.visit_date, true)}</Text>
                <Text>{item.name}</Text>
                <Text>{item.commentary}</Text>
              </View> */}
            </View>
          </View>
        )}
      />
      <PrintBtn
        data={searchedVisits}
        header={["Ubicacion", "Fecha", "Cliente", "Comentario"]}
        description={"Reporte de Visitas"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginTop: 5,
    height: 20,
    borderWidth: 1,
    borderColor: "#D1D7DB",
    width: 330,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 3,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 0,
  },

  icon: {
    marginLeft: 15,
    marginTop: 5,
    borderWidth: 0.5,
    borderRadius: 2,
    width: 36,
    height: 36,
    textAlignVertical: "center",
    textAlign: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "rgba(255, 255, 255,0.4)",
    borderColor: "rgba(0,0,0,0.4)",
  },
});
