import React from "react";
import { FlatList, ActivityIndicator, StyleSheet } from "react-native";
import CustomerCard from "./CustomerCard";
import QRCustomerCard from "./QRCustomerCard";

export default function CustomerList(props) {
  const { customers, loadCustomers, isNext, routeName, navigation } = props;

  const loadMoreCustomers = () => {
    loadCustomers();
  };

  return (
    <FlatList
      style={{ marginBottom: 70 }}
      data={customers}
      showsVerticalScrollIndicator={false}
      keyExtractor={(customers) => String(customers.customer_id)}
      onEndReached={isNext && loadMoreCustomers}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        isNext && <ActivityIndicator size="large" style={styles.spinner} />
      }
      renderItem={({ item }) =>
        routeName == "QRManagement" ? (
          <QRCustomerCard navigation={navigation} customer={item} />
        ) : (
          <CustomerCard customer={item} />
        )
      }
    />
  );
}

ActivityIndicator.defaultProps.color = "#aeaeae";

const styles = StyleSheet.create({
  spinner: {
    marginBottom: 60,
    marginTop: 20,
    color: "#fff",
  },
});
