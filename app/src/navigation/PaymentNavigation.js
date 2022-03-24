import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator} from '@react-navigation/stack'
import PaymentScreen from '../screens/PaymentScreen'
import PaymentsFormScreen from '../screens/PaymentsFormScreen'
import ReceiptScreen from '../screens/ReceiptScreen'

const Stack = createStackNavigator()

export default function PaymentNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="Payments" 
            component={PaymentScreen}
            options={{
                title: 'Cobros',
            }}
            />
            <Stack.Screen 
            name="PaymentsForm" 
            component={PaymentsFormScreen}
            options={{
                title: 'Formulario de Cobro',
            }}
            />
            <Stack.Screen
             name="Receipt"
             component={ReceiptScreen}
             options={{
                 title: 'Recibos'
             }}
            />

        </Stack.Navigator>
    )
}
