import { getSavedConnectionUrlApi } from "./server/connection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_HOST } from "../utils/constants";

//const employeeId = 'c2ed74d8-107c-4ef2-a5fb-6d6fadea5d1b'

export async function getCustomerApi(nextUrl, employeeId, netStatus) {
  try {
    const { connectionStatus, connectionTarget } = await API_HOST();
    let result;

    if (netStatus === false) {
      let res = await AsyncStorage.getItem("customers");

      if (res) {
        let formatedRes = await JSON.parse(res);
        result = formatedRes.filter(
          (item) => item.employeeId == employeeId
        )[0] || {
          employeeId,
          customers: [],
        };
      } else {
        throw new Error(
          "No existen registros locales! Porfvor sincronize la data."
        );
      }
    } else {
      console.log(employeeId);
      if (!employeeId) employeeId = "0";
      const url = `${connectionTarget}/customers/main/${employeeId}?limit=999999&offset=1`;
      console.log(connectionTarget);
      const response = await fetch(nextUrl || url);

      result = await response.json();
    }

    //console.log("****************************", connection);

    // if (connection == "payments") {
    //   const response = await AsyncStorage.getItem("customers");
    //   result = await JSON.parse(response);
    // } else {

    //}

    return result;
  } catch (error) {
    throw error;
  }
}

export async function getCustomerInfo(data, netStatus) {
  console.log("hi");
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let result = {};

  console.log("NETWORK STATUS FROM CUSTOMER INFO", netStatus);

  try {
    if (netStatus == false) {
      console.log("hi2");
      let res = await AsyncStorage.getItem("customers");
      let formatedRes = await JSON.parse(res);
      let customerList = formatedRes.filter(
        (item) => item.employeeId == data.employeeId
      )[0].customers || {
        employeeId: data.employeeId,
        customers: [],
      };

      result.customerInfo = customerList.filter(
        (customer) => customer.customer_id == data.id
      )[0];

      result.customerLoans = [];
    } else {
      const url = `${await getSavedConnectionUrlApi()}/customers/each`;
      const response = await fetch(url, options);
      result = await response.json();
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export async function createQRApi(id) {
  try {
    const url = `${await getSavedConnectionUrlApi()}/customers/createQR/${id}`;
    const response = await fetch(url);
    const result = response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getQrApi(id) {
  try {
    const url = `${await getSavedConnectionUrlApi()}/customers/getQr/${id}`;
    const response = await fetch(url);
    const result = response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

// export async function postPaymentApi(data){
//     try {
//         const url = `${getSavedConnectionUrlApi()}/payments`
//         return null
//     } catch (error) {
//         throw error
//     }
// }
