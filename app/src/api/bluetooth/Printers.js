import {BluetoothManager,BluetoothEscposPrinter,BluetoothTscPrinter} from 'react-native-bluetooth-escpos-printer';
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {BleManager} from 'react-native-ble-plx'
import {includes, pull} from 'lodash'
import { PRINTER_STORAGE } from '../../utils/constants';
import { PermissionsAndroid } from 'react-native'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';


//import { useEffect, useState } from 'react';


//const BlueManager = new BleManager()



export async function requestLocationPermission() {
    const locationPermissionGranted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    ])

    return locationPermissionGranted
}


export async function retrievePrinters(){
    // let printers = []

    //     let permissions = await requestLocationPermission()
    //     console.log(permissions);

    //     const isBluetoothEnabled = await BluetoothManager.isBluetoothEnabled()
    //     if (isBluetoothEnabled == true){
    //         const response = await printerList()
    //         printers = response
            
    //         return printers
            
    //     }else {
    //         await BluetoothManager.enableBluetooth()
    //         const response = await printerList()
    //         printers = response

    //         return printers
    //     }

    let printers = []

    let permissions = await requestLocationPermission()
    let enabled =  await RNBluetoothClassic.isBluetoothEnabled()

        if( enabled  == false) {
                await BluetoothManager.enableBluetooth()
                const response = await printerList()
                printers = response
            
        }else {
            console.log('hi');
            const response = await printerList()
            printers = response
        }

    console.log(printers);
    return printers
}


export async function savePrinterApi(printer) {
    try {
        //const printers = await getSavedPrintersApi() || []
        const printers = []
        printers.push(printer)
        try {
            await AsyncStorage.setItem(PRINTER_STORAGE, JSON.stringify(printers))    
        } catch (error) {
            console.log(error);
        }
        
        console.log(printers);

    } catch (error) {
        throw error        
    }
}


export async function getSavedPrintersApi() {
    try {
        const response = await AsyncStorage.getItem(PRINTER_STORAGE)
        return JSON.parse(response)

    } catch (error) {
        throw error
    }
}


async function printerList(){
    
    let pairedDevices = []
    let scannedDevices = []
    let allDevices

    const pairedResponse = await  RNBluetoothClassic.getBondedDevices()
    pairedResponse.map( device => {
        pairedDevices.push({name: device.name, address: device.address})
    })

    const permissions = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({  interval: 10000, fastInterval: 5000,})
    console.log(permissions);
    if (permissions == 'enabled' || 'already-enabled'){
        const scannedResponse = await RNBluetoothClassic.startDiscovery()
        scannedResponse.map( device => {
            console.log(device.name);
            scannedDevices.push({name: device.name, address: device.address})
        })
    }




    return [...pairedDevices, ...scannedDevices ]
    
}
