import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { getCustomerApi } from "../api/customers";
import CustomerCard from "../components/CustomerCard";
import CustomerList from "../components/CustomerList";
import CustomerSearch from "../components/CustomerSearch";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";

export default function CustomerScreen(props) {
  const {
    route: { params },
  } = props;
  console.log("customers params", params);

  const [customers, setCustomers] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [searchStatus, searchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    (() => {
      setCustomers("");
    })();
  }, [auth]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      auth && auth?.login != "admin" ? await loadCustomers(auth) : undefined;
      setIsLoading(false);
      console.log("hi from customer");
    })();
  }, [auth]);

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

  const loadCustomers = async (auth) => {
    const customersInfo = {
      customersArray: [],
    };

    try {
      const response = await getCustomerApi(nextUrl, auth?.employee_id);
      setNextUrl(response.next);
      //console.log(response.results);
      for (var customer of response.customers) {
        customersInfo.customersArray.push({
          id: customer.customer_id,
          image_url: customer.image_url,
          identification: customer.identification,
          first_name: customer.first_name,
          last_name: customer.last_name,
          address: customer.street,
          business: customer.business,
          atrasos: 0,
          cuotas: 10,
          cuota: "$RD 1200",
          loan_status: (() => {
            var results, status;
            response.loans.map((item) => {
              if (customer.customer_id == item.customer_id) {
                results = "ARREARS";
                status = "done";
                return;
              }
            });

            if (status == "done") {
              return results;
            } else {
              return "NORMAL";
            }
          })(),
        });
      }

      setCustomers([...customers, ...customersInfo.customersArray]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ paddingBottom: 0 }}>
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
