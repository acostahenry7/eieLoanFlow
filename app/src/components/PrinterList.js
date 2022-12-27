import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';


export default function PrinterList(props) {

  return (
    <FlatList
      data={printers}  
    >
        
    </FlatList>
  );
}
