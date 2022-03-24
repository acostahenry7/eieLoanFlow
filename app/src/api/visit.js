import { getSavedConnectionUrlApi } from './server/connection'

export async function createVisitApi(data){

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }

    try {
        
        const url  = `${await getSavedConnectionUrlApi()}/visit`
        const response = await fetch(url, options)
        const result  = await response.json()
        console.log("holaaaaa   ",result);
        return result

    } catch (error) {
        console.log(error);        
    }
}