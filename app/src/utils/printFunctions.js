import { getTotalDiscount } from "./math";

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
  console.log("FROM GENERATE ZPP", object);

  let receiptAmortization = [];

  object.amortization.map((item) => {
    receiptAmortization.push({
      quota_number: item.quota_number,
      date: item.date,
      fixedAmount: item.fixedAmount,
      mora: item.mora,
      totalPaid: item.totalPaid,
    });
  });

  // const response = await getSavedPrintersApi();
  // const printerSerial = response[0].address;

  let printedStatus = false;
  let labelLength = object.amortization.length * 90 + 1200;

  //console.log(labelLength);

  let date = (() => {
    //Date
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const fullDate = `${date}/${month}/${year}`;
    return fullDate.toString();
  })();

  let receiptHeader =
    "^FO40,725,^ADN,26,12^FDNo.Cuota  Fecha Cuota  Monto   Mora   Pagado^FS";
  let receiptDetail = [];
  let bodyItem = [];
  let receiptBody = [];

  let quotasQuantity = object.amortization.length;
  //console.log("Cantidad de Cuotas", quotasQuantity);

  let width = 40;
  let top = 750;
  var noteHeight;
  var c = 1;
  var x = 40;
  let suffix;
  receiptAmortization.map((entry, index) => {
    noteHeight = 0;
    // receiptDetail.push(
    //   `^FO${width},${top},^ADN,26,12^FD${entry.quota_number}     ${date}    ${
    //     Math.trunc(entry.amount) + ".00"
    //   }  ${entry.mora}  ${Math.trunc(entry.totalPaid) + ".00"}^FS`
    // );

    for (const [key, value] of Object.entries(entry)) {
      // key.toString() == "amount" ||
      // key.toString() == "mora" ||
      //key.toString() == "totalPaid" ? (suffix = ".00") : (suffix = "");

      if (c == 4 || c == 5) x = x - 20;
      receiptDetail.push(`^FO${x},${top},^ADN,26,12^FD${value}^FS`);

      x += parseFloat(value.toString().length) * 7 + 80;

      console.log("CURRENT LENGTH", value.toString().length);
      if (c == Object.keys(entry).length) {
        console.log("IM AM TESTING NOW", index);
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

        console.log("HEY DONE ALREADY");
        top += 10;
        x = 40;
        c = 0;
      }

      c++;
    }

    top += 70;

    if (index + 1 == quotasQuantity) {
      console.log("from valitadion quantity");
      noteHeight = top + 40;
      console.log(noteHeight);
    }
  });

  receiptDetail = receiptDetail.join();

  let zpl = `^XA
              ^LL${labelLength}
              ^FO35,60^IME:BANNER.PCX^FS
              ${zTitle(object.outlet, 230, 250)}
              ${zTitle(object.rnc, 230, 275)};
              ${zSection("Recibo", 245, 320)}
              ${zTitle("Numero Recibo", 40, 375)}
              ${zTitle(object.receiptNumber, 40, 400, 25, 30)}
              ${zTitle("Fecha de Pago: ", 260, 375)}
              ${zTitle(object.date, 260, 400)}
              ${zTitle("Prestamo: ", 40, 460)}
              ${zTitle(object.loanNumber, 40, 485)}
              ${zTitle("Cliente: ", 260, 460)}
              ${zTitle(object.firstName + " " + object.lastName, 260, 485)}
              ${zTitle("Tipo de Pago: ", 40, 545)}
              ${zTitle(object.paymentMethod, 40, 570)}
              ${zTitle("Zona: ", 260, 545)}
              ${zTitle(object.section, 260, 570)}
              ${zTitle("Cajero: ", 40, 630)}
              ${zTitle(object.login, 40, 655)}
              ${zSection("Transacciones", 200, 690)}
              ${receiptHeader}
              ${receiptDetail}
              ${zTitle("Total Mora:", 200, top + 30)}
              ${zTitle(
                "RD$ " + getTotalMora(object.amortization) + ".00",
                365,
                top + 30
              )}
              ${zTitle("SubTotal:", 200, top + 60)}
              ${zTitle(
                "RD$ " + getSubTotal(object.amortization) + ".00",
                365,
                top + 60
              )}
              ${zTitle("Descuento:", 200, top + 90)}
              ${zTitle(
                "RD$ " + getTotalDiscount(object.amortization) + ".00",
                365,
                top + 90
              )}
              ${zTitle("Total:", 200, top + 120)}
              ${zTitle(
                "RD$ " + getTotal(object.amortization) + ".00",
                365,
                top + 120
              )}
              ${zTitle("Monto Recibido:", 200, top + 150)}
              ${zTitle(
                "RD$ " + getReceivedAmount(object.amortization) + ".00",
                365,
                top + 150
              )}
              ${zTitle("Total Pagado  :", 200, top + 180)}
              ${zTitle(
                "RD$ " + totalPaid(object.amortization) + ".00",
                365,
                top + 180
              )}
              ${zTitle("Saldo Pendiente:", 200, top + 210)}
              ${zTitle("RD$ " + object.pendingAmount + ".00", 365, top + 210)}
              ${zTitle("Cambio:", 200, top + 240)}
              ${zTitle("RD$ " + object.cashBack + ".00", 365, top + 240)}
              ${zTitle(
                "Nota: No somos responsables de dinero entregado sin recibo",
                40,
                top + 300,
                18,
                20
              )}
              ${zTitle("-----COPIA DE RECIBO-----", 100, top + 350, 25, 30)}
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
    console.log(item);
    sum += parseFloat(item.fixedAmount) + parseInt(item.mora);
  });

  console.log(sum);
  return sum.toString();
};

const getTotal = (arr) => {
  var sum = 0;

  arr.map((item) => {
    console.log(item);
    sum +=
      parseFloat(item.fixedAmount) +
      parseInt(item.mora) -
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

function getTotalMora(arr) {
  var sum = 0;

  arr.map((item) => {
    sum += parseInt(item.mora);
  });

  return sum.toString();
}
