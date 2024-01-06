import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { getCustomerInfo } from "../api/customers";
import {
  capitalize,
  extractIconText,
  formatFullName,
} from "../utils/stringFuctions";
import { goToPage } from "../utils/navigation";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import CustomerIcon from "../components/CustomerIcon";
import EIECamera from "../components/Camera";
import { useNetInfo } from "@react-native-community/netinfo";

export default function CustomerInfoScreen(props) {
  const {
    navigation,
    route: { params },
  } = props;
  var statusColor;

  const { auth } = useAuth();
  const netInfo = useNetInfo();

  console.log("$$$$$$$$$$", params);
  const [customer, setCustomer] = useState(null);
  const [loans, setLoans] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [testTrigger, setTestTrigger] = useState(false);

  useEffect(() => {
    auth
      ? (async () => {
          //setIsLoading(true);

          try {
            console.log("user info is connected");
            console.log("CUSTOMER ID", params);
            const response = await getCustomerInfo({
              id: params.customer_id || params.id,
              employeeId: auth.employee_id,
            });
            setIsLoading(false);
            const { customerInfo, customerLoans } = response;
            console.log("********** ", response, params);
            //if (Object.entries(params).length <= 1) {
            setCustomer(customerInfo);
            setLoans(customerLoans);
            //} else {
            // setCustomer(params);
            // setLoans(customerLoans);
            //}
            //console.log("@@@@@", customerLoans);
          } catch (error) {
            console.log(error);
            navigation.goBack();
          }
        })()
      : navigation.goBack();
  }, [params, auth, testTrigger, netInfo]);

  const restrict = (str) => {
    const arr = str.split(" ");
    var result;

    if (arr.length > 2) {
      return (result = arr[2] + arr[3]);
    }

    return str;
  };

  if (!customer) return null;
  if (!loans) return null;

  var loanInfo = [];

  for (var l of loans) {
    loanInfo.push({
      id: l.loan_id,
      number: l.loan_number_id,
      amount: l.amount_approved,
      situation: l.loan_situation,
      quota: l.amount_of_free,
    });
  }

  let sumaryCustomer = {
    // rnc: customer.rnc,
    // birthDate: customer
  };

  const fields = [
    // "Cédula",
    {
      field: "Fecha Nacimiento",
      value: customer.birth_date || "",
    },
    {
      field: "Teléfono",
      value: customer.phone || "",
    },
    {
      field: "Email",
      value: capitalize(customer.email) || "*No email*",
    },
    {
      field: "Provincia",
      value: capitalize(customer.province),
    },
    {
      field: "Municipio",
      value: capitalize(customer.municipality),
    },
    {
      field: "Calle/No.",
      value: capitalize(customer.street),
    },
    {
      field: "Sector",
      value: capitalize(customer.section),
    },
    {
      field: "Municipio (cliente)",
      value: capitalize(customer.municipality) || "",
    },
    {
      field: "Calle/No. (cliente)",
      value: capitalize(customer.street) || "",
    },
    {
      field: "Sector",
      value: capitalize(customer.section) || "",
    },
    {
      field: "Celular",
      value: customer.mobile || "*No celular*",
    },
  ];

  const loanTable = {
    columns: ["Préstamo", "cuota", "Monto", "Situación"],
  };

  var i = 0;

  customer.status_type = "ENABLED";

  switch (customer.status_type) {
    case "DISABLED":
      statusColor = "#b25353";
      break;
    case "ENABLED":
      statusColor = "#2c7be5";
      break;
    default:
      break;
  }

  return (
    <SafeAreaView>
      {
        <EIECamera
          visible={cameraVisible}
          trigger={trigger}
          customer={customer}
        />
      }

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView>
          <View
            style={{
              ...styles.column,
              backgroundColor: "white",
              paddingHorizontal: 10,
            }}
          >
            <View>
              {/* <Text style={styles.customIcon}>{extractIconText(formatFullName(customer.first_name, customer))}</Text> */}
              <View style={{ alignItems: "center" }}>
                <CustomerIcon
                  size={190}
                  imageSize={189}
                  data={customer}
                  trigger={testTrigger}
                />
              </View>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: "#2c7be5",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold" }}
                    onPress={() => {
                      setCameraVisible(true);
                      setTrigger(!trigger);
                    }}
                  >
                    Cambiar Foto
                  </Text>
                </View>
                <View>
                  {/* <Text
                  onPress={() => {
                    setTestTrigger(!testTrigger);
                  }}
                >
                  {" "}
                  hi
                </Text> */}
                </View>
              </View>
              <Text style={styles.customIconBottomText}>
                {formatFullName(customer.first_name, customer)}{" "}
              </Text>
              <Text
                style={{ ...styles.statusIcon, backgroundColor: statusColor }}
              >
                {capitalize(
                  customer.status_type === "ENABLED" ? "Activo" : "Inactivo"
                )}
              </Text>
            </View>
            <View style={styles.customCardContainer}>
              <Text style={styles.sectionTitle}>Datos Generales</Text>
              <View style={styles.customerInfoContainer}>
                <View style={styles.customerInfoLeftSection}>
                  {fields.map((field, index) => (
                    <View
                      style={
                        {
                          // marginTop: 8,
                          // display: "flex",
                          // flexDirection: "row",
                          // justifyContent: "space-between",
                        }
                      }
                    >
                      <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                        {field.field}:
                      </Text>
                      <Text style={{ textAlign: "center" }}>{field.value}</Text>
                    </View>
                  ))}
                </View>
                {/* Va aqui */}
              </View>
            </View>
            <View style={{ height: "auto" }}>
              <Text style={{ ...styles.sectionTitle, marginBottom: 10 }}>
                Prestamos
              </Text>
              <View style={styles.loansHeadersContainer}>
                {loanTable.columns.map((colName, index) => (
                  <Text key={index} style={styles.loansHeaders}>
                    {colName}
                  </Text>
                ))}
              </View>
              <View style={{ marginTop: 10, marginBottom: 30 }}>
                {loanInfo.map((loan) => (
                  <View key={loan.id} style={styles.loansContainer}>
                    <View
                      style={{
                        backgroundColor: "#f5f5f5",
                        width: "100%",
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        onPress={() =>
                          navigation.navigate("PaymentsRoot", {
                            screen: "Payments",
                            params: {
                              loanNumber: loan.number,
                              origin: "customerInfo",
                            },
                          })
                        }
                        style={{ ...styles.loanNumber, ...styles.loanEntry }}
                      >
                        {loan.number}
                      </Text>
                      <Text style={styles.loanEntry}>{loan.quota}</Text>
                      <Text style={styles.loanEntry}>{loan.amount}</Text>
                      <Text style={styles.loanEntry}>
                        {loan.situation == "ARREARS" ? "Atraso" : "Normal"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  customCardContainer: {
    // height: 400,
    marginTop: 35,
    marginBottom: 50,
  },

  column: {
    flex: 1,
    flexDirection: "column",
  },

  card: {
    paddingTop: 25,
  },

  customIcon: {
    backgroundColor: "skyblue",
    width: 175,
    height: 175,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 87.5,
    borderColor: "#757575",
    borderWidth: 1,
    fontSize: 75,
    color: "white",
  },

  customIconBottomText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: 25,
    fontSize: 16,
  },

  statusIcon: {
    textAlign: "center",
    //backgroundColor: statusColor,
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: 6,
    paddingRight: 4,
    borderRadius: 10,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },

  sectionTitle: {
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    color: "#808080",
  },

  customerInfoContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 25,
  },

  customerInfoRightSection: {
    width: "50%",
    paddingLeft: 5,
  },

  customerInfoLeftSection_item: {
    textAlign: "center",
    fontWeight: "bold",
  },

  customerInfoLeftSection: {
    width: "100%",
    paddingRight: 5,
  },

  customerInfoRightSection_item: {
    textAlign: "left",
  },

  loansHeadersContainer: {
    flexDirection: "row",

    //justifyContent: 'space-between'
  },

  loansHeaders: {
    textAlign: "left",
    width: "25%",
    fontWeight: "bold",
  },

  loansContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    marginBottom: 3,
  },

  loanNumber: {
    textAlign: "left",
    //backgroundColor: '#1e90ff',
    color: "#1e90ff",
    fontWeight: "bold",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    width: 60,
  },

  loanEntry: {
    width: "25%",
    paddingVertical: 8,
  },
});
