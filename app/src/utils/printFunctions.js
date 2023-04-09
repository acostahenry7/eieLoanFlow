import { getTotalDiscount, significantFigure } from "./math";

//Section divisor
export function zSection(title, x, y, p) {
  x = x?.toString();
  y = y?.toString();
  p = p?.toString() || "0";

  return `
      ^FO${p},${y - 5}^GB570,25,2^FS
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
    console.log(
      "$$$$$$$$$$$",
      parseFloat(item.totalPaid),
      parseFloat(item.totalPaidMora)
    );
    receiptAmortization.push({
      quota_number: item.quotaNumber,
      //date: item.date.split("T")[0].split("-").reverse().join("/"),
      fixedAmount: significantFigure(item.amount),
      mora: significantFigure(item.fixedMora),
      totalPaid: significantFigure(
        parseFloat(item.totalPaid) + parseFloat(item.totalPaidMora)
      ),
    });
  });

  // const response = await getSavedPrintersApi();
  // const printerSerial = response[0].address;

  let printedStatus = false;
  let labelLength = object.amortization.length * 1 + 1120;

  ////console.log(labelLength);

  let date = (() => {
    //Date
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const fullDate = `${date}/${month}/${year}`;
    return fullDate.toString();
  })();

  let receiptHeader = "^FO0,725,^ADN,26,12^FD# Cuotas^FS";
  let receiptDetail = [];
  let bodyItem = [];
  let receiptBody = [];

  let quotasQuantity = object.amortization.length;
  ////console.log("Cantidad de Cuotas", quotasQuantity);

  let width = 0;
  let top = 750;
  var left = width;
  let c = 0;

  receiptAmortization.map((entry, index) => {
    if (index == quotasQuantity - 1) {
      receiptDetail.push(
        `^FO${left},${top},^ADN,26,12^FD${entry.quota_number} ^FS`
      );
    } else {
      receiptDetail.push(
        `^FO${left},${top},^ADN,26,12^FD${entry.quota_number}, ^FS`
      );
    }

    left += 40;
    c++;
    if (c == 12) {
      top += 25;
      left = 0;
      c = 0;
    }

    if (index + 1 == quotasQuantity) {
      //console.log("from valitadion quantity");
      top += 70;
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
              ${zTitle(object.section?.split("-")[0], 260, 570) || ""}
              ${zTitle(object.section?.split("-")[1], 254, 600) || ""}
              ${zTitle("Cajero: ", 0, 630)}
              ${zTitle(object.login, 0, 655)}
              ${zSection("Transacciones", 200, 690)}
              ${receiptHeader}
              ${receiptDetail}
              ${zTitle("Total Mora:", 200, top + 30)}
              ${zTitle(
                "RD$ " + significantFigure(object.totalMora?.toFixed(2)),
                365,
                top + 30
              )}

              ${zTitle("Total:", 200, top + 60)}
              ${zTitle(
                "RD$ " + significantFigure(object.total?.toFixed(2)),
                365,
                top + 60
              )}
              ${zTitle("Monto Recibido:", 200, top + 90)}
              ${zTitle(
                "RD$ " + significantFigure(object.receivedAmount?.toFixed(2)),
                365,
                top + 90
              )}
              ${zTitle("Total Pagado  :", 200, top + 120)}
              ${zTitle(
                "RD$ " + significantFigure(object.totalPaid?.toFixed(2)),
                365,
                top + 120
              )}

              ${zTitle("Cambio:", 200, top + 150)}
              ${zTitle(
                "RD$ " + significantFigure(object.cashBack),
                365,
                top + 150
              )}
              ${zTitle(
                "Nota: No somos responsables de dinero entregado sin recibo",
                30,
                top + 240,
                18,
                20
              )}
              ^XZ`;

  return zpl;
}

export function genereateZPLChargesTemplate(object) {
  console.log("IS HERE IN GENERATE ZPL CHARGE");
  let labelLength = 800;

  let width = 0;
  let top = 750;

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
              ${zTitle("Cajero: ", 0, 630)}
              ${zTitle(object.login, 0, 655)}
              ${zSection("Gastos", 245, 690)}
              ${zTitle("Descripcion", 0, 720)}
              ${zText(object.description, 0, 750)}
              ${zTitle("Monto", 350, 720)}
              ${zText(object.amount, 350, 750)}
              ${zTitle(
                "Nota: No somos responsables de dinero entregado sin recibo",
                30,
                top + 240,
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
    sum += parseFloat(item.quota_amount);
  });

  sum = Math.round((sum + Number.EPSILON) * 100) / 100;
  return sum.toFixed(2);
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

  // console.log("######################################", sum);
  return sum.toFixed(2);
}
