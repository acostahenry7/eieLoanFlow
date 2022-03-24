import {BluetoothManager,BluetoothEscposPrinter,BluetoothTscPrinter} from 'react-native-bluetooth-escpos-printer';
import RNZebraBluetoothPrinter from 'react-native-zebra-bluetooth-printer';
import {Alert} from "react-native"
import { getSavedPrintersApi } from './Printers';



// Bluetooth Printing API
export async function printByBluetooth(object) {

    let printedStatus = false

            const blueToothEnabled = await BluetoothManager.isBluetoothEnabled()

            if (blueToothEnabled){
                const response = await generateReceipt(object)
                console.log(response);
                printedStatus = response        
            }else {
                await BluetoothManager.enableBluetooth()

                const response = await generateReceipt(object)
                console.log(response);
                printedStatus = response    

            }
        
        
        
    

    return  printedStatus

}




//This function generate the Receipt
async function generateReceipt(object){

    console.log(object.amortization);

    const response = await getSavedPrintersApi()
   const printerSerial = response[0].address
    

    let printedStatus = false
    let labelLength = (object.amortization.length * 40) + 700

    console.log(labelLength);

    let date = (() => {
        //Date
        const date = new Date().getDate()
        const month = new Date ().getMonth() + 1
        const year = new Date().getFullYear()

        const fullDate = `${date}/${month}/${year}`
        return fullDate.toString()
    })()

    let receiptHeader = "^FO40,620,^ADN,26,12^FDCuota  Fecha Cuota  Monto   Mora  Pagado^FS"
    let receiptDetail = []
    let bodyItem=[]
    let receiptBody = []

    let quotasQuantity = object.amortization.length
    console.log("Cantidad de Cuotas", quotasQuantity);

    let width = 40
    let top = 645
    var noteHeight

    object.amortization.map( (entry, index) => {
        noteHeight = 0
        receiptDetail.push(`^FO${width},${top},^ADN,26,12^FD${entry.quota_number}     ${date}    ${Math.trunc(entry.amount)+".00"}  ${entry.mora}  ${Math.trunc(entry.totalPaid)+".00"}^FS`)
        top += 20

        if (index + 1 == quotasQuantity){
            console.log("from valitadion quantity");
            noteHeight = top + 40
            console.log(noteHeight);
        }
    })



    receiptDetail = receiptDetail.join()

    let zpl = `^XA
                ^LL${labelLength}
                ^FO35,60^IME:BANNER.GRF^FS
                ${zTitle("PRINCIPAL", 230, 265)}
                ${zTitle("RNC: 101998776", 200, 290)}
                ${zTitle("Numero Recibo",40, 350)}
                ${zTitle(object.receiptNumber, 40,375, 25, 30)}
                ${zTitle("Fecha: ",40, 420 )}
                ${zTitle(object.date, 100,420)} 
                ${zTitle("Zona: ",40, 460)}
                ${zTitle(object.section, 100,460)}   
                ${zTitle("Nombre Cliente: ",40, 500)}
                ${zTitle(object.firstName + " " + object.lastName, 40,525)}
                ${zSection("Transacciones", 200, 585)}
                ${receiptHeader}   
                ${receiptDetail}
                ${zTitle("Nota: no somos responsables de dindero pagado sin recibo", 40,noteHeight,18, 20)}
                ^XZ`

    //let zpl = `!0 200 200 210 1 TEXT 4 0 30 40 Hello World FORM PRINT`

    // console.log(object);
    // console.log(zpl)

    //const connected = await RNZebraBluetoothPrinter.connectDevice(printerSerial)
    
    //if (connected ) {
        var result;
        try {
            result = await RNZebraBluetoothPrinter.print(printerSerial, zpl)    
        } catch (error) {
            console.log(error);
        }
        
        
    //}
    

    // if (connected) {
    //     await RNZebraBluetoothPrinter.print(printerSerial, zpl)
    // }
    // RNZebraBluetoothPrinter.print(printerSerial,zpl).then((res) => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log("Error is", err);
    // })

//     await RNZebraBluetoothPrinter.connectDevice(printerSerial)
//   .then(async res => await RNZebraBluetoothPrinter.print(printerSerial, zpl))
//   .catch(err => console.log(`Problems while connecting to printer: ${err}`))

    printedStatus = result


    return printedStatus
}



//Section divisor
function zSection(title, x , y) {

    x = x?.toString()
    y = y?.toString()

    return `
    ^FO35,${y-5}^GB500,25,2^FS
    ^FO${x},${y},^ADN,26,11^FD${title}^FS
    `
}

function zTitle(text, x, y, h, w){
    
    x = x?.toString()
    y = y?.toString()
    w = w?.toString() || "20"
    h = h?.toString() || "25"

    return `^FO${x},${y},^A0N,${h},${w}^FD${text}^FS`
}

//Text
function zText(text, x, y){

    x = x.toString()
    y = y.toString()

    return `^FO${x},${y},^ADN,26,12^FD${text}^FS`
}



