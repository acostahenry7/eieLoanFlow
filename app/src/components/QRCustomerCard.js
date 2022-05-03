import React, {useState} from 'react'
import { View, Text, TouchableWithoutFeedback , StyleSheet} from 'react-native'
import { Card } from 'react-native-elements'
import {capitalize, extractIconText, formatFullName} from '../utils/stringFuctions'
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/FontAwesome5'
import QRPreview from './QRPreview'
import { WINDOW_DIMENSION } from '../utils/constants'

export default function QRCustomerCard(props) {


    const { customer, navigation } = props
    const [visibility, setVisibility] = useState(false);
    const [ currentCustomer, setCurrentCustomer] = useState({})

    console.log(customer);
    return (
        
        <View >
        <QRPreview customer={currentCustomer} visibility={visibility != undefined ? visibility : false} setVisibility={setVisibility}/>
        <Card containerStyle={{padding: 0}}>
            <View style={{flexDirection: 'column'}}>
            <View  
            title="card"
            style={{
                    //backgroundColor: 'green',
                    flex:1, 
                    width: "100%",
                    flexDirection:'row', 
                    flexWrap: 'wrap',
                    paddingVertical: 5,
                    marginTop: 15,
                    paddingLeft: 15,
                    paddingBottom: 10
                }}>
                <View
                style={{
                    backgroundColor: 'skyblue',
                    padding: 10,
                    width: 70,
                    height: 70,
                    borderRadius: 50
                }}
                >
                    <Text 
                    style={{
                        fontSize: 30,
                        color: 'white',
                        textAlign: 'center'
                        }}>
                            {extractIconText(formatFullName(customer.first_name, customer))}
                        </Text>   
                </View>
                <View 
                style={{
                  justifyContent: 'center',
                  paddingLeft: 15,
                  //width: 250,
                  //backgroundColor: 'green'
                  }}> 
                    <Text 
                    style={{
                        fontWeight: 'bold',
                        fontSize: 15,
                        width: 210,
                        //backgroundColor : 'green'
                    }}>
                        {formatFullName(customer.first_name, customer)}
                    </Text>
                    <Text   style={{fontSize: 11}}>{customer.identification}</Text>
                </View>
                    <View style={{alignContent: 'center'}}>
                        <Menu>
                            <MenuTrigger>
                                <Icon 
                                name='ellipsis-v'
                                style={styles.menuIcon}
                                />
                            </MenuTrigger>
                            <MenuOptions customStyles={{optionText: {fontSize: 15}}} optionsContainerStyle={{marginLeft: 6}}>
                                {customer.qr_code == null ? <MenuOption style={styles.menuOption} onSelect={() => navigation.navigate('QRPreview', customer)} text='Generar QR'/> : undefined}
                                {customer.qr_code == null ? undefined :  <MenuOption style={styles.menuOption} text='Visualizar QR' onSelect={() => {
                                    setVisibility(true)
                                    setCurrentCustomer(customer)
                                    }} 
                                />}
                                { customer.qr_code == null ? undefined :
                                <MenuOption 
                                style={styles.menuOption} 
                                onSelect={() => {
                                        setIsOpenedComment(!isOpenedComment) 
                                        setIsCustomer(false)
                                    }} 
                                text='Imprimir QR'/>}
                            </MenuOptions>
                        </Menu>
                    </View>
                <View style={{
                      //backgroundColor: 'grey',
                      flexDirection: 'row',
                      paddingLeft: 60,
                      paddingBottom: 7
                    }}>
                </View>
            </View>
          </View>
        </Card>
    </View>
    )
}


const styles = StyleSheet.create({

    modalContainer: {
        height: "100%",
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingTop: 50
    },

    modalView: {
        
        marginTop: 'auto',
        marginBottom: 'auto',
        marginHorizontal: 15, 
        backgroundColor: "white",
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    formGroup: {
        paddingVertical: 10
    },

    textInput:  {
        marginTop:5,
        height: 20,
        borderWidth: 1,
        borderColor: '#D1D7DB',
        width: 330,
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 3,
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingBottom: 0
    },

     container: {
         paddingTop: 15,
         //paddingHorizontal: 25
     },

     searchInput: {
        width: "79%",
        height: 40,
        backgroundColor: '#D3DBE1',
        paddingHorizontal: 15,
        borderRadius: 10
     },

     infoContent: {
         flexDirection: 'row',
         alignItems: 'center'
     },

     icon: {
        backgroundColor: 'skyblue',
        width: 70,
        height: 70,
        borderRadius: 50
     },

     iconText: {
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: 30,
        color: 'white',
        textAlign: 'center'
     },

     customerInfoContent: {
        alignContent: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
        marginRight: 15,
        width: 100
        //width: WINDOW_DIMENSION.width *0.2,
     },

     customerInfoName: {
        fontWeight: 'bold',
        fontSize: 17
     },
     
     spinner: {
         marginTop: 40
     },
     error: {
        color: '#b25353',
        fontSize: 15,
        marginTop: 15,
        textAlign: 'center'
    },
    menuOption: {
        paddingVertical: 9,
        paddingHorizontal: 10,
        fontSize: 25
    },

    menuIcon: { 
        fontSize: 18, 
        width: 33, 
        paddingHorizontal: 13, 
        paddingVertical: 6, 
        borderRadius: 50
    }
})