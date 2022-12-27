import React from 'react'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu'
import { Provider } from 'react-redux'

import NavigationTab from './src/navigation/NavigationTab.js';
import { AuthProvider } from './src/contexts/AuthContext.js';
import { StatusBar } from 'react-native';
import { store } from './src/redux/store.js';


export default function App() {
  return (
      <NavigationContainer>
        <StatusBar animated={true} barStyle='light-content' backgroundColor="#4682b4"/>
        <AuthProvider>
        <Provider store={store}>
            <MenuProvider>
              <NavigationTab/>
            </MenuProvider>
        </Provider>
        </AuthProvider>
      </NavigationContainer>
    
  );
}


