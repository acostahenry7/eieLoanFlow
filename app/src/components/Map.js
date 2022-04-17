import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView,{Marker} from 'react-native-maps'
import tw from 'tailwind-react-native-classnames'
import { useSelector } from 'react-redux'
import { selectOrigin } from '../redux/slices/navSlice'
import Geolocation from '@react-native-community/geolocation';


export default function Map(props) {

  const origin = props.origin

  

  return (
      <MapView
      style={{flex: 1}}
      mapType={'standard'}
      initialRegion={{
          latitude: origin && origin.latitude || 0,
          longitude: origin && origin.longitude || 0,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
      }}
      > 
      {
        origin &&

        <Marker
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          title="Tu ubicación"
          description={origin.description}
          identifier="origin"
        />
      }
      
         
      </MapView>
  )
}
