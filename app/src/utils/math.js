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
  } = requiredInfo()
) {
  let paidQuotas = [];
  let nQuotanumber;
  let change = [];

  liquidateLoan == "si" ? (liquidateLoan = true) : (liquidateLoan = false);

  //Validación para abonar restante
  if (payNextQuotas == false) {
    //Si no se desea abonar el resto
    let quotas = getPaidQuotas(
      quotaNumber,
      amount,
      loanQuotas,
      payNextQuotas,
      liquidateLoan
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
      liquidateLoan
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
      amount,
      payNextQuotas,
      commentary,
      createdBy,
      lastModifiedBy,
      employeeId,
      outletId,
      customerId,
      customer,
      pendingAmount:
        loanQuotas.reduce((a, quota) => a + quota.currentAmount, 0) -
        (amount - change),
      totalPaid: amount - change,
      totalMora: parseFloat(
        paidQuotas.reduce((acc, quota) => acc + parseFloat(quota.mora), 0)
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
  liquidateLoan
) {
  let paidQuotas = [];
  let change = 0;

  if (liquidateLoan == true) {
    let sumQuotas = parseInt(
      loanQuotas.reduce((acc, quota) => acc + quota.currentAmount, 0)
    );
    console.log("TOTAL", sumQuotas);
    if (amount < sumQuotas) {
      throw new Error("El monto a pagar debe ser mayor a " + sumQuotas);
    }
    console.log(sumQuotas);
    quotaNumber = loanQuotas.length;
  }

  if (amount == 0) {
    throw new Error("El monto a pagar debe ser superior a 0.");
  }

  //Realizando el pago según cantidad de cuotas
  for (let index = 0; index < quotaNumber; index++) {
    /*Validar si monto es suficiente para saldar quota,
      de lo contrario se abona*/
    console.log(quotaNumber, index);

    if (amount >= loanQuotas[index].currentAmount) {
      loanQuotas[index].totalPaid = loanQuotas[index].currentAmount;
      loanQuotas[index].statusType = "PAID";
      loanQuotas[index].isPaid = true;
      paidQuotas.push(loanQuotas[index]);
      console.log("hi");
      amount = amount - loanQuotas[index].currentAmount;
    } else {
      if (index == 0) {
        loanQuotas[index].totalPaid = amount;
        loanQuotas[index].statusType = "COMPOST";
        loanQuotas[index].isPaid = false;
        paidQuotas.push(loanQuotas[index]);
        amount = 0;
      } else {
        if (payNextQuotas == true) {
          loanQuotas[index].totalPaid = amount;
          loanQuotas[index].statusType = "COMPOST";
          loanQuotas[index].isPaid = false;
          paidQuotas.push(loanQuotas[index]);
          amount = 0;
        } else {
          change = amount;
          if (index == quotaNumber) {
            amount = 0;
          }
        }
      }
    }
  }

  if (amount > 0) {
    change = amount;
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
  num = num.toString();

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
      break;
  }

  console.log(styledNum, typeof styledNum);
  return styledNum;
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
