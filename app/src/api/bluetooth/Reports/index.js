import RNZebraBluetoothPrinter from "react-native-zebra-bluetooth-printer";
import { getSavedPrintersApi } from "../Printers";
import { zText, zTitle, zSection } from "../../../utils/printFunctions";

export async function reportPrinting(data) {
  console.log(data);
  const response = await getSavedPrintersApi();
  const printerSerial = response[0].address;
  let labelLength = 400 + data.data.length * 200;

  let zpl = `^XA
     ^LL${labelLength}
     ^FO35,60^IME:BANNER.GRF^FS
      ${zSection(data.reportDescription, 140, 250, 0)}
      
      ${buildHeader(data, 40, 300)}
      ${buildBody(data, 160, 300)}
      
     ^XZ`;

  var result;
  try {
    result = await RNZebraBluetoothPrinter.print(printerSerial, zpl);
  } catch (error) {
    throw error;
  }

  return result;
}

// function generateInfo(arr) {
//   let header = "";
//   arr.map((item) => {
//     header += buildHeader(arr);
//   });

//   console.log(header);
//   return header;
// }

function buildHeader(obj, x, y) {
  let header = "";
  obj.data.map((item) => {
    obj.header.map((item) => {
      header += zTitle(item, x, y, 25, 20);
      y += 40;
    });

    y += 50;
  });

  return header.toString();
}

function buildBody(obj, x, y) {
  let body = "";

  obj.data.map((item) => {
    for (const [key, value] of Object.entries(item)) {
      body += zTitle(value, x, y);
      y += 40;
    }

    y += 50;
  });

  return body.toString();
}

//${buildBody(data.data, 0, 300)}
