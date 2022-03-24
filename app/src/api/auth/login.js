
import { getSavedConnectionUrlApi, saveConnectionUrlApi } from "../server/connection"

export async function loginApi(username, password){
    
    const data = {
        username,
        password
    }

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }


    try {
        const url = `${await getSavedConnectionUrlApi()}/login`
        const response = await fetch(url, options)
        const result = await response.json()
        return result
    } catch (error) {
        console.log(error);
        const errorKeyWords = error.toString().slice(11,33).split(" ")
        var response = {}
        console.log(errorKeyWords);
        errorKeyWords.map( keyWord => { 
            console.log(keyWord.toLowerCase());
            if (keyWord.toLowerCase() == "network" ){
                response.error = "Error al intentar conectar con el servidor Revise su conexión a internet o verifique la url de conexión." 
                response.errorCode = 1
            } 
        })
        console.log(response);
        return response
    }
}