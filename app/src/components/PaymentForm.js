import React, { useState } from 'react'
import { View, Text, StyleSheet, LogBox } from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown'
import { useFormik } from 'formik'
import { TextInput } from 'react-native-gesture-handler'

export default function PaymentForm(props) {


     const { loans, initialParams } = props

     
    const formik = useFormik({
        initialValues: initialValues(initialParams),
        onSubmit: () => {

        }
    })

        let loanNumbers = []
        
        loans.map(item => {
            loanNumbers.push(item.number.toString())
             var  iterable = parseInt(item.quotasNum)

        })   
        
        
    
        const [cuotasState , setCuotas] = useState([])
        let cuotas = []

    return (
        <View style={styles.formContainer}>
            <View style={styles.formGroup}>
                <Text>Número de préstamo</Text>
                <ModalDropdown             
                style={styles.selectInput} 
                dropdownStyle={{flex: 1, width: '80%'}}
                dropdownTextStyle={{ fontSize: 18, textAlign: 'center'}}
                onSelect={(index, value) => {
                    
                    formik.setFieldValue('loanNumber', value.toString())

                    loans.map(item => {
                        console.log(item['number']  );
                        console.log(formik.values.loanNumber);  
                        if (item['number'] == parseInt(formik.values.loanNumber)){
                            console.log('hi');
                            let counter = parseInt(item['quotasNum'])
                            
                            
                            while(counter != 0){
                                cuotas.push(counter.toString())
                                counter--
                            }

                            let rsCuotas =  cuotas.reverse()
                            console.log(rsCuotas);
                            setCuotas([...rsCuotas])
                            console.log(rsCuotas[0]);
                            formik.setFieldValue('quotasNum', rsCuotas[0])

                            console.log(formik.values.quotasNum);
                            
                        }


                   })

                }}
                options={loanNumbers}>
                    <Text style={{}}>{formik.values.loanNumber}</Text> 
                </ModalDropdown>
            </View>
            <View style={styles.formGroup}>
                <Text>Cantidad de Cuotas</Text>
                <ModalDropdown 
                style={styles.selectInput} 
                dropdownStyle={{flex: 1, width: '80%'}}
                dropdownTextStyle={{ fontSize: 18, textAlign: 'center'}}
                onSelect={(index, value) => {
                    formik.setFieldValue('quotasNum', value.toString())
                }}
                options={cuotasState}>
                    <Text>{formik.values.quotasNum}</Text>
                </ModalDropdown>
            </View>
            <View style={styles.formGroup}>
                <Text>Saldar Préstamo</Text>
                <ModalDropdown 
                style={styles.selectInput} 
                dropdownStyle={{flex: 1, width: '80%'}}
                dropdownTextStyle={{ fontSize: 18, textAlign: 'center'}}
                options={['Cuota 1']}>
                    <Text style={{}}></Text>
                </ModalDropdown>
            </View>
            <View style={styles.formGroup}>
            <Text>Monto</Text>
            <TextInput
                    style={styles.input}
                    placeholder='RD$'
                />
            </View>
        </View>
    )
}


const initialValues = (object) => {
    
    return {
        loanNumber: object.loanNumber,
        quotasNum: "",
    }
}


const styles = StyleSheet.create({

    formContainer: {
        marginTop: 10
    },

    formGroup: {
        paddingTop: 20
    },

    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 5
    },

    selectInput: {
        marginTop: 5,
        borderWidth: 1,
        //backgroundColor: 'blue',
        borderRadius: 10,
        height: 40,
        fontSize: 15,
        paddingTop: 8,
        paddingHorizontal: 10
    }

})