import { Dimensions } from "react-native";
import {
  getSavedConnectionUrlApi,
  saveConnectionUrlApi,
} from "../api/server/connection";
//export const  API_HOST = "http://186.6.7.194:26015"
//export const  API_HOST = "http://10.0.0.5:3000"
//export const  API_HOST = "http://10.0.0.99:3000"
//export const  API_HOST = "http://10.1.102.106:3000"
//export const  API_HOST = "http://172.16.0.16:3000"

export const API_HOST = (async () => {
  const response = await getSavedConnectionUrlApi();
  return response || "";
})();

export const PRINTER_STORAGE = "printers";

export const WINDOW_DIMENSION = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

export const SCREEN_DIMENSION = {
  width: Dimensions.get("screen").width,
  height: Dimensions.get("screen").height,
};

export const appInfo = {
  version: "1.21",
};
