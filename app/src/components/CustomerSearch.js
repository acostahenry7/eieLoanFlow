import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'

export default function CustomerSearch({ searchStatus, setSearchValue}) {


    const onSearchValueChange = e => {
        setSearchValue(e.target.value) 
        console.log(e.target);
    }
 
    return (
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.inputItem}
            placeholder='Nombre, Cédula'
            onChangeText={text => setSearchValue(text)}
            value={searchStatus}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    inputContainer: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15
    },

    inputItem: {
        height: 40,
        backgroundColor: '#D3DBE1',
        paddingHorizontal: 15,
        borderRadius: 10
    }
})