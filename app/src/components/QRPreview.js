import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import React, {useEffect, useState, } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5'
import QRCode from 'react-native-qrcode-svg';



export default function QRPreview(props) {
    
    const { visibility, setVisibility, customer } = props
    const [qrValue, setQrValue] = useState("")
    
    useEffect( () => {
      (() => {
          setQrValue(customer.id)
      })()
    },[customer])


    console.log(customer);

  return (
    <Modal 
     visible={visibility}
     transparent={true}
     animationType='fade'
    >
      <View style={styles.modalView}>
        <View style={styles.modalBody}> 
              <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderTitle}>Código QR</Text>
                  <Icon style={{marginTop: 5, fontSize: 20}} name="times" onPress={ () =>  setVisibility(false)}/>
              </View>
              <View style={styles.qrContainer}>
                <QRCode
                  size={220}
                  value={JSON.stringify(customer)}
                />
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>{customer.first_name + " " + customer.last_name}</Text>
                <Text>{customer.identification}</Text>
              </View>
          </View>   
      </View>      
    </Modal>
  );
}


const styles = StyleSheet.create({

  modalView: {
    height: "100%",
    backgroundColor: "#00000030"
  },

   modalBody: {
    backgroundColor: 'white', 
    height: 400,
    padding: 10, 
    marginTop: 'auto', 
    marginBottom: 'auto', 
    marginHorizontal: 16, 
    shadowColor: 'black', 
    elevation: 5
   },

   modalHeader: {
    flexDirection: 'row', 
    justifyContent: 'center'
   },

   modalHeaderTitle: {
     textAlign: 'center',
     width: '80%',
     fontSize: 18
   },

   qrContainer: {
     alignItems: 'center',
     marginTop: 'auto',
     marginBottom: 'auto'
   }
})