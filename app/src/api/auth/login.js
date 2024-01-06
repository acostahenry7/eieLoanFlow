import {
  getSavedConnectionUrlApi,
  saveConnectionUrlApi,
} from "../server/connection";
import { API_HOST, appInfo } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BcryptReactNative from "bcrypt-react-native";

export async function loginApi(username, password, deviceInfo) {
  const data = {
    username,
    password,
    deviceInfo,
    version: appInfo.version,
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const { connectionTarget } = await API_HOST();

    console.log(connectionTarget);
    let result;

    const url = `${connectionTarget}/login`;
    const response = await fetch(url, options);
    result = await response.json();

    // if (result.successfullLogin == true) {
    //   let usersRes = await AsyncStorage.getItem("users");
    //   console.log("LOCAL LOGIN INFORMATION", usersRes);
    //   if (usersRes) {
    //     let users = await JSON.parse(usersRes);
    //     let currentUserIndex = users
    //       .map((i) => i.user_id)
    //       .indexOf(result.userData.user_id);

    //     if (currentUserIndex != -1) {
    //       users[currentUserIndex] = result.userData;
    //       await AsyncStorage.setItem("users", JSON.stringify(users));
    //     } else {
    //       users.push(result.userData);
    //       await AsyncStorage.setItem("users", JSON.stringify(users));
    //     }
    //   } else {
    //     await AsyncStorage.setItem("users", JSON.stringify([result.userData]));
    //   }
    // }

    return result;
  } catch (error) {
    console.log(error);
    // const errorKeyWords = error.toString().slice(11, 33).split(" ");
    // var response = {};
    // console.log(errorKeyWords);
    // errorKeyWords.map((keyWord) => {
    //   console.log(keyWord.toLowerCase());
    //   if (keyWord.toLowerCase() == "network") {
    //     response.error =
    //       "Error al intentar conectar con el servidor Revise su conexión a internet o verifique la url de conexión.";
    //     response.errorCode = 1;
    //   }
    // });
    // console.log(response);
    // return response;
  }
}
