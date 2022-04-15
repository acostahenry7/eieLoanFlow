import React, {useState} from 'react'
import { Alert, ScrollView, View, Text, StyleSheet, TextInput ,Button, Keyboard, Modal} from 'react-native'
import CheckBox from 'expo-checkbox';
import Icon  from 'react-native-vector-icons/FontAwesome5'
import ModalDropdown from 'react-native-modal-dropdown'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import useAuth from '../hooks/useAuth'
import { createPaymentaApi } from '../api/payments'
import Receipt  from '../components/Receipt'






export default function PaymentsFormScreen(props) {
    
    const { route:{params} , navigation} = props
    const { auth } = useAuth()
     //console.log("PARAMS FROM PAYMENT", params);
    const { customer , loans, loan, quotas, register} = params
    const [loanQuotas, setLoanQuotas] = useState(getQuotaNumber(loan, quotas))
    const [amount, setAmount] = useState(null)
    const [isPayLoanSelected , setIsPayLoanSelected] = useState(false)
    const [receiptVisibility, setReceiptVisibility] = useState(false)
    const [receiptDetails, setReceiptDetails] = useState({})
    const [isChecked, setIsChecked] = useState(false)
    const [selectedPrinter, setSelectedPrinter] = useState()
    const [currentQuotaNumber, setCurrentQuotaNumber] = useState([]);
    const [receiptQuotas, setReceiptQuotas] = useState([])
    

    

    //Bluetooth
    var loanNumbers = []
    loans.map(loan => {
        loanNumbers.push(loan.number.toString())
    })

    
    let initialQuotas = []
    
    
    const formik = useFormik({
        initialValues: initialValues(params.loan, loans, quotas),
        validateOnChange: false,
        onSubmit: async (values ) => {
            
            let quotaOrder = 0
            
            
            var { loanNumber, quotasNumber, payLoan, paymentMethod, amount, comment} = values;

            var totalPaid = 0

            
            
            
            
            let amortization = []
            var paymentDistribution ;

            isChecked == true ? paymentDistribution = true : paymentDistribution = false
            
            //payLoan == 'si' ? paymentDistribution = true : paymentDistribution = paymentDistribution
            amount = parseInt(amount)
            
            var i = 0
            var counter = 1
            
            while (i <  quotasNumber) {

                console.log(quotas[loanNumber][i].quota_number);
                
                if (amount > 0){
                    
                    var statusType = 'PAID'


                    //Es un abono
                    if (amount < parseInt(quotas[loanNumber][i].current_fee)){
                         statusType = 'COMPOST'
                         
                    }

                    if (statusType != 'COMPOST') {
                        amortization.push({
                            quota_number: quotas[loanNumber][i].quota_number,
                            date: ( () => {
                                //Date
                                const date = new Date().getDate()
                                const month = new Date ().getMonth() + 1
                                const year = new Date().getFullYear()
                                
                                //Time
                                const hour = new Date().getHours()
                                var minute = new Date().getMinutes()
                                minute < 10 ? minute = "0" + minute : minute = minute
                                var dayTime = hour >= 12 ? 'PM' : 'AM'
            
                                const fullDate = `${date}/${month}/${year}`//  ${hour}:${minute} ${dayTime}`
                                return fullDate.toString()
                            })(),
                            amount: parseInt(quotas[loanNumber][i].current_fee),
                            quotaId: quotas[loanNumber][i].amortization_id,
                            totalPaid: parseInt(quotas[loanNumber][i].current_fee),
                            statusType,
                            mora: quotas[loanNumber][i].mora,
                            paid: statusType == 'PAID' ? true: false,
                            order: ++quotaOrder
                        })    
                        totalPaid += parseInt(quotas[loanNumber][i].current_fee)
                        amount -= quotas[loanNumber][i].current_fee
                        
                        if (counter == parseInt(quotasNumber)){
                            
                            if (paymentDistribution == true) {
                                
                                let x = i + 1
                                
                                while (amount != 0 ){
                                    if (!isEmpty(quotas[loanNumber][x])){
                                    // //console.log(quotas[loanNumber][x]);
                                    if (amount >=  quotas[loanNumber][x].current_fee) { 
                                        statusType = 'PAID'
                                        console.log("NO ME DIGAS", quotas[loanNumber][x]);
                                        amortization.push({
                                            quota_number: quotas[loanNumber][x].quota_number,
                                            date: ( () => {
                                                //Date
                                                const date = new Date().getDate()
                                                const month = new Date ().getMonth() + 1
                                                const year = new Date().getFullYear()
                                                
                                                //Time
                                                const hour = new Date().getHours()
                                                var minute = new Date().getMinutes()
                                                minute < 10 ? minute = "0" + minute : minute = minute
                                                var dayTime = hour >= 12 ? 'PM' : 'AM'
                            
                                                const fullDate = `${date}/${month}/${year}`//  ${hour}:${minute} ${dayTime}`
                                                return fullDate.toString()
                                            })(),
                                            amount: parseInt(quotas[loanNumber][x].current_fee),
                                            quotaId: quotas[loanNumber][x].amortization_id,
                                            totalPaid: parseInt(quotas[loanNumber][x].current_fee),
                                            statusType,
                                            mora: quotas[loanNumber][x].mora,
                                            paid: statusType == 'PAID' ? true: false,
                                            order: ++quotaOrder
                                        })    

                                        totalPaid += parseInt(quotas[loanNumber][i].current_fee)
                                        amount -= parseInt(quotas[loanNumber][x].current_fee)    
                                        

                                    }else {
                                        statusType = 'COMPOST' 
                                        console.log("NO ME DIGAS", quotas[loanNumber][x]);
                                        amortization.push({
                                            quota_number: quotas[loanNumber][x].quota_number,
                                            date: ( () => {
                                                //Date
                                                const date = new Date().getDate()
                                                const month = new Date ().getMonth() + 1
                                                const year = new Date().getFullYear()
                                                
                                                //Time
                                                const hour = new Date().getHours()
                                                var minute = new Date().getMinutes()
                                                minute < 10 ? minute = "0" + minute : minute = minute
                                                var dayTime = hour >= 12 ? 'PM' : 'AM'
                            
                                                const fullDate = `${date}/${month}/${year}`//  ${hour}:${minute} ${dayTime}`
                                                return fullDate.toString()
                                            })(),
                                            amount: parseInt(quotas[loanNumber][x].current_fee),
                                            quotaId: quotas[loanNumber][x].amortization_id,
                                            totalPaid: amount,
                                            statusType,
                                            mora: quotas[loanNumber][x].mora,
                                            paid: statusType == 'PAID' ? true: false,
                                            order: ++quotaOrder
                                        })  
                                        totalPaid += amount
                                        amount = 0
                                        
                                    }

                                }else {
                                     //console.log('Te restan', amount);
                                    
                                    amount = 0
                                }

                                    x++
                                }
                                
                               
                                
                                //amount -= quotas[loanNumber][i].current_fee 

                            }else {
                                 //console.log('Te restan RD$', amount);
                            }
                        }else {
                             //console.log('Te restan RD$', amount);
                            
                        }
                        
                    } else {

                        paymentDistribution = true
                         //console.log('here');
                        
                        if (paymentDistribution == true ){
                        amortization.push({
                            //quota_number: ,
                            date: ( () => {
                                //Date
                                const date = new Date().getDate()
                                const month = new Date ().getMonth() + 1
                                const year = new Date().getFullYear()
                                
                                //Time
                                const hour = new Date().getHours()
                                var minute = new Date().getMinutes()
                                minute < 10 ? minute = "0" + minute : minute = minute
                                var dayTime = hour >= 12 ? 'PM' : 'AM'
            
                                const fullDate = `${date}/${month}/${year}`//${hour}:${minute} ${dayTime}`
                                return fullDate.toString()
                            })(),
                            quota_number: quotas[loanNumber][i].quota_number,
                            amount: parseInt(quotas[loanNumber][i].current_fee),
                            quotaId: quotas[loanNumber][i].amortization_id,
                            totalPaid: amount,
                            statusType,
                            mora: quotas[loanNumber][i].mora,
                            paid: statusType == 'PAID' ? true: false,
                            order: ++quotaOrder
                        })    

                        totalPaid += amount
                        amount -= quotas[loanNumber][i].current_fee

                        } else {
                             //console.log('Te restan RD$' , amount);
                        }
                        
                    }

                    
                   // parseInt(amount) - parseInt(quotas[loanNumber][i].current_fee));
                
                }
                   ++i
                   counter++
                
            }

            var data = {}
            
            data.payment = {
                loanId: (function(){

                    var result = ""

                    loans.map( item => {
                        if (item.number.toString() == loanNumber){
                            result = item.loanId.toString()
                        }
                    })
                    return result
                })(),
                ncf: "",
                customerId: params.customer_id,
                paymentMethod,
                paymentType: (function(){
                    switch (paymentMethod) {
                        case "Efectivo":
                            paymentMethod = 'CASH'
                            break;
                        case "Transferencia":
                            paymentMethod = 'TRANSFER'
                            break;
                        case "Cheque": 
                            paymentMethod = 'CHECK'
                            break;
                        default:
                            break;
                    }

                    return paymentMethod
                })(),
                createdBy: auth.login,
                lastModifiedBy: auth.login,
                employeeId: auth.employee_id,
                outletId: auth.outlet_id,
                comment : comment,
                registerId: register.register_id,
                payOfLoan: payLoan == 'si' ? true : false,
            }   

            data.amortization = amortization
            console.log(amortization);
            setReceiptQuotas(amortization)
            

            
            const response = await createPaymentaApi(data)
            
             //console.log("Receipt", response);
            if (response){
                setReceiptDetails({
                    loanNumber,
                    login: auth.login,
                    outlet: auth.name,
                    rnc: auth.rnc,
                    section: response.loanDetails?.section,
                    receiptNumber: response.receipt?.receipt_number,
                    paymentMethod: data.payment.paymentMethod,
                    outletId: auth.outlet_id,
                    firstName: params.first_name, 
                    lastName: params.last_name,
                    amortization: data.amortization,
                    quotaNumbers: ( () => {
                        let result = []
                        data.amortization.map((quota, index) => {
                            result.push(quotas[loanNumber][index].quota_number.toString())
                        })

                        return result

                    })(),
                    date: ( () => {
                        //Date
                        const date = new Date().getDate()
                        const month = new Date ().getMonth() + 1
                        const year = new Date().getFullYear()
                        
                        //Time
                        const hour = new Date().getHours()
                        var minute = new Date().getMinutes()
                        minute < 10 ? minute = "0" + minute : minute = minute
                        var dayTime = hour >= 12 ? 'PM' : 'AM'
    
                        const fullDate = `${date}/${month}/${year}  ${hour}:${minute} ${dayTime}`
                        return fullDate.toString()
                    })()

                })
                
                setReceiptVisibility(true)    
                
            }
            
        }
    })



    return (
        <View style={styles.selectItemContainer}>
            <ScrollView >
            <View style={styles.formGroup}>
                <Text>Número de Préstamo</Text>
                <SelectItem
                formik = {formik}
                options={loanNumbers}
                defaultVal={formik.values.loanNumber}
                fieldKey='loanNumber'
                quotas={quotas}
                setLoanQuotas={setLoanQuotas}
                //loans={loans}
                />
            </View>
            <View style={styles.formGroup}>
                <Text >Número de Cuotas</Text>
                <SelectItem
                formik = {formik}
                options={loanQuotas}
                defaultVal={formik.values.quotasNumber}
                fieldKey='quotasNumber'
                quotas={quotas}
                //loans={loans}
                />
            </View>
            <View style={styles.formGroup}>
                <Text>Saldar Préstamo</Text>
                <SelectItem
                disabled={false}
                formik = {formik}
                options={['si' , 'no']}
                defaultVal={formik.values.payLoan}
                fieldKey='payLoan'
                quotas={quotas}
                />
            </View>
            <View style={styles.formGroup}>
                <Text>Tipo de Pago</Text>
                <SelectItem
                formik = {formik}
                options={['Efectivo', 'Cheque', 'Transferencia']}
                defaultVal={formik.values.paymentMethod}
                fieldKey='paymentMethod'
                />
            </View>
            <View style={styles.formGroup}>
                <Text>Pagar</Text>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                    style={styles.textInput}
                    placeholder='RD$'
                    value={formik.values.amount}
                    onChangeText={text => formik.setFieldValue('amount', text)}
                    fieldKey='amount'
                    />
                    <Text style={{textAlignVertical: 'bottom', color:'grey', marginLeft: 5, paddingBottom: 5}}>$RD</Text>
                </View>
            </View>
            <View style={styles.formGroup}>
                <Text>Comentario</Text>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                    style={{...styles.textInput, width: "100%", height: 70}}
                    multiline
                    placeholder='Ecribe un Comentario'
                    numberOfLines={4}
                    value={formik.values.comment}
                    onChangeText={text => formik.setFieldValue('comment', text)}
                    fieldKey='commment'
                    />
                </View>
            </View>
            <View style={{...styles.formGroup, flexDirection: 'row'}}>
               <CheckBox
                value={isChecked}
                onValueChange={setIsChecked}
               />
                <Text style={{fontSize: 12, marginLeft: 10}}>Aplicar monto restante a la siguiente cuota</Text>
            </View>
            <View style={styles.formGroup}>
                <Button title="Pagar" onPress={formik.handleSubmit}/>
            </View>
            </ScrollView>
            <Receipt 
             receiptDetails={receiptDetails} 
             receiptVisibility={receiptVisibility}
             quotas={receiptQuotas}
             navigation={navigation}

            />
        </View>
    )
}


var balance = 0;
function SelectItem(props){


    const { defaultVal,disabled, options, formik, fieldKey, setLoanQuotas, loans, quotas } = props
    

    return (
        
            <ModalDropdown
            style={styles.selectItem}
            dropdownStyle={styles.selectItemOptions}
            dropdownTextStyle={styles.selectItemOptionsText}
            disabled={disabled}
            onSelect={(index, value) => {
                
                switch (fieldKey) {
                    case "loanNumber":
                        setLoanQuotas(getQuotaNumber(value, quotas))
                        formik.setFieldValue(fieldKey, value)
                        formik.setFieldValue('quotasNumber' , '1')
                        formik.setFieldValue('payLoan', 'no') 
                        //balance = getQuotaAmount(value, loans);
                        
                        formik.setFieldValue('amount' , getAmount("1", value, quotas))

                        break;
                     case "quotasNumber":    
                        formik.setFieldValue(fieldKey, value) 
                        let payment = 0;
                        //payment = getQuotaAmount(formik.values.loanNumber, loans) * value
                        formik.setFieldValue('amount' , getAmount(value, formik.values.loanNumber, quotas))
                        break;
                     case "payLoan":
                        formik.setFieldValue(fieldKey, value) 
                         
                        
                        if (value == "si") {
                            formik.setFieldValue('quotasNumber', getQuotaNumber(formik.values.loanNumber, quotas).length - 1)
                            formik.setFieldValue('amount', getAmount(quotas[formik.values.loanNumber].length , formik.values.loanNumber, quotas)) 
                        }else {
                            formik.setFieldValue('quotasNumber' , '1')
                            formik.setFieldValue('amount', getAmount(1, formik.values.loanNumber, quotas)) 
                        }
                        break;    
                    default:
                        formik.setFieldValue(fieldKey, value)
                        break;
                }

            }}
            options={options}
            >

                <View style={{flexDirection: 'row', width: 220}}>
                    <Text style={styles.defaultSelectItem}>{defaultVal}</Text> 
                    <Text style={styles.defaultSelectIcon}>< Icon style={{marginLeft: 60}} size={14} color="#808080" name="sort-down"></Icon></Text>      
                </View>
        
            </ModalDropdown>
        
    )
}


const  initialValues = (loan, loans, quotas) => {
    //loan=undefined;
    
    let i = 0;
    let quotaAmount = getAmount("1", loan, quotas)

    return {
        loanNumber: loan || "Seleccione un préstamo",
        quotasNumber: loan && "1" || "Seleccione cantidad de Cuotas",
        paymentMethod: 'Efectivo',
        payLoan: 'no',
        amount: quotaAmount,
        comment: ""
    }
}


function getQuotaNumber(loan, quotas){
    
    var i = 1;
    var result = []

    quotas[loan].map( item => {
        result.push(i.toString())
        i++
    })

    return result
}


function getAmount(number, loan, quotas){
    
    
    let i =0;
    let amount = 0;

    while (i < number) {
        
        amount += parseInt(quotas[loan][i].current_fee) 
        i++
    }

    //let amount = parseInt(loan.balance) / parseInt(loan.quotasNum)
    
    return amount.toString()
}


const styles = StyleSheet.create({

    selectItemContainer: {
        paddingHorizontal: 40,
        backgroundColor: 'white',
        paddingVertical: 40,
        height: 600,
        flex: 1
    },

    formGroup: {
        paddingVertical: 10
    },

    selectItem: {
        //alignSelf: 'center',
        marginTop: 5,
        height: 20,
        borderWidth: 1,
        borderColor: '#D1D7DB',
        width: "100%",
        height: 40,
        paddingHorizontal: 15,
        borderRadius: 5,
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingBottom: 0
    },

    selectItemOptions: {
        width: "75%",
        paddingTop: 0,
        borderWidth: 1
    },

    selectItemOptionsText: {
        width: "100%",
        fontSize: 16,
        textAlign: 'center'
    },

    defaultSelectItem: {
        fontSize: 15,
        color: '#545452',
        paddingVertical: 9,
        width: 240
    },

    defaultSelectIcon: {
        alignSelf: 'center',
        paddingLeft: 50,
        width: "100%",
        
    },

    textInput:  {
        marginTop:5,
        height: 20,
        borderWidth: 1,
        borderColor: '#D1D7DB',
        width: "90%",
        height: 40,
        paddingHorizontal: 15,
        borderRadius: 5,
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingBottom: 0
    }
})