import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import DataTable, { COL_TYPES } from "react-native-datatable-component";
import { getBufferdData } from "../api/offline/sync";
import useAuth from "../hooks/useAuth";

export default function SyncScreen(props) {
  const {
    route: { params },
  } = props;
  const { bodyKey, header } = params.params;
  const { auth } = useAuth();

  const [data, setData] = useState({ customers: [], loans: [] });

  const downloadData = async () => {
    try {
      console.log(auth);
      let res = await getBufferdData(auth.employee_id);
      console.log("hey man", res, typeof res);
      setData(res);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    (async () => {
      await downloadData();
    })();
  }, []);

  return (
    <View>
      <View>
        <Text>
          {bodyKey == "download"
            ? "Descargue los datos actualizados desde el servidor."
            : "Suba los cobros realizados al servidor."}
        </Text>
        <Button
          title="Sincronizar"
          onPress={async () => {
            if (bodyKey == "download") {
              await downloadData();
            } else {
              await uploadData();
            }
          }}
        />
      </View>
      <ScrollView>
        <View style={styles.tableContainer}>
          <Text style={styles.sectionTitle}>Customers</Text>
          <DataTable
            data={data.customers || []}
            colNames={["first_name", "last_name"]}
            backgroundColor={"blue"}
            noOfPages={Math.floor(data.customers?.length / 5) || 1}
          />
        </View>
        <View style={styles.tableContainer}>
          <Text style={styles.sectionTitle}>Prestamos</Text>
          {/* <DataTable
            data={data.loans}
            colNames={["number", "name"]}
            backgroundColor={"blue"}
            noOfPages={Math.floor(data.loans?.length / 5) || 1}
          /> */}
        </View>
        {/* <View style={styles.tableContainer}>
          <Text style={styles.sectionTitle}>Prestamos</Text>
          <DataTable
            data={data}
            colNames={["name", "age"]}
            backgroundColor={"blue"}
            noOfPages={data..length / 5}
          />
        </View> */}
      </ScrollView>
    </View>
  );
}

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
});
