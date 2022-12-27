import React from 'react'
import { View, Text } from 'react-native'
import LoginForm from '../components/LoginForm'
import UserData from '../components/UserData'
import useAuth from '../hooks/useAuth'

export default function AcountScreen(props) {

    const {navigation} = props
    const { auth } = useAuth()

    return (
        <View >{auth ? <UserData navigation={navigation}/>: <LoginForm navigation={navigation}/>}</View>
    )
}
