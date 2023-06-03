import { getSavedConnectionUrlApi } from "./server/connection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_HOST } from "../utils/constants";
import { uniqBy } from "lodash";
import { dbConnect } from "../utils/db/index";
import {
  getUserBufferdData,
  lastSyncTimes,
  syncLoans,
  syncAmortization,
} from "../api/offline/sync";

//const employeeId = 'c2ed74d8-107c-4ef2-a5fb-6d6fadea5d1b'

export async function getCustomerApi(nextUrl, employeeId, netStatus) {
  try {
    const { connectionStatus, connectionTarget } = await API_HOST();
    let result;
    let loans = [];
    let customers = [];

    console.log("NET STATUS", netStatus);
    if (netStatus === false) {
      let db = await dbConnect();

      await db.transaction(async (t) => {
        await t.executeSql(
          `SELECT * FROM customers WHERE employee_id = '${employeeId}'`,
          [],
          (t, res) => {
            for (let i = 0; i < res.rows.length; i++) {
              console.log("CUSTOMER RAW", res.rows.item(i));
              customers.push(res.rows.item(i));
            }
          }
        );
      });

      await db.transaction(async (t) => {
        await t.executeSql(
          `SELECT * FROM loans WHERE employee_id = '${employeeId}'`,
          [],
          (t, res) => {
            for (let i = 0; i < res.rows.length; i++) {
              console.log("LOAN RAW", res.rows.item(i));
              loans.push(res.rows.item(i));
            }
          }
        );
      });

      if (customers.length > 0) {
        result = {
          employeeId: employeeId,
          customers: uniqBy(customers, "customer_id"),
          loans: loans,
        };
      } else {
        throw new Error(
          "No existen registros locales! Porfvor sincronize la data."
        );
      }
    } else {
      if (!employeeId) employeeId = "0";

      const url = `${connectionTarget}/customers/main/${employeeId}?limit=999999&offset=1`;

      const response = await fetch(nextUrl || url);

      result = await response.json();

      await getUserBufferdData(employeeId, netStatus);
      await syncLoans(employeeId);
    }

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
    let db = await dbConnect();
    if (netStatus == false) {
      await db.transaction(async (t) => {
        await t.executeSql(
          `SELECT * FROM customers WHERE customer_id = '${data.id}'`,
          [],
          (t, res) => {
            for (let i = 0; i < res.rows.length; i++) {
              result.customerInfo = res.rows.item(0);
            }
          }
        );
      });
      result.customerLoans = [];
      await db.transaction(async (t) => {
        await t.executeSql(
          `SELECT * FROM loans where customer_id = '${data.id}'`,
          [],
          (t, res) => {
            for (let i = 0; i < res.rows.length; i++) {
              result.customerLoans.push(res.rows.item(i));
            }
          }
        );
      });
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
