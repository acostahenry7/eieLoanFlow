import React from 'react'
import { View, Text, Modal, Button } from 'react-native'
import { printByBluetooth } from '../api/bluetooth/Print';
import {Alert} from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons'


export default function Receipt(props) {

    const { receiptDetails, receiptVisibility, setReceiptVisibility, quotas, navigation } = props

    receiptDetails.amortization = [...quotas]

    console.log("From receipt", receiptDetails);

  return (
    <Modal 
        transparent={true}
        animationType="fade"
        visible={receiptVisibility}
        style={{height: 50, backgroundColor: 'rgba(255, 255, 255, 0)'}}
        >
            <View style={{height: '100%', backgroundColor: 'rgba(0,0,0, 0.3)'}}>
            <View style={{backgroundColor: 'white', marginTop: 'auto', marginBottom: 'auto', marginHorizontal: 20, shadowColor: "#000",
                shadowOffset: {
                width: 0,
                height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                paddingVertical: 20,
                paddingHorizontal: 15
                }}>
                    <View>
                        <Icon name="close" size={25} onPress={() => setReceiptVisibility(false)} style={{textAlign: 'right'}}/>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold'}}>{receiptDetails.outlet}</Text>
                        <Text style={{fontWeight:'bold'}}>RNC: {receiptDetails.rnc}</Text>
                        <Text style={{ marginTop: 10, backgroundColor: 'black', width: "100%", color: 'white', textAlign: 'center', fontWeight: 'bold'}}>RECIBO</Text>
                    </View>
                    <View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{width: "50%"}}>
                                <View >
                                    <Text style={{fontWeight: 'bold'}}>Número Recibo:</Text>
                                    <Text>{receiptDetails?.receiptNumber}</Text>
                                </View>
                                <View style={{marginTop: 10}}>
                                    <Text style={{fontWeight: 'bold'}}>Préstamo:</Text>
                                    <Text>{receiptDetails?.loanNumber}</Text>
                                </View>
                                <View style={{marginTop: 10}}>
                                    <Text style={{fontWeight: 'bold'}}>Tipo de Pago:</Text>
                                    <Text>{receiptDetails?.paymentMethod}</Text>
                                </View>
                            </View>
                            <View style={{width: "50%"}}>
                                <View>
                                    <Text style={{fontWeight: 'bold'}}>Fecha de Pago:</Text>
                                    <Text>{receiptDetails?.date}</Text>
                                </View>
                                <View style={{marginTop: 10}}>
                                    <Text style={{fontWeight: 'bold'}}>Cliente:</Text>
                                    <Text>{receiptDetails?.firstName + " " + receiptDetails?.lastName}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={{width: "100%", borderWidth: 1, textAlign: 'center', fontWeight: 'bold'}}>Transacciones</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{width: "17%"}}>Cuota:</Text>
                                <Text style={{width: "30%"}}>Fecha cuota:</Text>
                                <Text style={{width: "20%"}}>Monto:</Text>
                                <Text style={{width: "17%"}}>Mora:</Text>
                                <Text style={{width: "20%"}}>Pagado:</Text>
                            </View>
                            {
                                quotas?.map( (quota, index) => (
                                    <View  key={index} style={{flexDirection: 'row'}}>
                                        <View style={{width: "17%"}}>
                                            <Text style={{fontWeight: 'bold'}}>{quotas[index].quota_number}</Text>
                                        </View>
                                        <View style={{width: "30%"}}>
                                            <Text>{quota.date}</Text>
                                        </View>
                                        <View style={{width: "20%"}}>
                                            <Text>{quota.amount}</Text>
                                        </View>
                                        <View style={{width: "17%"}}>
                                            <Text>{quota.mora}</Text>
                                        </View>
                                        <View style={{width: "20%"}}>
                                            <Text>{quota.totalPaid}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    </View>                            
                    <View style={{marginTop: 15, flexDirection: 'row' , bottom: 0}}>
                        <Text onPress={() => navigation.navigate('Payments', {loanNumber: receiptDetails.loanNumber})} style={{width: "50%", textAlignVertical: 'center', color: 'blue'}}>Volver a Cobros</Text>
                        <View style={{width: "50%"}}>
                            <Button style={{marginLeft: 'auto', right: 0}}  title='Imprimir' onPress={ async () => {
                                    
                                    const response = await printByBluetooth(receiptDetails)
                                        console.log("Pay", response);   
                                        if (response == true){
                                            navigation.navigate('Payments', {loanNumber: receiptDetails.loanNumber})
                                        }else {
                                            Alert.alert("Error de Impresión", "Verifique que la impresora no esté ihnibida e inténtelo nuevamente.")
                                        }
                                    
                                }}/>
                        </View>
                    </View>
            </View>
            </View>
    </Modal>
  )
}