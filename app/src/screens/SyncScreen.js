import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  getUserBufferdData,
  lastSyncTimes,
  syncLoans,
  syncAmortization,
} from "../api/offline/sync";
import useAuth from "../hooks/useAuth";
import { useNetInfo } from "@react-native-community/netinfo";
import Father from "react-native-vector-icons/Feather";
import moment from "moment";
import Loading from "../components/Loading";

export default function SyncScreen(props) {
  const {
    route: { params },
  } = props;
  const { bodyKey, header } = params.params;
  const { auth } = useAuth();
  const netInfo = useNetInfo();

  let [customerSyncTime, setCustomerSyncTime] = useState(new Date().toString());

  const [data, setData] = useState({ customers: [], loans: [] });
  const [isLoading, setIsLoading] = useState(false);

  // const downloadData = async () => {
  //   console.log("hi");
  //   try {
  //     //console.log(auth);
  //     let user = await getUserBufferdData(
  //       auth?.employee_id,
  //       netInfo.isConnected
  //     );
  //     if (!user) {
  //       console.log("Error, unable to retrieve data from server");
  //     } else {
  //       let date = await lastSyncTimes("user");
  //       //setCustomerSyncTime(moment(date).fromNow());
  //       setData(user);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   (async () => {
  //     console.log("IS CONNECTED", netInfo.isConnected);
  //     netInfo.isConnected && (await downloadData());
  //   })();
  // }, [netInfo]);

  return (
    <View>
      {isLoading && <Loading text="Sincronizando. Porfaor espere..." />}

      {!netInfo.isConnected ? (
        <View
          style={{
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Father name="wifi-off" size={80} color={"darkred"} />
          <Text
            style={{
              color: "grey",
            }}
          >
            No tienes conexión a Internet
          </Text>
        </View>
      ) : (
        <View>
          {/* <View>
            <Text>
              {bodyKey == "download"
                ? "Descargue los datos actualizados desde el servidor."
                : "Suba los cobros realizados al servidor."}
            </Text>
            <Button
              title="Sincronizar Usuarios"
              onPress={async () => {
                if (bodyKey == "download") {
                  
                  await downloadData();
                } else {
                  await uploadData();
                }
              }}
            />
          </View> */}
          <ScrollView>
            <View style={styles.tableContainer}>
              <Text style={styles.sectionTitle}>Clientes</Text>
              <TouchableWithoutFeedback>
                <Text
                  style={styles.actionBtn}
                  onPress={async () => {
                    try {
                      setIsLoading(true);
                      await getUserBufferdData(
                        auth?.employee_id,
                        netInfo.isConnected,
                        auth?.user_id
                      );
                      setIsLoading(false);
                    } catch (error) {
                      console.log(error);
                      setIsLoading(false);
                    }
                  }}
                >
                  Sincronizar Usuarios
                </Text>
              </TouchableWithoutFeedback>
            </View>

            <View style={styles.tableContainer}>
              <Text style={styles.sectionTitle}>Prestamos</Text>
              <TouchableWithoutFeedback>
                <Text
                  style={styles.actionBtn}
                  onPress={async () => {
                    try {
                      setIsLoading(true);
                      let res = await syncLoans(
                        auth?.employee_id,
                        auth?.user_id
                      );
                      console.log("HAHAHAH", res);
                      setIsLoading(false);
                    } catch (error) {
                      console.log(error);
                      setIsLoading(false);
                    }
                  }}
                >
                  Sincronizar Préstamos
                </Text>
              </TouchableWithoutFeedback>
            </View>
            {/* <View style={styles.tableContainer}>
              <Text style={styles.sectionTitle}>Amortización</Text>
              <TouchableWithoutFeedback>
                <Text
                  style={styles.actionBtn}
                  onPress={async () => {
                    try {
                      setIsLoading(true);
                      let res = await syncAmortization(auth?.user_id);
                      console.log("HAHAHAH", res);
                      setIsLoading(false);
                    } catch (error) {
                      console.log(error);
                      setIsLoading(false);
                    }
                  }}
                >
                  Sincronizar Amortización
                </Text>
              </TouchableWithoutFeedback>
            </View> */}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// export default function SyncScreen(props) {
//   const netInfo = useNetInfo();

//   return (
//     <View>
//       <Text>Type: {netInfo.type}</Text>
//       <Text>Is Connected? {netInfo.isConnected.toString()}</Text>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  sectionTitle: {
    paddingBottom: 10,
    paddingHorizontal: 10,
    color: "grey",
  },

  tableContainer: {
    paddingTop: 20,
    maxHeight: 400,
  },

  actionBtn: {
    marginHorizontal: 10,
    elevation: 4,
    borderRadius: 5,
    backgroundColor: "#4682b4",
    padding: 10,
    color: "white",
  },
});
