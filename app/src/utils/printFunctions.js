import { getTotalDiscount, significantFigure } from "./math";

//Section divisor
export function zSection(title, x, y, p) {
  x = x?.toString();
  y = y?.toString();
  p = p?.toString() || "35";

  return `
      ^FO${p},${y - 5}^GB500,25,2^FS
      ^FO${x},${y},^ADN,26,11^FD${title}^FS
      `;
}

export function zTitle(text, x, y, h, w) {
  x = x?.toString();
  y = y?.toString();
  w = w?.toString() || "22";
  h = h?.toString() || "25";

  return `^FO${x},${y},^A0N,${h},${w}^FD${text}^FS`;
}

//Text

export function zText(text, x, y) {
  x = x.toString();
  y = y.toString();

  return `^FO${x},${y},^ADN,26,12^FD${text}^FS`;
}

//--------------------- Generate ZPL Receipt --------------------------------

export function genereateZPLTemplate(object) {
  //console.log("FROM GENERATE ZPP", object);

  let receiptAmortization = [];

  object.amortization.map((item) => {
    receiptAmortization.push({
      quota_number: item.quotaNumber,
      date: item.date.split("T")[0].split("-").reverse().join("/"),
      fixedAmount: significantFigure(item.amount),
      mora: significantFigure(item.mora),
      totalPaid: significantFigure(item.totalPaid + item.totalPaidMora),
    });
  });

  // const response = await getSavedPrintersApi();
  // const printerSerial = response[0].address;

  let printedStatus = false;
  let labelLength = object.amortization.length * 90 + 1200;

  ////console.log(labelLength);

  let date = (() => {
    //Date
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const fullDate = `${date}/${month}/${year}`;
    return fullDate.toString();
  })();

  let receiptHeader =
    "^FO0,725,^ADN,26,12^FDNo.Cuota  Fecha Cuota  Monto    Mora    Pagado^FS";
  let receiptDetail = [];
  let bodyItem = [];
  let receiptBody = [];

  let quotasQuantity = object.amortization.length;
  ////console.log("Cantidad de Cuotas", quotasQuantity);

  let width = 40;
  let top = 750;
  var noteHeight;
  var c = 1;
  var x = 0;
  let suffix;
  let sum = 0;
  receiptAmortization.map((entry, index) => {
    noteHeight = 0;

    // receiptDetail.push(
    //   `^FO${width},${top},^ADN,26,12^FD${entry.quota_number}     ${date}    ${
    //     Math.trunc(entry.amount)
    //   }  ${entry.mora}  ${Math.trunc(entry.totalPaid)  }^FS`
    // );

    for (const [key, value] of Object.entries(entry)) {
      console.log("RECEIPT DETAIL NO FIGURED", value);
      // key.toString() == "amount" ||
      // key.toString() == "mora" ||
      //key.toString() == "totalPaid" ? (suffix = ".00") : (suffix = "");

      if (c == 4 || c == 5) x = x - 20;
      receiptDetail.push(`^FO${x},${top},^ADN,26,12^FD${value}^FS`);

      switch (c) {
        case 1:
          sum = 100;
          break;
        case 2:
          sum = 90;
          break;
        case 3:
          sum = 85;
          break;
        case 4:
          sum = 75;
          break;

        default:
          sum = 70;
          break;
      }

      x += parseFloat(value.toString().length) * 7 + sum;

      //console.log("CURRENT LENGTH", value.toString().length);
      if (c == Object.keys(entry).length) {
        //console.log("IM AM TESTING NOW", index);
        receiptDetail.push(
          `^FO${60},${top + 25},^ADN,26,12^FDDesc. Mora: ${
            object.amortization[index].discountMora
          } ^FS`
        );

        receiptDetail.push(
          `^FO${300},${top + 25},^ADN,26,12^FDDesc. Interes: ${
            object.amortization[index].discountInterest
          }  ^FS`
        );

        //console.log("HEY DONE ALREADY");
        top += 10;
        x = 40;
        c = 0;
      }

      c++;
    }

    top += 70;

    if (index + 1 == quotasQuantity) {
      //console.log("from valitadion quantity");
      noteHeight = top + 40;
      //console.log(noteHeight);
    }
  });

  receiptDetail = receiptDetail.join();

  let zpl = `^XA
              ^LL${labelLength}
              ^FO35,60^IME:BANNER.PCX^FS
              ${zTitle(object.outlet, 230, 250)}
              ${zTitle(object.rnc, 230, 275)};
              ${zSection("Recibo", 245, 320)}
              ${zTitle("Numero Recibo", 0, 375)}
              ${zTitle(object.receiptNumber, 0, 400, 25, 30)}
              ${zTitle("Fecha de Pago: ", 260, 375)}
              ${zTitle(object.date, 260, 400)}
              ${zTitle("Prestamo: ", 0, 460)}
              ${zTitle(object.loanNumber, 0, 485)}
              ${zTitle("Cliente: ", 260, 460)}
              ${zTitle(object.firstName + " " + object.lastName, 260, 485)}
              ${zTitle("Tipo de Pago: ", 0, 545)}
              ${zTitle(object.paymentMethod, 0, 570)}
              ${zTitle("Zona: ", 260, 545)}
              ${zTitle(object.section.split("-")[0], 260, 570)}
              ${zTitle(object.section.split("-")[1], 254, 600)}
              ${zTitle("Cajero: ", 0, 630)}
              ${zTitle(object.login, 0, 655)}
              ${zSection("Transacciones", 200, 690)}
              ${receiptHeader}
              ${receiptDetail}
              ${zTitle("Total Mora:", 200, top + 30)}
              ${zTitle(
                "RD$ " + getTotalMora(object.amortization),
                365,
                top + 30
              )}
              ${zTitle("SubTotal:", 200, top + 60)}
              ${zTitle(
                "RD$ " + getSubTotal(object.amortization),
                365,
                top + 60
              )}
              ${zTitle("Descuento:", 200, top + 90)}
              ${zTitle(
                "RD$ " +
                  significantFigure(getTotalDiscount(object.amortization)),
                365,
                top + 90
              )}
              ${zTitle("Total:", 200, top + 120)}
              ${zTitle("RD$ " + getTotal(object.amortization), 365, top + 120)}
              ${zTitle("Monto Recibido:", 200, top + 150)}
              ${zTitle("RD$ " + object.receivedAmount, 365, top + 150)}
              ${zTitle("Total Pagado  :", 200, top + 180)}
              ${zTitle("RD$ " + object.totalPaid, 365, top + 180)}
              ${zTitle("Saldo Pendiente:", 200, top + 210)}
              ${zTitle("RD$ " + object.pendingAmount, 365, top + 210)}
              ${zTitle("Cambio:", 200, top + 240)}
              ${zTitle("RD$ " + object.cashBack, 365, top + 240)}
              ${zTitle(
                "Nota: No somos responsables de dinero entregado sin recibo",
                30,
                top + 350,
                18,
                20
              )}
              ^XZ`;

  return zpl;
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

const getSubTotal = (arr) => {
  var sum = 0;

  arr.map((item) => {
    //console.log(item);
    sum += parseFloat(item.amount) + parseFloat(item.fixedMora);
  });

  //console.log(sum);
  return sum.toFixed(2);
};

const getTotal = (arr) => {
  var sum = 0;

  arr.map((item) => {
    //console.log(item);
    sum +=
      parseFloat(item.amount) +
      parseInt(item.fixedMora) -
      parseFloat(item.discountMora) -
      parseFloat(item.discountInterest);
  });

  //console.log(sum);
  return sum.toString();
};

const totalPaid = (arr) => {
  let result = 0;
  let i = 0;

  for (i of arr) {
    result += parseInt(i.totalPaid);
  }

  return result;
};

const getReceivedAmount = (arr) => {
  var sum = 0;

  arr.map((item) => {
    //console.log(item);
    sum += parseFloat(item.totalPaid);
    // parseFloat(item.totalPaid) +
    // parseInt(item.mora) -
    // parseFloat(item.discountMora) -
    // parseFloat(item.discountInterest);
  });

  //console.log(sum);
  return sum.toString();
};

function getTotalMora(arr) {
  var sum = 0;

  arr.map((item) => {
    sum += parseFloat(item.fixedMora);
  });

  console.log("######################################", sum);
  return sum.toFixed(2);
}
