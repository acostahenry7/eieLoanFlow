// var i = 0;
// var counter = 1;

// var totalPaid = 0;

//       let amortization = [];
//       var paymentDistribution;
//       let cashBack = 0;
//let quotaOrder = 0;

// while (i < quotasNumber) {
//   ////console.log(quotas[loanNumber][i].quota_number);

//   if (amount > 0) {
//     var statusType = "PAID";

//     //Es un abono
//     if (amount < parseInt(quotas[loanNumber][i].current_fee)) {
//       statusType = "COMPOST";
//     }

//     if (statusType != "COMPOST") {
//       amortization.push({
//         quota_number: quotas[loanNumber][i].quota_number,
//         date: ((date) => {
//           var str = quotas[loanNumber][i].payment_date.split("T")[0];

//           date = str.split("-").reverse().join("/");

//           return date;
//         })(),
//         amount: parseInt(quotas[loanNumber][i].current_fee),
//         quotaId: quotas[loanNumber][i].amortization_id,
//         totalPaid: parseInt(quotas[loanNumber][i].current_fee),
//         statusType,
//         mora: quotas[loanNumber][i].mora,
//         discountMora: quotas[loanNumber][i].discount_mora,
//         discountInterest: quotas[loanNumber][i].discount_interest,
//         fixedAmount: quotas[loanNumber][i].fixed_amount,
//         paid: statusType == "PAID" ? true : false,
//         order: ++quotaOrder,
//       });
//       totalPaid += parseInt(quotas[loanNumber][i].current_fee);
//       amount -= quotas[loanNumber][i].current_fee;

//       if (counter <= parseInt(quotasNumber)) {
//         if (paymentDistribution == true) {
//           let x = i + 1;

//           while (amount != 0) {
//             if (!isEmpty(quotas[loanNumber][x])) {
//               // ////console.log(quotas[loanNumber][x]);
//               if (amount >= quotas[loanNumber][x].current_fee) {
//                 statusType = "PAID";
//                 ////console.log("NO ME DIGAS", quotas[loanNumber][x]);
//                 amortization.push({
//                   quota_number: quotas[loanNumber][x].quota_number,
//                   date: ((date) => {
//                     var str =
//                       quotas[loanNumber][x].payment_date.split("T")[0];

//                     date = str.split("-").reverse().join("/");

//                     return date;
//                   })(),
//                   amount: parseInt(quotas[loanNumber][x].current_fee),
//                   quotaId: quotas[loanNumber][x].amortization_id,
//                   totalPaid: parseInt(quotas[loanNumber][x].current_fee),
//                   statusType,
//                   mora: quotas[loanNumber][x].mora,
//                   discountMora: quotas[loanNumber][x].discount_mora,
//                   discountInterest:
//                     quotas[loanNumber][x].discount_interest,
//                   fixedAmount: quotas[loanNumber][x].fixed_amount,
//                   paid: statusType == "PAID" ? true : false,
//                   order: ++quotaOrder,
//                 });

//                 totalPaid += parseInt(quotas[loanNumber][i].current_fee);
//                 amount -= parseInt(quotas[loanNumber][x].current_fee);
//               } else {
//                 statusType = "COMPOST";
//                 ////console.log("NO ME DIGAS", quotas[loanNumber][x]);
//                 amortization.push({
//                   quota_number: quotas[loanNumber][x].quota_number,
//                   date: ((date) => {
//                     var str =
//                       quotas[loanNumber][x].payment_date.split("T")[0];

//                     date = str.split("-").reverse().join("/");

//                     return date;
//                   })(),
//                   amount: parseInt(quotas[loanNumber][x].current_fee),
//                   quotaId: quotas[loanNumber][x].amortization_id,
//                   totalPaid: amount,
//                   statusType,
//                   mora: quotas[loanNumber][x].mora,
//                   discountMora: quotas[loanNumber][x].discount_mora,
//                   discountInterest:
//                     quotas[loanNumber][x].discount_interest,
//                   fixedAmount: quotas[loanNumber][x].fixed_amount,
//                   paid: statusType == "PAID" ? true : false,
//                   order: ++quotaOrder,
//                 });
//                 totalPaid += amount;
//                 amount = 0;
//                 cashBack = amount;
//                 //console.log("CASHBACK 1", cashBack);
//               }
//             } else {
//               amount = 0;

//               cashBack = amount;
//               //console.log("CASHBACK 2", cashBack);
//             }

//             x++;
//           }

//           //amount -= quotas[loanNumber][i].current_fee
//         } else {
//           cashBack = amount;
//           //console.log("CASHBACK 3", cashBack);
//         }
//       } else {
//         cashBack = amount;
//         //console.log("CASHBACK 4", counter, cashBack);
//       }
//     } else {
//       paymentDistribution = true;
//       ////console.log('here');

//       if (paymentDistribution == true) {
//         amortization.push({
//           //quota_number: ,

//           date: ((date) => {
//             var str = quotas[loanNumber][i].payment_date.split("T")[0];

//             date = str.split("-").reverse().join("/");

//             return date;
//           })(),
//           quota_number: quotas[loanNumber][i].quota_number,
//           amount: parseInt(quotas[loanNumber][i].current_fee),
//           quotaId: quotas[loanNumber][i].amortization_id,
//           totalPaid: amount,
//           statusType,
//           mora: quotas[loanNumber][i].mora,
//           discountMora: quotas[loanNumber][i].discount_mora,
//           discountInterest: quotas[loanNumber][i].discount_interest,
//           fixedAmount: quotas[loanNumber][i].fixed_amount,
//           paid: statusType == "PAID" ? true : false,
//           order: ++quotaOrder,
//         });

//         totalPaid += amount;
//         amount -= quotas[loanNumber][i].current_fee;
//       } else {
//         cashBack = amount;
//         //console.log("CASHBACK 5", cashBack);
//         ////console.log(cashBack, "TE RESTANNN");
//       }
//     }

//     // parseInt(amount) - parseInt(quotas[loanNumber][i].current_fee));
//   }
//   ++i;
//   counter++;
// }

//var data = {};

//MORE CODE

////console.log("HEY I AM YOUR REGISTER", register);
// data.payment = {
//   loanId: loans.filter((loan) => loan.number == loanNumber)[0].loanId,

//   ncf: "",
//   customerId: params.customer_id,
//   paymentMethod,

//   totalMora: parseFloat(
//     amortization.reduce((acc, quota) => acc + parseFloat(quota.mora), 0)
//   ),

//   pendingAmount: currentPendingAmount,
//   paymentType: (function () {
//     switch (paymentMethod) {
//       case "Efectivo":
//         paymentMethod = "CASH";
//         break;
//       case "Transferencia":
//         paymentMethod = "TRANSFER";
//         break;
//       case "Cheque":
//         paymentMethod = "CHECK";
//         break;
//       default:
//         break;
//     }

//     return paymentMethod;
//   })(),
//   createdBy: auth.login,
//   receivedAmount,
//   cashBack: (() => {
//     return Math.round(cashBack);
//   })(),
//   lastModifiedBy: auth.login,
//   employeeId: auth.employee_id,
//   customer,
//   outletId: auth.outlet_id,
//   comment: comment,
//   registerId: register.register_id,
//   payOfLoan: payLoan == "si" ? true : false,
// };

//data.amortization = amortization;

//const response = await createPaymentaApi(data);
