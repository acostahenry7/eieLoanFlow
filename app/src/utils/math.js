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
    let quotas = processPayment(
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

    let quotas = processPayment(
      nQuotanumber,
      amount,
      loanQuotas,
      payNextQuotas,
      liquidateLoan,
      globalDiscount
    );

    console.log("#################################################", quotas);

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
      // pendingAmount:
      //   liquidateLoan == true
      //     ? parseFloat(
      //         (
      //           loanQuotas.reduce((a, quota) => a + quota.currentAmount, 0) -
      //           (amount - change) -
      //           globalDiscount
      //         ).toFixed(2)
      //       )
      //     : parseFloat(
      //         (
      //           loanQuotas.reduce((a, quota) => a + quota.currentAmount, 0) -
      //           (amount - change)
      //         ).toFixed(2)
      //       ),
      pay: amount - change,
      totalPaid: paidQuotas.reduce((acc, quota) => acc + quota.totalPaid, 0),
      fixedTotalPaid: paidQuotas.reduce(
        (acc, quota) => acc + quota.fixedTotalPaid,
        0
      ),
      total:
        liquidateLoan == true
          ? paidQuotas.reduce(
              (acc, quota) => acc + parseFloat(quota.quota_amount),
              0
            ) - globalDiscount
          : paidQuotas.reduce(
              (acc, quota) => acc + parseFloat(quota.quota_amount),
              0
            ),
      totalMora: paidQuotas.reduce((acc, quota) => acc + quota.fixedMora, 0),
      fixedTotalPaidMora: paidQuotas.reduce(
        (acc, quota) => acc + quota.fixedTotalPaidMora,
        0
      ),
      totalPaidMora: paidQuotas.reduce(
        (acc, quota) => acc + quota.totalPaidMora,
        0
      ),
      change,
    },
    amortization: paidQuotas,
  };

  // console.log("DATAAAAA%%%%", paymentData);

  return paymentData;
}

//Determines the paid Quotas by getting info from the form
// function getPaidQuotas(
//   quotaNumber,
//   amount,
//   loanQuotas,
//   payNextQuotas,
//   liquidateLoan,
//   globalDiscount
// ) {
//   let paidQuotas = [];
//   let change = 0;

//   if (liquidateLoan == true) {
//     let sumQuotas = parseInt(
//       loanQuotas.reduce((acc, quota) => acc + quota.currentAmount, 0)
//     );
//     // console.log("TOTAL", sumQuotas);
//     if (amount < sumQuotas && liquidateLoan == true) {
//       throw new Error("El monto a pagar debe ser mayor a " + sumQuotas);
//     }
//     // console.log(sumQuotas);
//     quotaNumber = loanQuotas.length;
//   }

//   if (liquidateLoan == true) {
//     amount = amount + globalDiscount;
//   }

//   if (amount == 0) {
//     throw new Error("El monto a pagar debe ser superior a 0.");
//   }

//   //Realizando el pago según cantidad de cuotas
//   for (let index = 0; index < quotaNumber; index++) {
//     /*Validar si monto es suficiente para saldar quota,
//       de lo contrario se abona*/
//     //console.log(quotaNumber, index);

//     if (amount >= loanQuotas[index].currentAmount) {
//       //This is a test note
//       //console.log("camount", loanQuotas[index].currentAmount, "amount", amount);
//       parseFloat(loanQuotas[index].totalPaidMora);
//       loanQuotas[index].totalPaid = parseFloat(
//         loanQuotas[index].currentPaid +
//           loanQuotas[index].amount -
//           loanQuotas[index].discountMora -
//           loanQuotas[index].discountInterest
//       );
//       // parseFloat(loanQuotas[index].totalPaidMora) -
//       // parseFloat(loanQuotas[index].discountMora);
//       loanQuotas[index].executeProcessMora = false;
//       loanQuotas[index].statusType = "PAID";
//       loanQuotas[index].isPaid = true;
//       if (loanQuotas[index].mora != 0) {
//         loanQuotas[index].totalPaidMora =
//           parseFloat(loanQuotas[index].totalPaidMora) +
//           parseFloat(loanQuotas[index].fixedMora);
//         loanQuotas[index].mora = 0;
//       }
//       loanQuotas[index].payMoraOnly = false;

//       paidQuotas.push(loanQuotas[index]);
//       // console.log("hi");
//       amount = amount - loanQuotas[index].currentAmount;
//     } else {
//       if (index == 0) {
//         // console.log("amount", amount, "mora", loanQuotas[index].mora);
//         if (amount <= loanQuotas[index].mora) {
//           if (loanQuotas[index].mora != 0) {
//             loanQuotas[index].mora = parseFloat(
//               (loanQuotas[index].mora - amount).toFixed(2)
//             );
//             loanQuotas[index].totalPaidMora = amount;
//             loanQuotas[index].payMoraOnly = true;
//           } else {
//             loanQuotas[index].totalPaid = parseFloat(amount.toFixed(2));
//           }
//         } else {
//           if (loanQuotas[index].mora != 0) {
//             // console.log("brakepoint", loanQuotas[index].mora);
//             loanQuotas[index].totalPaidMora = parseFloat(
//               loanQuotas[index].mora
//             );

//             loanQuotas[index].totalPaid = parseFloat(
//               (amount - loanQuotas[index].totalPaidMora).toFixed(2)
//             );

//             loanQuotas[index].mora = 0;
//             loanQuotas[index].payMoraOnly = false;
//           } else {
//             loanQuotas[index].totalPaid = parseFloat(amount.toFixed(2));
//           }
//         }

//         loanQuotas[index].statusType = "COMPOST";
//         loanQuotas[index].isPaid = false;
//         paidQuotas.push(loanQuotas[index]);
//         amount = 0;
//       } else {
//         if (payNextQuotas == true) {
//           if (amount <= loanQuotas[index].mora) {
//             if (loanQuotas[index].mora != 0) {
//               loanQuotas[index].mora = parseFloat(
//                 (loanQuotas[index].mora - amount).toFixed(2)
//               );
//               loanQuotas[index].totalPaidMora = parseFloat(amount.toFixed(2));
//               loanQuotas[index].payMoraOnly = true;
//             }
//           } else {
//             if (loanQuotas[index].mora != 0) {
//               loanQuotas[index].totalPaidMora = loanQuotas[index].mora;

//               loanQuotas[index].totalPaid = parseFloat(
//                 (amount - loanQuotas[index].mora).toFixed(2)
//               );
//               loanQuotas[index].payMoraOnly = false;
//               loanQuotas[index].mora = 0;
//             } else {
//               loanQuotas[index].totalPaid = parseFloat(amount.toFixed(2));
//             }
//           }

//           loanQuotas[index].statusType = "COMPOST";
//           loanQuotas[index].isPaid = false;
//           paidQuotas.push(loanQuotas[index]);
//           amount = 0;
//         } else {
//           change = parseFloat(amount.toFixed(2));
//           if (index == quotaNumber) {
//             amount = 0;
//           }
//         }
//       }
//     }
//   }

//   if (amount > 0) {
//     change = parseFloat(amount.toFixed(2));
//   }

//   return {
//     paidQuotas,
//     change,
//   };
// }

function processPayment(
  amountOfQuotas,
  amount,
  quotas,
  pn,
  liquidateLoan,
  globalDiscount
) {
  let i = 0;
  let cb = 0;
  let response = [];
  let quota;

  // let discQuotas = [];
  // quotas.map((c, i) => i < amountOfQuotas && discQuotas.push(c));

  // let minAmount = discQuotas.filter((c) => c.discount > 0);

  // if (minAmount.length > 1) {
  //   minAmount = minAmount.reduce((acc, i) => acc + i.quota_amount);
  // } else {
  //   minAmount = minAmount.quota_amount;
  // }

  // console.log("MIN AMOUNT", minAmount);

  // if (amount < minAmount) {
  //   throw new Error(
  //     "Una o varias cuotas presentan descuento, el monto debe ser mayor a RD$" +
  //       significantFigure(minAmount.toString())
  //   );
  // }

  if (liquidateLoan == true) {
    amount = amount + globalDiscount;

    let sumQuotas = quotas.reduce(
      (acc, quota) => acc + parseFloat(quota.quota_amount),
      0
    );

    console.log(
      "########################################################################",
      amount,
      sumQuotas
    );
    if (amount < sumQuotas) {
      throw new Error("El monto debe ser al menos " + sumQuotas);
    } else {
      amountOfQuotas = quotas.length;
    }
  }

  while (amount > 0) {
    if (i < amountOfQuotas) {
      [amount, quota] = paymentCurrentQuota(quotas[i], amount);
      response.push(quota);

      i++;
    } else {
      if (pn == true) {
        // console.log(i);
        let o = i;

        while (amount > 0) {
          if (quotas.length != o) {
            [amount, quota] = paymentCurrentQuota(quotas[o], amount);
            response.push(quota);
            o++;
          } else {
            cb = amount;
            amount = 0;
          }
        }
      } else {
        cb = Math.round((amount + Number.EPSILON) * 100) / 100;
        amount = 0;
      }
    }
  }

  return { paidQuotas: response, change: cb };
}

function paymentCurrentQuota(quota, amount) {
  // console.log(quota);

  if (quota.discount > 0 && amount < quota.quota_amount) {
    throw new Error(
      "Esta cuota presenta descuento, el monto debe ser mayor a RD$" +
        significantFigure(quota.quota_amount.toString())
    );
  }
  let interestWasPaid = false;

  //Quota default status

  if (quota.fixedStatusType != "DEFEATED") {
    quota.statusType = "COMPOST";
    quota.paid = false;
  }

  if (quota.totalPaidMora < quota.mora && amount >= quota.quota_amount) {
    quota.mora -= quota.discount;
    //quota.fixedMora -= quota.discount;
  }

  // Check if mora can be paid
  if (amount <= quota.mora) {
    quota.payMoraOnly = true;

    quota.totalPaidMora =
      Math.round((quota.totalPaidMora + amount + Number.EPSILON) * 100) / 100;
    quota.mora = Math.round((quota.mora - amount + Number.EPSILON) * 100) / 100;
    amount = 0;
  } else {
    quota.totalPaidMora =
      Math.round((quota.totalPaidMora + quota.mora + Number.EPSILON) * 100) /
      100;
    amount = Math.round((amount - quota.mora + Number.EPSILON) * 100) / 100;
    quota.mora = 0;

    console.log("1234", amount);

    // Check if interest can be paid
    if (quota.totalPaid < quota.interest) {
      if (amount <= quota.interest - quota.totalPaid) {
        if (amount > 0) {
          quota.statusType = "COMPOST";
          quota.paid = false;
        }
        quota.totalPaid += amount;
        amount = 0;
      } else {
        quota.statusType = "COMPOST";
        quota.paid = false;
        amount = amount - (quota.interest - quota.totalPaid);
        quota.totalPaid += quota.interest - quota.totalPaid;
        // console.log("INTEREST", quota.totalPaid);
      }
    } else {
      interestWasPaid = true;
    }

    console.log("WHAT IS GOIN ON ", {
      amount,
      capital: quota.capital - (quota.totalPaid - quota.interest),
    });
    quota.capital = quota.amountOfFee - quota.interest;

    // Check if capital can be paid
    if (amount < quota.capital - (quota.totalPaid - quota.interest)) {
      // console.log(
      //   "CAPITAL",
      //   amount + quota.discount,
      //   quota.capital - (quota.totalPaid - quota.interest)
      // );
      // if (
      //   amount + quota.discount >=
      //   quota.capital - (quota.totalPaid - quota.interest)
      // ) {
      //   quota.statusType = "PAID";
      //   quota.paid = true;
      //   quota.totalPaid += quota.capital - quota.discount;
      //   // console.log(amount - quota.capital + quota.discount);
      //   amount = amount - quota.capital + quota.discount;
      // } else {
      quota.totalPaid += amount;
      amount = 0;
      //}
    } else {
      if (interestWasPaid == true) {
        amount -= quota.capital - (quota.totalPaid - quota.interest);
        quota.totalPaid += quota.capital - (quota.totalPaid - quota.interest);
      } else {
        amount -= quota.capital;
        console.log("BEFORE", quota.totalPaid);
        quota.totalPaid += quota.capital;
        console.log("AFTER", quota.totalPaid);
      }
      // quota.totalPaid -= quota.discount;
      // amount += quota.discount;
      quota.statusType = "PAID";
      quota.paid = true;
    }
  }

  quota.totalPaid = Math.round((quota.totalPaid + Number.EPSILON) * 100) / 100;

  // if (quota.totalPaid + quota.totalPaidMora >= quota.quota_amount) {
  //   quota.statusType = "PAID";
  //   quota.paid = true;
  // }

  return [amount, quota];
}

// function paymentCurrentQuota(quota, amount) {
//   // console.log(quota);

//   if (quota.discount > 0 && amount < quota.quota_amount) {
//     throw new Error(
//       "Esta cuota presenta descuento, el monto debe ser mayor a RD$" +
//         significantFigure(quota.quota_amount.toString())
//     );
//   } else {
//     amount = amount + quota.discount;
//   }

//   let interestWasPaid = false;

//   //Quota default status
//   quota.statusType = "COMPOST";
//   quota.paid = false;

//   // if (quota.totalPaidMora == 0 && amount >= quota.quota_amount) {
//   //   quota.mora -= quota.discount;
//   //   quota.fixedMora -= quota.discount;
//   // }

//   // Check if mora can be paid
//   if (amount <= quota.mora) {
//     if (amount == quota.mora) {
//       quota.payMoraOnly = true;
//     }

//     quota.totalPaidMora =
//       Math.round((quota.totalPaidMora + amount + Number.EPSILON) * 100) / 100;
//     quota.mora = Math.round((quota.mora - amount + Number.EPSILON) * 100) / 100;
//     amount = 0;
//   } else {
//     quota.totalPaidMora =
//       Math.round((quota.totalPaidMora + quota.mora + Number.EPSILON) * 100) /
//       100;
//     amount = Math.round((amount - quota.mora + Number.EPSILON) * 100) / 100;
//     quota.mora = 0;

//     console.log("1234", amount);

//     // Check if interest can be paid
//     if (quota.totalPaid < quota.interest) {
//       if (amount <= quota.interest - quota.totalPaid) {
//         quota.totalPaid += amount;
//         amount = 0;
//       } else {
//         amount = amount - (quota.interest - quota.totalPaid);
//         quota.totalPaid += quota.interest - quota.totalPaid;
//         // console.log("INTEREST", quota.totalPaid);
//       }
//     } else {
//       interestWasPaid = true;
//     }

//     console.log("WHAT IS GOIN ON ", {
//       amount,
//       capital: quota.capital - (quota.totalPaid - quota.interest),
//     });
//     // Check if capital can be paid

//     if (amount < quota.capital - (quota.totalPaid - quota.interest)) {
//       console.log(
//         "CAPITAL",
//         amount + quota.discount,
//         quota.capital - (quota.totalPaid - quota.interest)
//       );
//       if (
//         amount + quota.discount >=
//         quota.capital - (quota.totalPaid - quota.interest)
//       ) {
//         quota.statusType = "PAID";
//         quota.paid = true;
//         quota.totalPaid += quota.capital - quota.discount;
//         // console.log(amount - quota.capital + quota.discount);
//         amount = amount - quota.capital + quota.discount;
//       } else {
//         quota.totalPaid += amount;
//         amount = 0;
//       }
//     } else {
//       quota.statusType = "PAID";
//       quota.paid = true;
//       if (interestWasPaid == true) {
//         amount -= quota.capital - (quota.totalPaid - quota.interest);
//         quota.totalPaid += quota.capital - (quota.totalPaid - quota.interest);
//       } else {
//         amount -= quota.capital;
//         quota.totalPaid += quota.capital;
//       }
//       quota.totalPaid -= quota.discount;
//       amount = quota.quotaAmount - quota.totalPaid;
//     }
//   }

//   //quota.totalPaid = Math.round((quota.totalPaid + Number.EPSILON) * 100) / 100;

//   if (quota.totalPaid + quota.totalPaidMora == quota.quota_amount) {
//     quota.statusType = "PAID";
//     quota.paid = true;
//   }

//   return [amount, quota];
// }

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
      //console.log("HEY CAN BE SPLITED WHERE NUM = ", num);
      decimal = num.split(".")[1];
      //console.log("HEY DECIMAL WHERE NUM = ", decimal);
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

    //console.log("FANCY FUNCTION", styledNum, typeof styledNum);

    if (decimal) {
      styledNum = styledNum + `.${decimal.toString()}`;
    } else {
      styledNum = styledNum + ".00";
    }

    //console.log("FINAL STYLED NUM", styledNum);
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
