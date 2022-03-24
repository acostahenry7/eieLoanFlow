import { getSavedConnectionUrlApi } from './server/connection'

export async function getReceiptsByLoanApi(data){

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }

    try {
        
        const url = `${await getSavedConnectionUrlApi()}/receipt/payments`
        const response = await fetch(url, options)
        const result = await response.json()
        return result
        
    } catch (error) {
        console.log(error);
        throw error
    }
}


export async function getAmortizationByPaymentApi(data){

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }    

    try {
        
        const url = `${await getSavedConnectionUrlApi()}/receipt/amortization`
        const response = await fetch(url, options)
        const result = await response.json()
        return result
        
    } catch (error) {
        console.log(error);
        throw error
    }
}