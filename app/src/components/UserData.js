import React from 'react'
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import useAuth from '../hooks/useAuth'
import {extractIconText} from '../utils/stringFuctions'

export default function UserData(props) {

    const {logout, auth} = useAuth()
    const { navigation } = props


    const { login, first_name, last_name } = auth

    return (
        
        <ScrollView style={{paddingTop: 30, paddingBottom: 100}}>
            <Text style={styles.menuDivisionTitle}>Cuenta</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 30, paddingHorizontal: 15}}>
                <View>
                    <Text style={{
                        padding: 12,
                        fontSize: 25,
                        textAlign: 'center',
                        height: 60,
                        backgroundColor: '#00ced150', 
                        width: 60, 
                        borderRadius: 50,
                        fontWeight: 'bold',
                        marginRight: 10
                        }}>
                        {extractIconText(first_name + " " + last_name)}
                    </Text>
                </View>
                <View>
                    <Text style={{fontWeight: 'bold'}}>{login}</Text>
                    <Text>{first_name + " " + last_name}</Text>
                </View>
            </View>
            <View>
                <Text style={styles.menuDivisionTitle}>Configuración de la Cuenta</Text>
                <UserDataMenuItem
                field={'Contraseña'}
                icon={'lock'}
                />
            </View>
            <View style={{marginTop: 20}}>
                { auth.login == 'admin' ? <AdminManagement navigation={navigation}/> : undefined}
            </View>
            <View style={{marginTop: 20}}>
                <Text style={styles.menuDivisionTitle}>Dispositivos</Text>
                <UserDataMenuItem
                field={'Añadir Impresora'}
                navigation={navigation}
                nextScreen={'Printers'}
                icon={'print'}
                />
            </View>
            <View style={{marginTop: 20}}>
                <Text style={styles.menuDivisionTitle}>Reportes</Text>
                <UserDataMenuItem
                field={'Prestamos recientes'}
                navigation={navigation}
                nextScreen={'Printers'}
                icon={'update'}
                />
                <UserDataMenuItem
                field={'Cobros del día'}
                navigation={navigation}
                nextScreen={'Printers'}
                icon={'money'}
                />
                <UserDataMenuItem
                field={'Atrasos'}
                navigation={navigation}
                nextScreen={'Printers'}
                icon={'feedback'}
                />
                <UserDataMenuItem
                field={'Ruta de cobros'}
                navigation={navigation}
                nextScreen={'Printers'}
                icon={'alt-route'}
                />
            </View>
            <Text style={{color: 'red', textAlign: 'center', marginTop: 20, marginBottom: 100}} onPress={logout}>Cerrar Sesión</Text>
        </ScrollView>
    )
}



function UserDataMenuItem({icon, field, nextScreen, navigation }){

    return (
        <View
        style={styles.menuDivision}
        >   
            <Icon 
             name={icon} 
             size={30} 
             style={{marginRight: 10, marginTop: -4}}
             />
            <Text style={{width: '100%'}} onPress={() => navigation.navigate('Printers')}>{field}</Text>
        </View>
    )
}

function AdminManagement({navigation}){
    console.log(navigation);
    return (
        <View>
            <Text style={styles.menuDivisionTitle}>Gestión Administrativa</Text>
            <TouchableWithoutFeedback
            onPress={() => navigation.navigate('QRManagement')}
            style={styles.menuDivision}
            >
                <Icon
                 name="qr-code"
                 size={30}
                 style={{marginRight: 10, marginTop: -4}}
                />
                <Text>Administrar códigos QR</Text>
            </TouchableWithoutFeedback>
            <View
            style={styles.menuDivision}
            >
                <Icon
                 name="settings-remote"
                 size={30}
                 style={{marginRight: 10, marginTop: -4}}
                />
                <Text>Configurar la Conexión</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    menuDivisionTitle: {
        color: '#1e90ff', 
        fontWeight: 'bold',
        paddingHorizontal: 15,
        marginBottom: 12
    },

    menuDivision: {
        paddingVertical: 18,
        paddingHorizontal: 15,
        width: '100%',
        //borderBottomWidth: 1,
        borderColor: '#80808020',
        flexDirection: 'row'
    },

    menuDivisionText: {
        fontWeight: 'bold'
    }
})