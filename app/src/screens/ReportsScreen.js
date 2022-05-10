import { View, Text, FlatList, StyleSheet } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getDaypaymentsRepApi } from "../api/reports";
import PrintBtn from "../components/PrintBtn";

export default function ReportsScreen(props) {
  const {
    route: { params },
  } = props;
  const { bodyKey, header } = params.params;

  const { auth } = useAuth();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [allSelected, setAllSelected] = useState(true);
  const [allDisabled, setAllDisabled] = useState(false);
  const [arrearSelected, setArrearSelected] = useState(false);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    (async () => {
      var response;
      var formatedRespose = [];

      switch (bodyKey) {
        case "daypayments":
          response = await getDaypaymentsRepApi(auth.employee_id);

          formatedRespose = [
            ...new Map(
              response.map((item) => [item["receipt_number"], item])
            ).values(),
          ];

          const arrear = [];
          switch (filter) {
            case "arrear":
              formatedRespose.map((item) => {
                item.arrear == "Y" ? arrear.push(item) : undefined;
              });

              formatedRespose = arrear;

              break;

            case "nothing":
              formatedRespose = [];
              break;

            default:
              break;
          }

          break;
        case "":
          break;

        default:
          formatedRespose = formatedRespose;
          break;
      }

      console.log(formatedRespose);
      setReports(formatedRespose);
    })();
  }, [filter]);

  const formatTime = (time) => {
    const format = time.split(":");
    var suffix;

    format[0] > "12" ? (suffix = "p.m") : (suffix = "a.m");

    format[0] == "00"
      ? (format[0] = "12")
      : format[0] > "12"
      ? (format[0] -= 12)
      : format[0];

    const niceTime = `${format[0]}:${format[1]} ${suffix}`;

    return niceTime;
  };

  function validateSelection(key, action) {
    var result = "";
    console.log(key);
    switch (key) {
      case "all":
        if (arrearSelected) {
          result = "arrear";
        } else {
          if (action == "enabled") {
            result = "";
          } else {
            result = "nothing";
          }
        }

        break;
      case "arrear": {
        if (action == "enabled") {
          result = "arrear";

          setAllDisabled(true);
        } else {
          setAllSelected(true);
          setAllDisabled(false);
          result = "";
        }
      }
      default:
        break;
    }
    console.log("RESULT", result);
    return result;
  }

  return (
    <View style={{ paddingBottom: 25, height: "100%" }}>
      <View
        style={{ flexDirection: "row", width: "100%", paddingVertical: 10 }}
      >
        <View style={styles.filter}>
          <CheckBox
            disabled={allDisabled}
            value={allSelected}
            onValueChange={() => {
              if (!allSelected) {
                setAllSelected(true);
                setFilter(validateSelection("all", "enabled"));
              } else {
                setAllSelected(false);
                setFilter(validateSelection("all", "disabled"));
              }
            }}
          />
          <Text>Todos</Text>
        </View>
        <View style={styles.filter}>
          <CheckBox
            value={arrearSelected}
            onValueChange={() => {
              if (!arrearSelected) {
                setArrearSelected(true);
                setFilter(validateSelection("arrear", "enabled"));
              } else {
                setArrearSelected(false);
                setFilter(validateSelection("arrear", "disabled"));
              }
            }}
          />
          <Text>Atraso</Text>
        </View>
        {/* <View style={styles.filter}>
          <CheckBox value={false} />
          <Text>Clientes Nuevos</Text>
        </View>
        <View style={styles.filter}>
          <Text>Refresh</Text>
        </View> */}
      </View>
      <View style={styles.headerContainer}>
        {header.map((item, index) => (
          <Text key={index} style={styles.headerItem}>
            {item}
          </Text>
        ))}
      </View>
      <FlatList
        style={{ paddingTop: 20, paddingHorizontal: 5 }}
        data={reports}
        keyExtractor={(item) => item.receipt_number}
        renderItem={({ item }) => (
          <View style={{ width: "100%" }}>
            {bodyKey == "daypayments" ? (
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    ...styles.bodyItem,
                    fontWeight: "bold",
                    width: "12%",
                  }}
                >
                  {item.loan_number_id}
                </Text>
                <Text style={{ ...styles.bodyItem }}>{item.name}</Text>
                <Text
                  style={{
                    ...styles.bodyItem,
                    color: "darkblue",
                    fontWeight: "bold",
                  }}
                >
                  {item.receipt_number}
                </Text>
                <Text
                  style={{ ...styles.bodyItem, paddingLeft: 5, width: "26%" }}
                >
                  {item.date} {formatTime(item.time)}
                </Text>
                <Text
                  style={{
                    ...styles.bodyItem,
                    fontWeight: "bold",
                    width: "20%",
                  }}
                >
                  {item.pay}
                </Text>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        )}
      />
      <PrintBtn data={reports} header={header} />
    </View>
  );
}

const styles = StyleSheet.create({
  filter: {
    flexDirection: "row",
    alignItems: "center",
    width: "25%",
  },

  headerContainer: {
    flexDirection: "row",
    backgroundColor: "#6EADB9",
    height: 25,
  },

  headerItem: {
    width: "20%",
    textAlign: "center",

    color: "white",
    fontWeight: "bold",
  },

  bodyItem: {
    width: "22%",
    paddingVertical: 10,
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "ghostwhite",
  },
});
