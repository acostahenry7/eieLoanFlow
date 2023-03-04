//Test NOTE

//Discount Functions
export function getTotalDiscount(object) {
  let result = 0;
  let discount = 0;
  object.map((item) => {
    discount +=
      parseFloat(item.discountInterest) + parseFloat(item.discountMora);
    result = discount;
  });
  //console.log("DISCOUNT", result);
  return result;
}

// import { todayDate } from "./dateTimeFunctions";

//Validates fields and throws an error
function requiredField(field) {
  throw new Error(`Se require completar el campo ${field}`);
}

//Validates function is receiving an object as a paramater
function requiredInfo() {
  console.warn("Object required");
}

//Returns a payment instance
export function setPaymentObject(
  {
    loanId = requiredField("loanId"),
    loanNumber = requiredField("loanNumber"),
    quotaNumber = requiredField("quotaNumber"),
    paymentMethod = "Efectivo",
    loanQuotas = [],
    liquidateLoan = false,
    globalDiscount = 0,
    ncf = "",
    amount = requiredField("Pagar"),
    payNextQuotas = false,
    totalMora = 0,
    commentary = "",
    createdBy = requiredField("createdBy"),
    lastModifiedBy = requiredField("lastModifiedBy"),
    employeeId = requiredField("employeeId"),
    outletId = requiredField("outletId"),
    customerId = requiredField("customerId"),
    customer,
    isACharge,
    chargeId,
    quotaAmount,
    registerId = requiredField("registerId"),
  } = requiredInfo()
) {
  let paidQuotas = [];
  let nQuotanumber;
  let change = [];
  let fAmount = amount;

  liquidateLoan == "si" ? (liquidateLoan = true) : (liquidateLoan = false);

  //Validación para abonar restante
  if (payNextQuotas == false) {
    //Si no se desea abonar el resto
    let quotas = getPaidQuotas(
      quotaNumber,
      amount,
      loanQuotas,
      payNextQuotas,
      liquidateLoan,
      globalDiscount
    );

    paidQuotas = quotas.paidQuotas;
    change = quotas.change;
  } else {
    //Se determina la cantidad de quotas a pagar segun el monto recibido
    nQuotanumber = ((amount, loanQuotas) => {
      let value = 0;

      loanQuotas.map((quota) => {
        if (amount >= quota.currentAmount) {
          value++;
        } else if (amount > 0) {
          value++;
        }
        amount = amount - quota.currentAmount;
      });

      return value;
    })(amount, loanQuotas);

    let quotas = getPaidQuotas(
      nQuotanumber,
      amount,
      loanQuotas,
      payNextQuotas,
      liquidateLoan,
      globalDiscount
    );

    paidQuotas = quotas.paidQuotas;
    change = quotas.change;
  }

  let paymentData = {
    payment: {
      loanId,
      loanNumber,
      quotaNumber,
      paymentType: getPaymentMethod(paymentMethod),
      liquidateLoan,
      ncf,
      receivedAmount: fAmount,
      amount: liquidateLoan == true ? amount + globalDiscount : amount,
      payNextQuotas,
      commentary,
      createdBy,
      lastModifiedBy,
      employeeId,
      outletId,
      customerId,
      customer,
      registerId,
      quotaAmount,
      pendingAmount:
        liquidateLoan == true
          ? parseFloat(
              (
                loanQuotas.reduce((a, quota) => a + quota.currentAmount, 0) -
                (amount - change) -
                globalDiscount
              ).toFixed(2)
            )
          : parseFloat(
              (
                loanQuotas.reduce((a, quota) => a + quota.currentAmount, 0) -
                (amount - change)
              ).toFixed(2)
            ),
      totalPaid: parseFloat(
        liquidateLoan == true
          ? amount + globalDiscount - change
          : amount - change
      ),
      totalMora: parseFloat(
        paidQuotas.reduce((acc, quota) => acc + parseFloat(quota.fixedMora), 0)
      ),
      change,
    },
    amortization: paidQuotas,
  };

  console.log(paymentData);

  return paymentData;
}

//Determines the paid Quotas by getting info from the form
function getPaidQuotas(
  quotaNumber,
  amount,
  loanQuotas,
  payNextQuotas,
  liquidateLoan,
  globalDiscount
) {
  let paidQuotas = [];
  let change = 0;

  if (liquidateLoan == true) {
    let sumQuotas = parseInt(
      loanQuotas.reduce((acc, quota) => acc + quota.currentAmount, 0)
    );
    console.log("TOTAL", sumQuotas);
    if (amount < sumQuotas && liquidateLoan == true) {
      throw new Error("El monto a pagar debe ser mayor a " + sumQuotas);
    }
    console.log(sumQuotas);
    quotaNumber = loanQuotas.length;
  }

  if (liquidateLoan == true) {
    amount = amount + globalDiscount;
  }

  if (amount == 0) {
    throw new Error("El monto a pagar debe ser superior a 0.");
  }

  //Realizando el pago según cantidad de cuotas
  for (let index = 0; index < quotaNumber; index++) {
    /*Validar si monto es suficiente para saldar quota,
      de lo contrario se abona*/
    //console.log(quotaNumber, index);

    if (amount >= loanQuotas[index].currentAmount) {
      //This is a test note
      //console.log("camount", loanQuotas[index].currentAmount, "amount", amount);
      parseFloat(loanQuotas[index].totalPaidMora);
      loanQuotas[index].totalPaid = parseFloat(
        loanQuotas[index].currentPaid +
          loanQuotas[index].amount -
          loanQuotas[index].discountMora -
          loanQuotas[index].discountInterest
      );
      // parseFloat(loanQuotas[index].totalPaidMora) -
      // parseFloat(loanQuotas[index].discountMora);
      loanQuotas[index].executeProcessMora = false;
      loanQuotas[index].statusType = "PAID";
      loanQuotas[index].isPaid = true;
      if (loanQuotas[index].mora != 0) {
        loanQuotas[index].totalPaidMora =
          parseFloat(loanQuotas[index].totalPaidMora) +
          parseFloat(loanQuotas[index].fixedMora);
        loanQuotas[index].mora = 0;
      }
      loanQuotas[index].payMoraOnly = false;

      paidQuotas.push(loanQuotas[index]);
      console.log("hi");
      amount = amount - loanQuotas[index].currentAmount;
    } else {
      if (index == 0) {
        console.log("amount", amount, "mora", loanQuotas[index].mora);
        if (amount <= loanQuotas[index].mora) {
          if (loanQuotas[index].mora != 0) {
            loanQuotas[index].mora = parseFloat(
              (loanQuotas[index].mora - amount).toFixed(2)
            );
            loanQuotas[index].totalPaidMora = amount;
            loanQuotas[index].payMoraOnly = true;
          } else {
            loanQuotas[index].totalPaid = parseFloat(amount.toFixed(2));
          }
        } else {
          if (loanQuotas[index].mora != 0) {
            console.log("brakepoint", loanQuotas[index].mora);
            loanQuotas[index].totalPaidMora = parseFloat(
              loanQuotas[index].mora
            );

            loanQuotas[index].totalPaid = parseFloat(
              (amount - loanQuotas[index].totalPaidMora).toFixed(2)
            );

            loanQuotas[index].mora = 0;
            loanQuotas[index].payMoraOnly = false;
          } else {
            loanQuotas[index].totalPaid = parseFloat(amount.toFixed(2));
          }
        }

        loanQuotas[index].statusType = "COMPOST";
        loanQuotas[index].isPaid = false;
        paidQuotas.push(loanQuotas[index]);
        amount = 0;
      } else {
        if (payNextQuotas == true) {
          if (amount <= loanQuotas[index].mora) {
            if (loanQuotas[index].mora != 0) {
              loanQuotas[index].mora = parseFloat(
                (loanQuotas[index].mora - amount).toFixed(2)
              );
              loanQuotas[index].totalPaidMora = parseFloat(amount.toFixed(2));
              loanQuotas[index].payMoraOnly = true;
            }
          } else {
            if (loanQuotas[index].mora != 0) {
              loanQuotas[index].totalPaidMora = loanQuotas[index].mora;

              loanQuotas[index].totalPaid = parseFloat(
                (amount - loanQuotas[index].mora).toFixed(2)
              );
              loanQuotas[index].payMoraOnly = false;
              loanQuotas[index].mora = 0;
            } else {
              loanQuotas[index].totalPaid = parseFloat(amount.toFixed(2));
            }
          }

          loanQuotas[index].statusType = "COMPOST";
          loanQuotas[index].isPaid = false;
          paidQuotas.push(loanQuotas[index]);
          amount = 0;
        } else {
          change = parseFloat(amount.toFixed(2));
          if (index == quotaNumber) {
            amount = 0;
          }
        }
      }
    }
  }

  if (amount > 0) {
    change = parseFloat(amount.toFixed(2));
  }

  return {
    paidQuotas,
    change,
  };
}

function getPaymentMethod(m) {
  let paymentMethod = "";

  switch (m) {
    case "Efectivo":
      paymentMethod = "CASH";
      break;
    case "Transferencia":
      paymentMethod = "TRANSFER";
      break;
    case "Cheque":
      paymentMethod = "CHECK";
      break;
    default:
      break;
  }

  return paymentMethod;
}

//--------------------------------- Math Fancy Functions----------------------------------------

export function significantFigure(num) {
  let decimal;

  if (num) {
    num = num.toString();

    if (num.split(".").length > 0) {
      console.log("HEY CAN BE SPLITED WHERE NUM = ", num);
      decimal = num.split(".")[1];
      console.log("HEY DECIMAL WHERE NUM = ", decimal);
      num = num.split(".")[0];
    }

    let styledNum = "";

    switch (num.length) {
      case 4:
        styledNum = separatorPlace(num, 1);
        break;
      case 5:
        styledNum = separatorPlace(num, 2);
        break;
      case 6:
        styledNum = separatorPlace(num, 3);
        break;
      case 7:
        styledNum = separatorPlace(num, 1, 4);
        break;
      case 8:
        styledNum = separatorPlace(num, 2, 5);
        break;
      case 9:
        styledNum = separatorPlace(num, 3, 6);
        break;
      default:
        styledNum = num;
        break;
    }

    console.log("FANCY FUNCTION", styledNum, typeof styledNum);

    if (decimal) {
      styledNum = styledNum + `.${decimal.toString()}`;
    } else {
      styledNum = styledNum + ".00";
    }

    console.log("FINAL STYLED NUM", styledNum);
    return styledNum;
  } else {
    if (num == 0) {
      return "0.00";
    } else {
      return 0;
    }
  }
}

function separatorPlace(num, fPos, sPos) {
  let result = "";

  if (num.length <= 6) {
    for (let i = 0; i < num.length; i++) {
      i == fPos ? (result += ",") : undefined;
      result += num.charAt(i);
    }
  } else {
    for (let i = 0; i < num.length; i++) {
      i == fPos ? (result += ",") : undefined;
      i == sPos ? (result += ",") : undefined;
      result += num.charAt(i);
    }
  }

  return result;
}
