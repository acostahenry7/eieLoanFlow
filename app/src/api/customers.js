
import { getSavedConnectionUrlApi } from './server/connection'

//const employeeId = 'c2ed74d8-107c-4ef2-a5fb-6d6fadea5d1b'

export async function getCustomerApi(nextUrl, employeeId){
    try {
        if(!employeeId) employeeId='0'
        const url = `${await getSavedConnectionUrlApi()}/customers/main/${employeeId}?limit=999999&offset=1`
        const response = await fetch(nextUrl || url)        
        const result = await response.json()
        return result
    } catch (error) {
        throw error
    }
}

export async function getCustomerInfo(data){

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }


    try {
        const url = `${await getSavedConnectionUrlApi()}/customers/each`
        const response = await fetch(url, options)
        const result = await response.json()

        return result

    } catch (error) {
        throw error
    }
}

export async function createQRApi(id){
    try {
        const url = `${await getSavedConnectionUrlApi()}/customers/createQR/${id}`
        const response = await fetch(url)
        const result = response.json()
        return result

    }catch(error) {
        console.log(error);
    }
}


export async function getQrApi(id) {
    try {
        const url = `${await getSavedConnectionUrlApi()}/customers/getQr/${id}`
        const response = await fetch(url)
        const result = response.json()
        return result

    }catch(error) {
        console.log(error);
    }
}

// export async function postPaymentApi(data){
//     try {
//         const url = `${getSavedConnectionUrlApi()}/payments`
//         return null
//     } catch (error) {
//         throw error
//     }
// }