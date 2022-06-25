import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Button,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  getReceiptsByLoanApi,
  getAmortizationByPaymentApi,
} from "../api/receipts";
import CardTemplate from "../components/CardTemplate";
import Receipt from "../components/Receipt";
import useAuth from "../hooks/useAuth";

export default function ReceiptScreen(props) {
  const {
    navigation,
    route: { params },
  } = props;
  const { auth } = useAuth();
  const { customer, loans, loan } = params;
  console.log("CUSTOMER", customer);
  const [payments, setPayments] = useState([]);
  const [quotas, setQuotas] = useState([]);
  const [receiptVisibility, setReceiptVisibility] = useState(false);
  const [customHtml, setCustomHtml] = useState({});
  const [receiptDetails, setReceiptDetails] = useState({});

  console.log(quotas);

  useEffect(() => {
    (async () => {
      const response = await getReceiptsByLoanApi({ loanNumber: loan });
      console.log("PAYMENTS", response);
      setPayments(response);
    })();
  }, []);

  const options = [
    {
      name: "Ver",
      action: async (payment) => {
        // console.log(payment);
        const response = await getAmortizationByPaymentApi({
          receiptId: payment?.receipt.receipt_id,
        });
        console.log("RECEIPT TEMPLATE", response);

        setCustomHtml(response.app_html);

        // console.log("RESPONSE", response);
        // setQuotas(response);

        // //  console.log(quotas);
        setReceiptDetails({
          loanNumber: loan,
        });
        //   outlet: auth.name,
        //   rnc: auth.rnc,
        //   receiptNumber: payment.receipt.receipt_number,
        //   amortization: response,
        //   mora: (() => {
        //     let result = 0;
        //     let mora = 0;
        //     response.map((item) => {
        //       mora += parseFloat(item.mora);
        //       result = mora;
        //     });
        //     //console.log("DISCOUNT", result);
        //     return result;
        //   })(),
        //   discount: (() => {
        //     let result = 0;
        //     let discount = 0;
        //     response.map((item) => {
        //       discount +=
        //         parseFloat(item.discountInterest) +
        //         parseFloat(item.discountMora);
        //       result = discount;
        //     });
        //     //console.log("DISCOUNT", result);
        //     return result;
        //   })(),
        //   cashBack: parseFloat(response[0].cashBack || 0),
        //   date: payment.created_date,
        //   time: payment.created_time,
        //   firstName: customer.first_name,
        //   lastName: customer.last_name,
        //   paymentMethod: (function () {
        //     var paymentMethod = payment.payment_type;
        //     console.log(paymentMethod);
        //     switch (paymentMethod) {
        //       case "CASH":
        //         paymentMethod = "Efectivo";
        //         break;
        //       case "TRANSFER":
        //         paymentMethod = "Transferencia";
        //         break;
        //       case "CHECK":
        //         paymentMethod = "Cheque";
        //         break;
        //       default:
        //         break;
        //     }
        //     return paymentMethod;
        //   })(),
        // });

        setReceiptVisibility(true);

        //console.log(response);
      },
    },
    {
      name: "Reimprimir",
      action: () => {
        console.log("hola");
      },
    },
  ];

  return (
    <View>
      <View style={{ elevation: 3, backgroundColor: "white" }}>
        <TextInput style={{ backgroundColor: "skyblue" }} />
      </View>
      <ScrollView style={{ paddingHorizontal: 10, marginBottom: 35 }}>
        {payments?.map((payment, index) => (
          <CardTemplate
            screen="Recibo"
            key={index}
            actionParam={payment}
            searchKey={payment?.payment_id}
            mainTitle="No. Recibo"
            mainText={payment?.receipt?.receipt_number}
            secondaryTitle="Fecha"
            secondaryText={payment?.created_date}
            menuOptions={options}
          />
          // <View key={index}>
          //   <Text>{payment.receipt.receipt_number}</Text>
          // </View>
        ))}
      </ScrollView>
      <Receipt
        setReceiptVisibility={setReceiptVisibility}
        receiptVisibility={receiptVisibility}
        receiptDetails={receiptDetails}
        quotas={quotas}
        navigation={navigation}
        customHtml={customHtml}
        origin={"receipt"}
      />
    </View>
  );
}
