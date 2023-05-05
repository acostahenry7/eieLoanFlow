import {
  getSavedConnectionUrlApi,
  saveConnectionUrlApi,
} from "../server/connection";
import { API_HOST } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BcryptReactNative from "bcrypt-react-native";

export async function loginApi(username, password, deviceInfo, netStatus) {
  const data = {
    username,
    password,
    deviceInfo,
    version: "1.7",
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const { connectionTarget, connectionStatus } = await API_HOST();

    console.log(connectionTarget);
    let result;

    console.log("netStatus", netStatus);
    if (netStatus == false) {
      let res = await AsyncStorage.getItem("users");
      console.log("LENGTH", JSON.parse(res || "{}").length, res);
      if (res) {
        let users = await JSON.parse(res);
        console.log(users);
        let currentUser = users.filter((user) => user.login == username);

        if (currentUser.length > 0) {
          let isPassCorrect = await BcryptReactNative.compareSync(
            password,
            currentUser[0].password_hash
          );
          if (isPassCorrect) {
            console.log(isPassCorrect);

            result = currentUser[0];
          } else {
            result = { error: "Usuario o contraseña incorrectos" };
          }
        } else {
          result = {
            error: "Su usuario no existe en la BD Local. Conéctese a internet.",
          };
        }
      } else {
        result = { error: "Su usuario no existe en la BD Local." };
      }
    } else {
      const url = `${connectionTarget}/login`;
      const response = await fetch(url, options);
      result = await response.json();
      console.log("RESULT FROM NETWORK", result);

      if (result.successfullLogin == true) {
        let usersRes = await AsyncStorage.getItem("users");
        console.log("LOCAL LOGIN INFORMATION", usersRes);
        if (usersRes) {
          let users = await JSON.parse(usersRes);
          let currentUserIndex = users
            .map((i) => i.user_id)
            .indexOf(result.userData.user_id);

          if (currentUserIndex != -1) {
            users[currentUserIndex] = result.userData;
            await AsyncStorage.setItem("users", JSON.stringify(users));
          } else {
            users.push(result.userData);
            await AsyncStorage.setItem("users", JSON.stringify(users));
          }
        } else {
          await AsyncStorage.setItem(
            "users",
            JSON.stringify([result.userData])
          );
        }
      }
    }

    return result;
  } catch (error) {
    console.log(error);
    const errorKeyWords = error.toString().slice(11, 33).split(" ");
    var response = {};
    console.log(errorKeyWords);
    errorKeyWords.map((keyWord) => {
      console.log(keyWord.toLowerCase());
      if (keyWord.toLowerCase() == "network") {
        response.error =
          "Error al intentar conectar con el servidor Revise su conexión a internet o verifique la url de conexión.";
        response.errorCode = 1;
      }
    });
    console.log(response);
    return response;
  }
}
