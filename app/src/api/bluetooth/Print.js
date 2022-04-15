import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer";
import RNZebraBluetoothPrinter from "react-native-zebra-bluetooth-printer";
import { Alert } from "react-native";
import { getSavedPrintersApi } from "./Printers";

// Bluetooth Printing API
export async function printByBluetooth(object) {
  let printedStatus = false;

  const blueToothEnabled = await BluetoothManager.isBluetoothEnabled();

  if (blueToothEnabled) {
    const response = await generateReceipt(object);
    console.log(response);
    printedStatus = response;
  } else {
    await BluetoothManager.enableBluetooth();

    const response = await generateReceipt(object);
    console.log(response);
    printedStatus = response;
  }

  return printedStatus;
}

//This function generate the Receipt
async function generateReceipt(object) {
  console.log(object.amortization);

  const response = await getSavedPrintersApi();
  const printerSerial = response[0].address;

  let printedStatus = false;
  let labelLength = object.amortization.length * 40 + 740;

  console.log(labelLength);

  let date = (() => {
    //Date
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const fullDate = `${date}/${month}/${year}`;
    return fullDate.toString();
  })();

  let receiptHeader =
    "^FO40,655,^ADN,26,12^FDCuota  Fecha Cuota  Monto   Mora  Pagado^FS";
  let receiptDetail = [];
  let bodyItem = [];
  let receiptBody = [];

  let quotasQuantity = object.amortization.length;
  console.log("Cantidad de Cuotas", quotasQuantity);

  let width = 40;
  let top = 680;
  var noteHeight;

  object.amortization.map((entry, index) => {
    noteHeight = 0;
    receiptDetail.push(
      `^FO${width},${top},^ADN,26,12^FD${entry.quota_number}     ${date}    ${
        Math.trunc(entry.amount) + ".00"
      }  ${entry.mora}  ${Math.trunc(entry.totalPaid) + ".00"}^FS`
    );
    top += 20;

    if (index + 1 == quotasQuantity) {
      console.log("from valitadion quantity");
      noteHeight = top + 40;
      console.log(noteHeight);
    }
  });

  receiptDetail = receiptDetail.join();

  // let zpl = `^XA
  //             ^LL${labelLength}
  //             ^FO35,60^IME:BANNER.GRF^FS
  //             ${zTitle(object.outlet, 230, 250)}
  //             ${zTitle(object.rnc, 230, 275)};
  //             ${zSection("Recibo", 245, 320)}
  //             ${zTitle("Numero Recibo",40, 375)}
  //             ${zTitle(object.receiptNumber, 40,400, 25, 30)}
  //             ${zTitle("Fecha: ",300, 375 )}
  //             ${zTitle(object.date, 300,400)}
  //             ${zTitle("Zona: ",40, 460)}
  //             ${zTitle("Villa Mella", 40,485)}
  //             ${zTitle("No. Prestamo: ",300, 460 )}
  //             ${zTitle(object.loanNumber, 300,485)}
  //             ${zTitle("Nombre Cliente: ",40, 545)}
  //             ${zTitle(object.firstName + " " + object.lastName, 40,570)}
  //             ${zSection("Transacciones", 200, 620)}
  //             ${receiptHeader}
  //             ${receiptDetail}
  //             ${zTitle("Nota: No somos responsables de dinero entregado sin recibo", 40,noteHeight,18, 20)}
  //             ^XZ`

  //   let zpl = `! 0 200 200 210 1\r\n
  //   TEXT 4 0 30 40 Hello World\r\n
  //   FORM\r\n
  //   PRINT\r\n`;

  let zpl = "hola";
  // console.log(object);
  // console.log(zpl)

  //const connected = await RNZebraBluetoothPrinter.connectDevice(printerSerial)

  //if (connected ) {
  var result;
  try {
    result = await RNZebraBluetoothPrinter.print(printerSerial, zpl);

    //result = await RNZebraBluetoothPrinter.print(printerSerial, zpl);
  } catch (error) {
    console.log(error);
  }

  //}

  // if (connected) {
  //     await RNZebraBluetoothPrinter.print(printerSerial, zpl)
  // }
  // RNZebraBluetoothPrinter.print(printerSerial,zpl).then((res) => {
  //     console.log(res);
  // }).catch(err => {
  //     console.log("Error is", err);
  // })

  //     await RNZebraBluetoothPrinter.connectDevice(printerSerial)
  //   .then(async res => await RNZebraBluetoothPrinter.print(printerSerial, zpl))
  //   .catch(err => console.log(`Problems while connecting to printer: ${err}`))

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
        item.name +
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
