import React from "react";
import { View } from "react-native";
import DayPayments from "../components/Reports/DayPayments";
import Visits from "../components/Reports/Visits";

export default function ReportsScreen(props) {
  const {
    route: { params },
  } = props;
  const { bodyKey, header } = params.params;

  console.log(bodyKey);

  return (
    <View>
      {bodyKey == "daypayments" && <DayPayments data={props} />}
      {bodyKey == "visits" && <Visits data={props} />}
    </View>
  );
}
