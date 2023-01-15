import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer";
import RNZebraBluetoothPrinter from "react-native-zebra-bluetooth-printer";
import { Alert } from "react-native";
import { getSavedPrintersApi } from "./Printers";
import { getTotalDiscount } from "../../utils/math";
import { extractIconText } from "../../utils/stringFuctions";
import { genereateZPLTemplate } from "../../utils/printFunctions";

// Bluetooth Printing API
export async function printByBluetooth(object, origin) {
  let printedStatus = false;

  const blueToothEnabled = await BluetoothManager.isBluetoothEnabled();

  if (blueToothEnabled) {
    const response = await generateReceipt(object, origin);
    console.log(response);
    printedStatus = response;
  } else {
    await BluetoothManager.enableBluetooth();

    const response = await generateReceipt(object, origin);
    console.log(response);
    printedStatus = response;
  }

  return printedStatus;
}

//This function generate the Receipt
async function generateReceipt(object, origin) {
  let zpl = "";
  let printedStatus = false;
  const response = await getSavedPrintersApi();
  if (response == null) {
    console.log("error");
    return {
      resType: "error",
      message:
        "No se encontró ninguna impresora configurada. Dirígase a Ajustes > Dispositivos > Añadir Impresora",
    };
  }
  const printerSerial = response[0].address;

  console.log("ASAAAAAAAAAAAAAAAAAAAAAAAA", origin);
  if (origin == "payment") {
    zpl = genereateZPLTemplate(object);
  } else {
    zpl = object.appZPL;
  }

  //   let zpl = `! 0 200 200 210 1\r\n
  //   TEXT 4 0 30 40 Hello World\r\n
  //   FORM\r\n
  //   PRINT\r\n`;

  var result;
  try {
    result = await RNZebraBluetoothPrinter.print(printerSerial, zpl);
    result = true;
  } catch (error) {
    return {
      resType: "error",
      message:
        "No se pudo conectar a la impresora, verifique que permanece encendida y vinculada a su dispositivo.",
    };
  }

  printedStatus = result;

  return printedStatus;
}

export async function customPrintData(data) {
  const response = await getSavedPrintersApi();
  const printerSerial = response[0].address;
  let labelLength = 400;

  let zpl = `^XA
   ^LL${labelLength}
   ^FO35,60^IME:BANNER.GRF^FS
    ${zSection("Lista Geneal de Cobros", 140, 250, 0)}
    ${buildHeader(data.header, 0, 275)}
    ${buildBody(data.data, 0, 300)}
   ^XZ`;

  console.log(zpl);

  var result;
  try {
    result = await RNZebraBluetoothPrinter.print(printerSerial, zpl);
  } catch (error) {
    console.log(error);
  }

  return result;
}

function buildHeader(arr, x, y) {
  var header = "";

  arr.map((item) => {
    header += zText(item, x, y);
    x += 120;
  });

  return header;
}

function buildBody(arr, x, y) {
  var body = "";

  arr.map((item, index) => {
    body += `${zText(
      item.loan_number_id +
        " " +
        extractSimplifiedName(item.name) +
        " " +
        item.receipt_number +
        " " +
        item.date +
        " " +
        item.pay,
      x,
      y
    )}`;
    y += 20;
  });

  return body;
}

//Section divisor
function zSection(title, x, y, p) {
  x = x?.toString();
  y = y?.toString();
  p = p?.toString() || "35";

  return `
    ^FO${p},${y - 5}^GB500,25,2^FS
    ^FO${x},${y},^ADN,26,11^FD${title}^FS
    `;
}

function zTitle(text, x, y, h, w) {
  x = x?.toString();
  y = y?.toString();
  w = w?.toString() || "22";
  h = h?.toString() || "25";

  return `^FO${x},${y},^A0N,${h},${w}^FD${text}^FS`;
}

//Text
function zText(text, x, y) {
  x = x.toString();
  y = y.toString();

  return `^FO${x},${y},^ADN,26,12^FD${text}^FS`;
}

const getSubTotal = (arr) => {
  var sum = 0;

  arr.map((item) => {
    console.log(item);
    sum += parseFloat(item.amount) + parseFloat(item.fixedMora);
  });

  console.log(sum);
  return sum.toFixed(2);
};

const getTotal = (arr) => {
  var sum = 0;

  arr.map((item) => {
    console.log(item);
    sum +=
      parseFloat(item.amount) +
      parseInt(item.fixedMora) -
      parseFloat(item.discountMora) -
      parseFloat(item.discountInterest);
  });

  console.log(sum);
  return sum.toString();
};

const totalPaid = (arr) => {
  let result = 0;
  let i = 0;

  for (i of arr) {
    result += parseFloat(i.totalPaid);
  }

  return result;
};

const getReceivedAmount = (arr) => {
  var sum = 0;

  arr.map((item) => {
    console.log(item);
    sum += parseFloat(item.totalPaid);
    // parseFloat(item.totalPaid) +
    // parseInt(item.mora) -
    // parseFloat(item.discountMora) -
    // parseFloat(item.discountInterest);
  });

  console.log(sum);
  return sum.toString();
};

const getPendingAmount = (object) => {
  let total = parseInt(getTotal(object));
  let rAmount = parseInt(getReceivedAmount(object));

  let result = total - rAmount;

  return result;
};

function extractSimplifiedName(str) {
  const strArr = str.split(" " || "  ");

  if (strArr[strArr.length - 1] == "") {
    strArr.pop("");
  }

  var result = "";
  switch (strArr.length) {
    case 2:
      for (var i = 0; i < strArr.length; i++) {
        result += strArr[i] + " ";
      }
      break;
    case 3:
      for (var i = 0; i < strArr.length; i++) {
        if (i == 0 || i == 1) {
          result += strArr[i] + " ";
        }
      }
      break;
    case 4:
      for (var i = 0; i < strArr.length; i++) {
        if (i == 0 || i == 2) {
          result += strArr[i] + " ";
        }
      }
      break;
    default:
      result = strArr[0];
      break;
  }

  return result;
}

function getTotalMora(arr) {
  var sum = 0;

  arr.map((item) => {
    sum += parseFloat(item.fixedMora);
  });

  return sum.toFixed(2);
}
