import { API_HOST } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isObject } from "lodash";
import { syncTable } from "../../utils/db/index";

//This function retreives the data required and stores it offline.
export async function pullUserDataApi(employeeId, netStatus) {
  try {
    const { connectionTarget, connectionStatus } = await API_HOST();

    let result;
    console.log(netStatus, connectionTarget);
    if (netStatus == false) {
      result = new Error("Error! Revise su conexión a la red.");
    } else {
      let response = await fetch(`${connectionTarget}/sync/${employeeId}`);
      result = await response.json();
    }

    console.log("emp" + employeeId);

    console.log("%%%%%%%%%%%%%%%%", result);

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserBufferdData(employeeId, netStatus) {
  try {
    //

    let cloudData = await pullUserDataApi(employeeId, netStatus);

    let results = await syncTable("customers", cloudData);

    // if (!cloudData) {
    //   throw new Error("Error retrieving data from ther server");
    // }

    // console.log(cloudData);
    // let localCustomers = await AsyncStorage.getItem("customers");
    // let currentData = JSON.parse(localCustomers);

    // let newData = [];
    // // if (Array.isArray(currentData)) {
    // //   if (currentData.length > 0) {
    // //     cloudData?.customers?.map((item, i) => {
    // //       newData.push(item);
    // //     });
    // //     await AsyncStorage.setItem("customers", JSON.stringify(newData));
    // //   }
    // // } else {
    // await AsyncStorage.setItem(
    //   "customers",
    //   JSON.stringify([
    //     {
    //       employeeId,
    //       //customers: [],
    //       customers: [...cloudData?.customers],
    //     },
    //   ])
    // );
    // //}

    // let res = await AsyncStorage.getItem("customers");
    // let formatedRes = await JSON.parse(res);

    // let results = formatedRes.filter(
    //   (item) => item.employeeId == employeeId
    // )[0] || {
    //   employeeId,
    //   customers: [],
    // };

    // console.log("$$$$$$$$$$$$$$$$$$$$$", results);

    return results;
  } catch (error) {
    console.log(error);
  }
}

export async function syncLoans(employeeId, userId) {
  try {
    const { connectionTarget, connectionStatus } = await API_HOST();

    let res = await fetch(
      `${connectionTarget}/sync/amortization/${employeeId}`
    );
    let loanData = await res.json();
    console.log("FROM SYN LOANS", loanData);

    let loans = await syncTable("loans", loanData);
    let quotas = await syncTable("quotas", loanData);
    let globalDiscount = await syncTable("globalDiscount", loanData);

    // console.log(result);

    // await AsyncStorage.setItem("loans", JSON.stringify(result));

    // let syncSTatus = await AsyncStorage.getItem("loans");

    // let register = await fetch(`${connectionTarget}/register/${userId}`);
    // register = await register.json();

    // await AsyncStorage.setItem("register", JSON.stringify(register));

    // console.log(syncSTatus);

    // return syncSTatus;
  } catch (error) {
    console.log(error);
  }
}

// export async function syncAmortization(userId) {
//   try {
//     const { connectionTarget, connectionStatus } = await API_HOST();
//     //Get cashier status
//     let register = await fetch(
//       `${await getSavedConnectionUrlApi()}/register/${userId}`
//     );
//     register = await register.json();

//     await AsyncStorage.setItem("register", JSON.stringify(register));

//     let payments = await fetch(
//       `${await getSavedConnectionUrlApi()}/sync/payments`,
//       {
//         searchKey
//       }
//     );
//     payments = await payments.json();

//     await AsyncStorage.setItem("payments", JSON.stringify(payments))

//   } catch (error) {
//     throw error;
//   }
// }

export async function lastSyncTimes(entity, time) {
  let syncTimes = await JSON.parse(await AsyncStorage.getItem("times"));

  console.log("SYNC TIMES FROM LOCAL", syncTimes);

  if (isObject(syncTimes) && Object.values(syncTimes).length > 0) {
    if (time && entity) {
      syncTimes[entity] = { lastSyncTime: time };
      await AsyncStorage.setItem("times", JSON.stringify(syncTimes));
    } else {
      if (entity) {
        return {
          error: false,
          data: syncTimes[entity].lastSyncTime,
        };
      } else {
        return {
          error: true,
          data: "No time or entity provided",
        };
      }
    }
  } else {
    if (time && entity) {
      let times = {};

      times[entity] = {
        lastSyncTime: time,
      };
      await AsyncStorage.setItem("items", JSON.stringify(times));
      return {
        error: false,
        data: times[entity].lastSyncTime,
      };
    } else {
      if (entity) {
        let times = {};

        times[entity] = {
          lastSyncTime: new Date(),
        };
        await AsyncStorage.setItem("items", JSON.stringify(times));
        return {
          error: false,
          data: times[entity].lastSyncTime,
        };
      } else {
        return {
          error: false,
          data: "No time or entity provided",
        };
      }
    }
  }
}
