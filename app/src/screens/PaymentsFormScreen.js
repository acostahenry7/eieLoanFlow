import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Keyboard,
  Modal,
  ActivityIndicator,
} from "react-native";
import CheckBox from "expo-checkbox";
import Icon from "react-native-vector-icons/FontAwesome5";
import ModalDropdown from "react-native-modal-dropdown";
import { useFormik } from "formik";
import * as Yup from "yup";
import { isEmpty } from "lodash";
import useAuth from "../hooks/useAuth";
import {
  createPaymentaApi,
  createChargePaymentApi,
  setReceiptZPL,
} from "../api/payments";
import Receipt from "../components/Receipt";
import ReceiptCharges from "../components/ReceiptCharges";
import { getTotalDiscount, significantFigure } from "../utils/math";
import { genereateZPLTemplate } from "../utils/printFunctions";
import { setPaymentObject } from "../utils/math";

export default function PaymentsFormScreen(props) {
  const {
    route: { params },
    navigation,
  } = props;
  const { auth } = useAuth();
  const { customer, loans, loan, quotas, register, globalDiscount, charges } =
    params;

  const [loanQuotas, setLoanQuotas] = useState(getQuotaNumber(loan, quotas));
  //const [amount, setAmount] = useState(null);
  //const [isPayLoanSelected, setIsPayLoanSelected] = useState(false);
  const [receiptVisibility, setReceiptVisibility] = useState(false);

  const [changeReceiptVisibility, setChangeReceiptVisibility] = useState(false);

  const [changeReceiptDetails, setChangeReceiptDetails] = useState({});
  const [receiptDetails, setReceiptDetails] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState();
  //const [currentQuotaNumber, setCurrentQuotaNumber] = useState([]);
  const [receiptQuotas, setReceiptQuotas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [payLoan, setPayLoan] = useState(false);
  const [isPaymentButtonDisabled, setIsPaymentButtonDisabled] = useState(false);
  //const [pendingAmount, setPendingAmount] = useState("");

  console.log(
    "###############AAAA",
    loans.filter(({ number }) => number == loan)[0].loanType
  );

  const [currentCharge, setCurrentCharge] = useState(charges);

  useEffect(() => {
    (() => {
      console.log("MY CHARGES", charges);
      setCurrentCharge(charges);
    })();
  }, [charges]);

  //Bluetooth
  var loanNumbers = [];
  loans.map((loan) => {
    loanNumbers.push(loan.number.toString());
  });

  let initialQuotas = [];

  //console.log("HEY THIS IS THE LOAN ", loans);

  const formik = useFormik({
    initialValues: initialValues(
      params.loan,
      loans,
      quotas,
      currentCharge,
      navigation
    ),
    validateOnChange: false,
    validationSchema: Yup.object({
      amount: Yup.number()
        .required()
        .moreThan(0, "El monto  debe ser mayor a 0"),
    }),
    onSubmit: async (values) => {
      var {
        loanNumber,
        quotasNumber,
        payLoan,
        paymentMethod,
        isACharge,
        loanChargeId,
        amount,
        comment,
      } = values;

      setIsPaymentButtonDisabled(true);
      if (isACharge == true) {
        let data = {
          loanChargeId,
        };

        try {
          setIsLoading(true);
          let res = await createChargePaymentApi(data);

          setIsLoading(false);

          let receiptDetails = {
            outlet: auth.name,
            rnc: auth.rnc,
            receiptNumber: res?.receiptNumber,
            loanNumber,
            paymentMethod,
            login: auth.login,
            date: (() => {
              //Date
              const date = new Date().getDate();
              const month = new Date().getMonth() + 1;
              const year = new Date().getFullYear();

              //Time
              const hour = new Date().getHours();
              var minute = new Date().getMinutes();
              minute < 10 ? (minute = "" + minute) : (minute = minute);
              var dayTime = hour >= 12 ? "PM" : "AM";

              const fullDate = `${date}/${month}/${year}  ${hour}:${minute} ${dayTime}`;
              return fullDate.toString();
            })(),
            firstName: params.first_name,
            lastName: params.last_name,
            amount: res?.amount,
            receivedAmount: amount,
            description: res?.description,
          };

          if (res) {
            console.log("RES_CHARGES", res);
            setChangeReceiptDetails(receiptDetails);
            setChangeReceiptVisibility(true);
          }

          if (res.error) {
            throw new Error(res.message);
          } else {
            console.log(res);
            // alert("LISTO!", res.message);

            // navigation.navigate("PaymentsRoot", {
            //   screen: "Payments",
            //   params: {
            //     loanNumber: loanNumber,
            //     origin: "customerInfo",
            //   },
            // });
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        let receivedAmount = parseFloat(amount);
        console.log("FLOAT", isACharge);

        // isChecked == true
        //   ? (paymentDistribution = true)
        //   : (paymentDistribution = false);

        //payLoan == 'si' ? paymentDistribution = true : paymentDistribution = paymentDistribution
        amount = parseInt(amount);

        const currentPendingAmount = getAmount(
          quotas[loanNumber].length,
          loanNumber,
          quotas
        );

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

        let data;
        try {
          data = setPaymentObject({
            loanId: loans.filter((loan) => loan.number == loanNumber)[0].loanId,
            loanNumber,
            isACharge,
            loanChargeId,
            quotaNumber: quotasNumber,
            paymentMethod,
            loanQuotas: (() => {
              let loanQuotas = [];
              quotas[loanNumber].map((quota) => {
                loanQuotas.push({
                  quotaId: quota.amortization_id,
                  quotaNumber: quota.quota_number,
                  capital: parseFloat(quota.capital),
                  interest: parseFloat(quota.interest),
                  amountOfFee: parseFloat(quota.amount_of_fee),
                  quota_amount: parseFloat(quota.quota_amount),
                  mora: parseFloat(quota.mora),
                  fixedMora: parseFloat(quota.mora),
                  totalPaid: parseFloat(quota.total_paid),
                  totalPaidMora: parseFloat(quota.total_paid_mora),
                  fixedTotalPaid: parseFloat(quota.total_paid),
                  fixedTotalPaidMora: parseFloat(quota.total_paid_mora),
                  payMoraOnly: false,
                  discount: parseFloat(quota.discount),
                  statusType: quota.status_type,
                  fixedStatusType: quota.status_type,
                  paid: quota.paid,

                  // quotaId: quota.amortization_id,
                  // quotaNumber: quota.quota_number,
                  // amount: parseFloat(quota.fixed_amount),
                  // currentAmount: parseFloat(quota.current_fee),
                  // date: quota.date,
                  // mora: parseFloat(quota.mora),
                  // fixedMora: parseFloat(quota.mora),
                  // fixedTotalPaidMora: parseFloat(quota.total_paid_mora),
                  // totalPaidMora: quota.total_paid_mora,
                  // discountMora: parseFloat(quota.discount_mora),
                  // fixedDiscountMora: quota.discount_mora,
                  // discountInterest: parseFloat(quota.discount_interest),
                  // currentPaid: parseFloat(quota.current_paid),
                  // totalPaid: 0,
                  // statusType: quota.status_type,
                  // isPaid: false,
                  // payMoraOnly: false,
                  // latestStatus: quota.status_type,
                  // executeProcessMora: true,
                });
              });
              return loanQuotas;
            })(),
            liquidateLoan: payLoan,
            globalDiscount,
            ncf: "",
            amount: receivedAmount || 0,
            payNextQuotas: isChecked ? true : false,
            commentary: comment,
            createdBy: auth.login,
            lastModifiedBy: auth.login,
            employeeId: auth.employee_id,
            outletId: loans.filter(({ number }) => number == loan)[0].outletId,
            loanType: loans.filter(({ number }) => number == loan)[0].loanType,
            customerId: params.customer_id,
            totalMora: 0,
            registerId: register.register_id,
            quotaAmount: (() => {
              let quotaAmount = loans.find((item) => item.number == loanNumber);

              return quotaAmount.quotasNum;
            })(),
          });

          console.log("DATAAAAAAAAAAAAAAAAAAA$$$$", data);

          setReceiptQuotas(data.amortization);
          setIsLoading(true);
          const response = await createPaymentaApi(data);
          //let response = {};

          let testing = {
            loanNumber,
            login: auth.login,
            outlet: auth.name,
            rnc: auth.rnc,
            cashBack: data.payment.change,
            total: data.payment.total,
            totalPaid:
              data.payment.totalPaid -
              data.payment.fixedTotalPaid +
              (data.payment.totalPaidMora - data.payment.fixedTotalPaidMora),
            fixedTotalPaid: data.payment.fixedTotalPaid,
            totalPaidMora:
              data.payment.totalPaidMora - data.payment.fixedTotalPaidMora,
            fixedTotalPaidMora: data.payment.fixedTotalPaidMora,
            pendingAmount: data.payment.pendingAmount,
            totalMora: data.payment.totalMora,
            liquidateLoan: data.payment.liquidateLoan,
            mora: data.payment.totalMora,
            section: response.loanDetails?.section,
            amountOfQuotas: response.loanDetails?.amountOfQuotas,
            receiptNumber: response.receipt?.receipt_number,
            paymentMethod: data.payment.paymentType,
            outletId: auth.outlet_id,
            firstName: params.first_name,
            lastName: params.last_name,
            receivedAmount,
            fixedQuotas: (() => {
              let quotaAmount = loans.find((item) => item.number == loanNumber);

              return quotaAmount.quotasNum;
            })(),
            amortization: data.amortization,
            quotaNumbers: (() => {
              let result = [];
              data.amortization.map((quota, index) => {
                //result.push(quota.quotaNumber.toString());
              });

              return result;
            })(),
            date: (() => {
              //Date
              const date = new Date().getDate();
              const month = new Date().getMonth() + 1;
              const year = new Date().getFullYear();

              //Time
              const hour = new Date().getHours();
              var minute = new Date().getMinutes();
              minute < 10 ? (minute = "" + minute) : (minute = minute);
              var dayTime = hour >= 12 ? "PM" : "AM";

              const fullDate = `${date}/${month}/${year}  ${hour}:${minute} ${dayTime}`;
              return fullDate.toString();
            })(),
            copyText: "",
          };

          if (response) {
            setReceiptDetails(testing);

            let zpl = genereateZPLTemplate(testing);
            await setReceiptZPL(zpl, response.receipt?.receipt_id);

            setReceiptVisibility(true);
            setIsLoading(false);
          } else {
            Alert.alert("Error", "No se pudo realizar el pago correctamente!");
            setReceiptVisibility(true);
            setIsLoading(false);
          }

          setIsLoading(false);
        } catch (error) {
          Alert.alert("Error", error.message.toString());
        }

        setIsLoading(false);
      }
    },
  });

  return (
    <View style={styles.selectItemContainer}>
      {/*Loan Payment Modal*/}
      <Modal visible={payLoan} transparent={true} animationType="fade">
        <View style={styles.modalView}>
          <View
            style={{
              padding: 10,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: 4,
              borderColor: "#bf514c",
              borderWidth: 3,
            }}
          >
            <View style={{ maxWidth: 335 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 16, textAlign: "justify" }}>
                  Usted está a punto de saldar el préstamo, la acción a realizar
                  es{" "}
                  <Text
                    style={{ fontWeight: "bold", fontSize: 16, color: "red" }}
                  >
                    IRREVERSIBLE
                  </Text>
                </Text>
              </View>

              <Text style={{ marginTop: 20, fontSize: 16 }}>
                El monto a pagar es de RD$
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {significantFigure(
                    (
                      quotas[formik.values.loanNumber].reduce(
                        (acc, quota) => acc + parseFloat(quota.quota_amount),
                        0
                      ) - globalDiscount
                    ).toFixed(2)
                  )}
                </Text>
              </Text>
              <Text
                style={{ marginTop: 20, fontSize: 16, textAlign: "justify" }}
              >
                {" "}
                ¿Confirma haber recibido este monto del cliente?
              </Text>
              <View
                style={{
                  marginTop: 25,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{}}>
                  <Button
                    title="Cancelar"
                    color={"#bf514c"}
                    onPress={() => {
                      setPayLoan(false);
                      formik.setFieldValue("payLoan", "no");
                    }}
                  />
                </View>

                <View style={{}}>
                  <Button
                    title="Aceptar"
                    onPress={() => {
                      setPayLoan(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {isLoading && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.modalView}>
            <View
              style={{
                padding: 10,
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 4,
              }}
            >
              <ActivityIndicator size={50} color="#4682b4" />
              <Text style={{ color: "grey" }}>Espere...</Text>
            </View>
          </View>
        </Modal>
      )}
      <ScrollView>
        <View style={styles.formGroup}>
          <Text>Número de Préstamo</Text>
          <SelectItem
            formik={formik}
            options={loanNumbers}
            defaultVal={formik.values.loanNumber}
            fieldKey="loanNumber"
            quotas={quotas}
            setLoanQuotas={setLoanQuotas}
            //loans={loans}
          />
        </View>
        <View style={styles.formGroup}>
          <Text>Número de Cuotas</Text>
          <SelectItem
            formik={formik}
            options={loanQuotas}
            defaultVal={formik.values.quotasNumber}
            fieldKey="quotasNumber"
            quotas={quotas}
            globalDiscount={globalDiscount}
            //loans={loans}
          />
        </View>
        <View style={styles.formGroup}>
          <Text>Saldar Préstamo</Text>
          <SelectItem
            disabled={false}
            formik={formik}
            options={["si", "no"]}
            defaultVal={formik.values.payLoan}
            fieldKey="payLoan"
            quotas={quotas}
            globalDiscount={globalDiscount}
            setPayLoan={setPayLoan}
          />
        </View>
        <View style={styles.formGroup}>
          <Text>Tipo de Pago</Text>
          <SelectItem
            formik={formik}
            options={["Efectivo", "Cheque", "Transferencia"]}
            defaultVal={formik.values.paymentMethod}
            fieldKey="paymentMethod"
          />
        </View>
        <View style={styles.formGroup}>
          <Text>Pagar</Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.textInput}
              placeholder="RD$"
              value={formik.values.amount}
              onChangeText={(text) => {
                formik.setFieldValue("amount", text);
                setIsPaymentButtonDisabled(false);
              }}
              fieldKey="amount"
              keyboardType="decimal-pad"
            />
            <Text
              style={{
                textAlignVertical: "bottom",
                color: "grey",
                marginLeft: 5,
                paddingBottom: 5,
              }}
            >
              $RD
            </Text>
          </View>
          <Text style={{ color: "red" }}>{formik.errors.amount}</Text>
          {currentCharge?.find((item) => item.loan_number == loan) > 0 && (
            <View
              style={{
                backgroundColor: "lemonchiffon",
                paddingHorizontal: 7,
                paddingVertical: 7,
                marginTop: 5,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "goldenrod",
                  fontSize: 10,
                  textAlign: "justify",
                  fontWeight: "600",
                }}
              >
                Para poder realizar los pagos establecidos primero debe realizar
                el pago de los gasto registrado para este préstamo
              </Text>
            </View>
          )}
          {globalDiscount > 0 && formik.values.payLoan == "si" && (
            <View
              style={{
                backgroundColor: "powderblue",
                paddingHorizontal: 7,
                paddingVertical: 7,
                marginTop: 5,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "darkblue",
                  fontSize: 10,
                  textAlign: "justify",
                  fontWeight: "600",
                }}
              >
                Descuento al <Text style={{ fontWeight: "bold" }}>saldar</Text>{" "}
                el préstamo{" "}
                <Text style={{ fontWeight: "bold" }}>
                  RD$ {significantFigure(globalDiscount)}
                </Text>
              </Text>
            </View>
          )}
        </View>
        <View style={styles.formGroup}>
          <Text>Comentario</Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={{ ...styles.textInput, width: "100%", height: 50 }}
              multiline
              placeholder="Ecribe un Comentario"
              numberOfLines={4}
              value={formik.values.comment}
              onChangeText={(text) => formik.setFieldValue("comment", text)}
              fieldKey="commment"
            />
          </View>
        </View>
        {/*CHECKBOX DE APLICAR MONTO RESTANTE - CAMBIO PROCESO DE PAGO */}
        {/* <View style={{ ...styles.formGroup, flexDirection: "row" }}>
          <CheckBox value={isChecked} onValueChange={setIsChecked} />
          <Text style={{ fontSize: 12, marginLeft: 10 }}>
            Aplicar monto restante a la siguiente cuota
          </Text>
        </View> */}
        <View style={styles.formGroup}>
          <Button
            disabled={isPaymentButtonDisabled}
            title="Pagar"
            onPress={(e) => {
              formik.handleSubmit();
            }}
          />
        </View>
      </ScrollView>
      {formik.values.isACharge == false ? (
        <Receipt
          receiptDetails={receiptDetails}
          receiptVisibility={receiptVisibility}
          quotas={receiptQuotas}
          navigation={navigation}
          origin="payment"
        />
      ) : (
        <ReceiptCharges
          receiptDetails={changeReceiptDetails}
          receiptVisibility={changeReceiptVisibility}
          navigation={navigation}
          origin={"charges"}
        />
      )}
    </View>
  );
}

var balance = 0;
function SelectItem(props) {
  const {
    defaultVal,
    disabled,
    options,
    formik,
    fieldKey,
    setLoanQuotas,
    loans,
    quotas,
    globalDiscount,
    setPayLoan,
  } = props;

  return (
    <ModalDropdown
      style={styles.selectItem}
      dropdownStyle={styles.selectItemOptions}
      dropdownTextStyle={styles.selectItemOptionsText}
      disabled={disabled}
      onSelect={(index, value) => {
        switch (fieldKey) {
          case "loanNumber":
            setLoanQuotas(getQuotaNumber(value, quotas));
            // console.log("AHAHAHAAHAHAHAH", value);
            formik.setFieldValue(fieldKey, value);
            formik.setFieldValue("quotasNumber", "1");
            formik.setFieldValue("payLoan", "no");
            //balance = getQuotaAmount(value, loans);

            formik.setFieldValue("amount", getAmount("1", value, quotas));

            break;
          case "quotasNumber":
            formik.setFieldValue(fieldKey, value);
            let payment = 0;
            //payment = getQuotaAmount(formik.values.loanNumber, loans) * value
            let amount = parseFloat(
              getAmount(value, formik.values.loanNumber, quotas)
            );

            if (
              formik.values.payLoan == "si" &&
              value == quotas[formik.values.loanNumber].length
            ) {
              amount -= globalDiscount;
            }

            formik.setFieldValue("amount", amount.toString());
            break;
          case "payLoan":
            formik.setFieldValue(fieldKey, value);

            if (value == "si") {
              formik.setFieldValue(
                "quotasNumber",
                getQuotaNumber(formik.values.loanNumber, quotas).length
              );

              let amount =
                parseFloat(
                  getAmount(
                    quotas[formik.values.loanNumber].length,
                    formik.values.loanNumber,
                    quotas
                  )
                ) - (globalDiscount || 0);

              formik.setFieldValue("amount", amount.toString());

              setPayLoan(true);
            } else {
              formik.setFieldValue("quotasNumber", "1");
              formik.setFieldValue(
                "amount",
                getAmount(1, formik.values.loanNumber, quotas)
              );
              setPayLoan(false);
            }
            break;
          default:
            formik.setFieldValue(fieldKey, value);
            break;
        }
      }}
      options={options}
    >
      <View style={{ flexDirection: "row", width: 220 }}>
        <Text style={styles.defaultSelectItem}>{defaultVal}</Text>
        <Text style={styles.defaultSelectIcon}>
          <Icon
            style={{ marginLeft: 60 }}
            size={14}
            color="#808080"
            name="sort-down"
          ></Icon>
        </Text>
      </View>
    </ModalDropdown>
  );
}

const initialValues = (loan, loans, quotas, charges = [], navigation) => {
  //loan=undefined;

  let i = 0;
  let quotaAmount = getAmount("1", loan, quotas);

  // console.log("mannnnnn, the chrages", charges);

  let isACharge = false;
  let loanChargeId = "";
  if (charges?.length > 0) {
    let result = charges?.find((item) => item.loan_number == loan);
    console.log("FROM PAYMENT FORM", result, loan);
    if (result) {
      isACharge = true;
      loanChargeId = result?.charge_id;
      quotaAmount = result?.amount;
    }

    // if (isACharge == true) {
    //   navigation.navigate("PaymentsRoot", {
    //     screen: "Payments",
    //     params: {
    //       loanNumber: loanNumber,
    //       origin: "customerInfo",
    //     },
    //   });
    // }

    // let result = charges
    //   ?.find((item) => item.loan_number == loan)
    //   .amount?.toString();
    // //console.log("MAN THIS IS THE CHHARGES", result);
    // quotaAmount = result;
  }
  return {
    loanNumber: loan || "Seleccione un préstamo",
    quotasNumber: (loan && "1") || "Seleccione cantidad de Cuotas",
    paymentMethod: "Efectivo",
    payLoan: "no",
    isACharge,
    loanChargeId,
    amount: quotaAmount,
    comment: "",
  };
};

function getQuotaNumber(loan, quotas) {
  var i = 1;
  var result = [];

  quotas[loan]?.map((item) => {
    result.push(i.toString());
    i++;
  });

  return result;
}

function getAmount(number, loan, quotas) {
  let i = 0;
  let amount = 0;

  while (i < number) {
    if (quotas[loan][i].status_type == "COMPOST") {
      amount +=
        parseFloat(quotas[loan][i].quota_amount) +
        parseFloat(quotas[loan][i].discount);
    } else {
      amount += parseFloat(quotas[loan][i].quota_amount);
    }
    i++;
  }

  // console.log("totalAmount", amount.toFixed(2));

  return amount.toFixed(2);
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "rgba(0,0,0,0.3)",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  selectItemContainer: {
    paddingHorizontal: 20,
    backgroundColor: "white",
    paddingVertical: 40,
    height: 600,
    flex: 1,
  },

  formGroup: {
    paddingVertical: 10,
  },

  selectItem: {
    //alignSelf: 'center',
    marginTop: 5,
    height: 20,
    borderWidth: 1,
    borderColor: "#D1D7DB",
    width: "100%",
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 0,
  },

  selectItemOptions: {
    width: "75%",
    paddingTop: 0,
    borderWidth: 1,
  },

  selectItemOptionsText: {
    width: "100%",
    fontSize: 16,
    textAlign: "center",
  },

  defaultSelectItem: {
    fontSize: 15,
    color: "#545452",
    paddingVertical: 9,
    width: 240,
  },

  defaultSelectIcon: {
    alignSelf: "center",
    paddingLeft: 50,
    width: "100%",
  },

  textInput: {
    marginTop: 5,
    height: 20,
    borderWidth: 1,
    borderColor: "#D1D7DB",
    width: "90%",
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 0,
  },
});
