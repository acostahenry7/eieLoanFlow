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
    console.log("$$$$$$$$$$$", item);
    receiptAmortization.push({
      statusType: item.statusType,
      quotaAmount: item.quota_amount,
      quota_number: item.quotaNumber,
      //date: item.date.split("T")[0].split("-").reverse().join("/"),
      fixedAmount: significantFigure(item.amount),
      mora: significantFigure(item.fixedMora),
      fixedTotalPaid: item.fixedTotalPaid,
      totalPaid: item.totalPaid,
    });
  });

  // const response = await getSavedPrintersApi();
  // const printerSerial = response[0].address;

  let printedStatus = false;
  let labelLength = object.amortization.length * 1 + 1200;

  ////console.log(labelLength);

  let date = (() => {
    //Date
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const fullDate = `${date}/${month}/${year}`;
    return fullDate.toString();
  })();

  let receiptHeader = "^FO0,725,^ADN,26,12^FDCuotas Pagadas^FS";
  let receiptHeader2 = "^FO0,850,^ADN,26,12^FDAbono a cuota^FS";
  let receiptDetail = [];
  let receiptDetail2 = [];
  let bodyItem = [];
  let receiptBody = [];

  let paidQuotasQuantity = receiptAmortization.filter(
    (i) => i.statusType == "PAID"
  ).length;
  let compostQuotasQuantity = receiptAmortization.filter(
    (i) => i.statusType == "COMPOST" || i.statusType == "DEFEATED"
  ).length;
  ////console.log("Cantidad de Cuotas", paidQuotasQuantity);

  let width = 0;
  let top = 750;
  var left = width;
  let c = 0;

  receiptAmortization
    .filter((i) => i.statusType == "PAID")
    .map((entry, index) => {
      if (index == paidQuotasQuantity - 1) {
        if (paidQuotasQuantity > 1) {
          receiptDetail.push(
            `^FO${left},${top},^ADN,26,12^FD y ${entry.quota_number} ^FS`
          );
        } else {
          receiptDetail.push(
            `^FO${left},${top},^ADN,26,12^FD${entry.quota_number}^FS`
          );
        }
      } else {
        receiptDetail.push(
          `^FO${left},${top},^ADN,26,12^FD${entry.quota_number},^FS`
        );
      }

      left += 40;
      c++;
      if (c == 9) {
        top += 25;
        left = 0;
        c = 0;
      }

      if (index + 1 == paidQuotasQuantity) {
        //console.log("from valitadion quantity");
        top += 70;
        //console.log(noteHeight);
      }
    });

  left = 0;
  c = 0;

  top = 750;
  top = top + 125;

  receiptAmortization
    .filter((i) => i.statusType == "COMPOST" || i.statusType == "DEFEATED")
    .map((entry, index) => {
      console.log("BUENO QUE RARO", entry, compostQuotasQuantity);
      if (index == compostQuotasQuantity - 1) {
        if (compostQuotasQuantity > 1) {
          receiptDetail2.push(
            `^FO${left},${top},^ADN,26,12^FD y ${entry.quota_number} ^FS`
          );
        } else {
          receiptDetail2.push(
            `^FO${left},${top},^ADN,26,12^FD${entry.quota_number}^FS`
          );
        }
      } else {
        receiptDetail2.push(
          `^FO${left},${top},^ADN,26,12^FD${entry.quota_number},^FS`
        );
      }

      left += 40;
      c++;
      if (c == 10) {
        top += 25;
        left = 0;
        c = 0;
      }

      if (index + 1 == compostQuotasQuantity) {
        //console.log("from valitadion quantity");
        top += 70;
        //console.log(noteHeight);
      }
    });

  top = top - 125;

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
              ${zTitle("Cantidad de cuotas: ", 260, 630)}
              ${zTitle(object.amountOfQuotas, 260, 655)}
              ${zSection("Transacciones", 200, 690)}
              ${
                object.liquidateLoan == false &&
                zTitle("Cuotas Pagadas", 0, 725)
              }
              ${object.liquidateLoan == false && zTitle("Monto", 390, 725)}
              ${object.liquidateLoan == false && receiptDetail}
              ${
                object.liquidateLoan == false &&
                zText(
                  "RD$ " +
                    significantFigure(
                      (() => {
                        let amount = receiptAmortization
                          .filter((i) => i.statusType == "PAID")
                          .reduce(
                            (acc, i) => acc + i.totalPaid - i.fixedTotalPaid,
                            0
                          );

                        return amount.toFixed(2);
                      })()
                    ),
                  390,
                  750
                )
              }
              ${
                object.liquidateLoan == false && zTitle("Abono a Cuota", 0, 850)
              }
              ${object.liquidateLoan == false && zTitle("Monto", 390, 850)}
              ${object.liquidateLoan == false && receiptDetail2}
              ${
                object.liquidateLoan == false &&
                zText(
                  "RD$ " +
                    significantFigure(
                      (() => {
                        let amount = receiptAmortization
                          .filter((i) => i.statusType == "COMPOST")
                          .reduce(
                            (acc, i) => acc + i.totalPaid - i.fixedTotalPaid,
                            0
                          );

                        return amount.toFixed(2);
                      })()
                    ),
                  390,
                  875
                )
              }
              ${
                object.liquidateLoan == true &&
                zTitle("-- Saldo de prestamo --", 200, 787)
              }
              ${zTitle("Mora Pagada:", 200, top + 160)}
              ${zTitle(
                "RD$ " + significantFigure(object.totalPaidMora?.toFixed(2)),
                365,
                top + 160
              )}
              ^LRY
              ^FO200,${top + 185}^CFG
            ^GB300,30,30^FS
              ${zTitle("Total Pagado  :", 200, top + 190)}
              ${zTitle(
                "RD$ " + significantFigure(object.totalPaid?.toFixed(2)),
                365,
                top + 190
              )}
              ^LRN
              ${zTitle("Monto Recibido:", 200, top + 220)}
              ${zTitle(
                "RD$ " + significantFigure(object.receivedAmount?.toFixed(2)),
                365,
                top + 220
              )}
              ^LRY
              ^FO200,${top + 245}^CFG
            ^GB300,30,30^FS
              ${zTitle("Devuelta:", 200, top + 250)}
              ${zTitle(
                "RD$ " + significantFigure(object.cashBack),
                365,
                top + 250
              )}
              ^LRN
              ${zTitle(
                "Nota: No somos responsables de dinero entregado sin recibo",
                30,
                top + 340,
                18,
                20
              )}
              ^XZ`;

  return zpl;
}

export function genereateZPLChargesTemplate(object) {
  console.log("IS HERE IN GENERATE ZPL CHARGE");
  let labelLength = 1020;

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
              ${zText("RD$ " + significantFigure(object.amount), 350, 750)}
              ${zText("Total Pagado:", 200, 830)}
              ${zText("RD$ " + significantFigure(object.amount), 405, 830)}
              ${zText("Monto Recibido:", 200, 860)}
              ${zText(
                "RD$ " + significantFigure(object.receivedAmount),
                405,
                860
              )}
              ${zText("Devuelta:", 200, 890)}
              ${zText(
                "RD$ " +
                  significantFigure(object.receivedAmount - object.amount),
                405,
                890
              )}
              ${zTitle(
                "Nota: No somos responsables de dinero entregado sin recibo",
                30,
                top + 240,
                18,
                20
              )}
              ^XZ`;

  console.log("MY", zpl);
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

// ${/*zTitle("Total:", 200, top + 60)*/}
//               ${/*zTitle(
//                 "RD$ " + significantFigure(object.total?.toFixed(2)),
//                 365,
//                 top + 60
//               )*/}
