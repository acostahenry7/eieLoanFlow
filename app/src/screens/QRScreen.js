import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { getCustomerApi } from '../api/customers'
import useAuth from '../hooks/useAuth';

import CustomerList from '../components/CustomerList'
import CustomerSearch from '../components/CustomerSearch'
import { useIsFocused } from '@react-navigation/native';

export default function QRScreen(props) {

    const { navigation, route } = props

    const [customers, setCustomers] = useState([])
    const [nextUrl , setNextUrl] = useState(null)
    const [searchStatus, searchValue] = useState('')
    const isFocused = useIsFocused()
    const [isLoading, setIsLoading ] =  useState(false)
    const { auth } = useAuth()


    useEffect(() => {
        
        (async()=> {
            auth &&
            setIsLoading(true)
            await loadCustomers(auth)
            setIsLoading(false)
        })()
    },[])

    // useEffect(() => {
        
    //     (async ()=> {
    //         auth &&
    //         setCustomers([])
    //         await loadCustomers(auth)
    //     })()
    // },[])


    let searchedCustomers = []
    if(searchStatus.length >= 1){
        searchedCustomers = customers?.filter( customer => {
            let identification = customer.identification.replace(new RegExp("-", "g"), "")
            var customerName  = (customer.first_name +  " " + customer.last_name + " " + identification ).toLowerCase()
            var searchedText = searchStatus.toLocaleLowerCase()
            return customerName.includes(searchedText) 
        })
    }else {
        searchedCustomers = customers
    }

    const loadCustomers = async (auth) => {

        
        const customersInfo = {
            customersArray: []
        }

        
        try {
            const response = await getCustomerApi(nextUrl, auth?.employee_id)
            setNextUrl(response.next)

            for (var customer of response.customers){
                customersInfo.customersArray.push({
                    
                    id: customer.customer_id,
                    identification: customer.identification,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    address: customer.street,
                    qr_code: customer.qr_code,
                    atrasos:0,
                    cuotas: 10,
                    cuota: '$RD 1200',
                    loan_status: (() =>{
                        var results, status;
                        response.loans.map( item => {
                                
                            if (customer.customer_id == item.customer_id){
                                
                                results = 'ARREARS'
                                status = 'done'
                                return;
                            }
                        })

                        if (status == 'done'){
                            return results
                        }else{
                            return 'NORMAL'
                        }
                        
                         
                    })()
                })

                
            }

            
            
           setCustomers([...customers, ...customersInfo.customersArray]) 
        } catch (error) {   
            console.error(error);
        }
    }

    return (
        <SafeAreaView>

            <CustomerSearch
                searchStatus ={searchStatus}
                setSearchValue={searchValue}
            />

            {
                isLoading &&
                <ActivityIndicator
                    size={'large'}
                />
            }

            <CustomerList
             customers={searchedCustomers} 
             loadCustomers={loadCustomers}
             routeName={route.name}
             navigation={navigation}
             isNext={nextUrl}
             />
        </SafeAreaView>
    )
}
