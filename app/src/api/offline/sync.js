import { API_HOST } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

//This function retreives the data required and stores it offline.
export async function pullDataApi(employeeId) {
  try {
    let response = await fetch(`${await API_HOST}/sync/${employeeId}`);

    let result = await response.json();
    console.log(result);

    return result;
  } catch (error) {
    throw error;
  }
}

export async function getBufferdData(employeeId) {
  try {
    let cloudData = await pullDataApi(employeeId);

    await AsyncStorage.setItem("customers", JSON.stringify(cloudData));

    let response = await AsyncStorage.getItem("customers");
    let items = await JSON.parse(response);
    let results = {
      customers: [],
    };

    console.log("ITEMS", items);

    items.customers.map((item) => {
      results.customers.push(item);
    });

    return results;
  } catch (error) {
    throw error;
  }
}
