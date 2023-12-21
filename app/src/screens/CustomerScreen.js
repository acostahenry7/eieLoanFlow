import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Alert } from "react-native";
import { getCustomerApi } from "../api/customers";
import CustomerCard from "../components/CustomerCard";
import CustomerList from "../components/CustomerList";
import CustomerSearch from "../components/CustomerSearch";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import { useNetInfo } from "@react-native-community/netinfo";
import { OfflineBanner } from "../components/Network/OfflineBanner";

export default function CustomerScreen(props) {
  const {
    route: { params },
  } = props;

  const [customers, setCustomers] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [searchStatus, searchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const netInfo = useNetInfo();

  useEffect(() => {
    (() => {
      setCustomers("");
    })();
  }, [auth]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        auth && auth?.login != "admin"
          ? await loadCustomers(auth, netInfo.isConnected)
          : undefined;
        setIsLoading(false);
        console.log("hi from customer");
      } catch (error) {
        console.log(error);
      }
    })();
  }, [auth, netInfo.isConnected]);

  //console.log('searchStatus', searchStatus);
  let searchedCustomers = [];
  if (searchStatus.length >= 1) {
    searchedCustomers = customers?.filter((customer) => {
      var customerName = (
        customer.first_name +
        " " +
        customer.last_name +
        " " +
        customer.identification +
        " " +
        customer.business
      ).toLowerCase();
      var searchedText = searchStatus.toLocaleLowerCase();
      return customerName.includes(searchedText);
    });
  } else {
    searchedCustomers = customers;
  }

  const loadCustomers = async (auth, netStatus) => {
    const customersInfo = {
      customersArray: [],
    };

    try {
      const response = await getCustomerApi(
        nextUrl,
        auth?.employee_id,
        netStatus
      );
      setNextUrl(response.next);
      console.log("######", response);
      for (var customer of response.customers) {
        customersInfo.customersArray.push({
          ...customer,
          loan_status:
            (() => {
              var result;

              response.loans?.map((item, i) => {
                if (customer.customer_id == item.customer_id) {
                  result = item.loan_situation;
                }
              });
              return result;
            })() || customer.loan_situation,
        });
      }

      setCustomers([...customersInfo.customersArray]);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView
      style={{
        paddingBottom: 0,
        backgroundColor: "white",
        minHeight: "100%",
      }}
    >
      <CustomerSearch
        searchStatus={searchStatus}
        setSearchValue={searchValue}
      />
      {!isLoading ? (
        <CustomerList
          customers={searchedCustomers}
          loadCustomers={loadCustomers}
          isNext={nextUrl}
        />
      ) : (
        <Loading text="" />
      )}
    </SafeAreaView>
  );
}
