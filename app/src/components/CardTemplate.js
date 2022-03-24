import { View, Text, StyleSheet } from 'react-native'
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/MaterialIcons'  
import React from 'react'

export default function CardTemplate(props) {

    const { mainText, mainTitle, secondaryText, secondaryTitle, menuOptions, actionParam, actionParam2 } = props

  return (
    <View style={styles.cardContainer}>
        <View style={styles.cardRow}>
            <View style={{...styles.section, marginLeft: 0, width: '30%'}}>
                <Text style={styles.title}>{mainTitle}</Text>
                <Text style={styles.mainText}>{mainText}</Text>
            </View>
            <View style={{...styles.section, width: '58%'}}>
                <Text style={styles.title}>{secondaryTitle}</Text>
                <Text style={styles.secondaryText}>{secondaryText}</Text>
            </View>
            <View>
            <Menu>
                <MenuTrigger>
                    <Icon 
                    name='more-vert'
                    style={{top: 0, fontSize: 24, color: 'black', paddingHorizontal: 13, paddingVertical: 6, borderRadius: 50}}
                    />
                </MenuTrigger>
                <MenuOptions customStyles={{optionText: {fontSize: 15}}} optionsContainerStyle={{marginLeft: 6}}>

                    {
                        menuOptions?.map( (option, index) => (
                            <MenuOption
                                key={index}
                                text={option.name}
                                style={styles.menuOption} 
                                onSelect={async () => {
                                    console.log(option);
                                    option.action((actionParam))
                                }}  
                            />
                        ))
                    }
                </MenuOptions>
            </Menu>
            </View>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({

    cardContainer: {
        elevation: 3,
        marginTop: 10,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10,
        marginHorizontal: 1,
        marginBottom: 2
    },

    section: {
        marginLeft: 10
    },

    cardRow: {
        flexDirection: 'row',

    },

    title: {
        fontWeight: 'bold'
    },

    mainText: {

    },

    secondaryText: {

    },

    menuOption: {
        paddingVertical: 9,
        paddingHorizontal: 10,
        fontSize: 25
    },

})