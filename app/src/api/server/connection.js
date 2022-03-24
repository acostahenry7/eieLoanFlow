export const CONNECTION_STORAGE = "connection"
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function saveConnectionUrlApi(url){
    try {
        
        await AsyncStorage.setItem(CONNECTION_STORAGE, url.toString())

    } catch (error) {
        console.log(error);
    }
}

export async function getSavedConnectionUrlApi(){
    try {

        const response = await AsyncStorage.getItem(CONNECTION_STORAGE)
        return response

    } catch (error) {

        console.log(error);
    }
}