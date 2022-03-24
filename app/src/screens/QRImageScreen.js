import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, {useEffect, useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import { createQRApi } from '../api/customers';


export default function QRImageScreen(props) {


    
    const { route : {params} } = props
    const { id, identification, first_name, last_name} = params
    const [loadingQR, setLoadingQR] = useState(false);
    const [qrValue, setQrValue] = useState("")

    useEffect(() =>{
        (async () =>{
            createQrCode()
        })()
    },[])
    
    
    
    const createQrCode = async () => {
        setLoadingQR(true)
        const response = await createQRApi(id.toString())   
        setQrValue(response.qr_code)
        setLoadingQR(false)
        console.log(response);
    }

    console.log("QR Value" ,qrValue.toString())


  return (
      <View style={styles.container}>
          {
              loadingQR != true ?
              qrValue != "" ?
              <QRCode
              size={240}
              value={qrValue}
             />
             :
              undefined
             :
             <ActivityIndicator
                size={'small'}
                color={'blue'}
             />
          }
      </View>
  );

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%',
        alignItems: 'center',
        paddingTop: 40
    }
})
