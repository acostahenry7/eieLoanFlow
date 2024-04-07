import {
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { retrievePrinters } from "../api/bluetooth/Printers";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { savePrinterApi, getSavedPrintersApi } from "../api/bluetooth/Printers";
import { useFormik } from "formik";
import * as Yup from "yup";
import { isEmpty } from "lodash";
import { WINDOW_DIMENSION } from "../utils/constants";
import { printByBluetooth } from "../api/bluetooth/Print";

export default function PrinterScreen() {
  const [printers, setPrinters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deFaultPrinter, setDefaultPrinter] = useState({});

  useEffect(() => {
    (async () => {
      const response = await getSavedPrintersApi();
      if (response) setDefaultPrinter(response[0]);
    })();
  }, []);

  return (
    <ScrollView>
      <Button
        title="Buscar printers"
        onPress={async () => {
          setIsLoading(true);
          const response = await retrievePrinters();
          setPrinters(response);
          setIsLoading(false);
        }}
      />

      <View style={{ marginTop: 20 }}>
        <Text style={styles.menuDivisionTitle}>Impresora por defecto</Text>
        {deFaultPrinter.name != "" ? (
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              <View>
                <Icon name="print" size={30} color={"darkblue"} />
              </View>
              <View style={styles.menuItemContainer}>
                <Text style={styles.menuItemName}>{deFaultPrinter.name}</Text>
                <Text>{deFaultPrinter.address}</Text>
              </View>
              <View>
                <Menu>
                  <MenuTrigger>
                    <Icon
                      name="more-vert"
                      style={{
                        top: 0,
                        fontSize: 24,
                        color: "black",
                        paddingHorizontal: 13,
                        paddingVertical: 6,
                        borderRadius: 50,
                      }}
                    />
                  </MenuTrigger>
                  <MenuOptions
                    customStyles={{ optionText: { fontSize: 15 } }}
                    optionsContainerStyle={{ marginLeft: 6 }}
                  >
                    <MenuOption
                      text="Imprimir página de prueba"
                      style={styles.menuOption}
                      onSelect={async () => {
                        printByBluetooth({}, "test");
                      }}
                    />
                    {/*<MenuOption style={styles.menuOption} text='Impresora por Defecto'/>
                                            <MenuOption 
                                            style={styles.menuOption} 
                                            onSelect={() => {
                                                    
                                                }} 
                                            text='Crear Comentario'/> */}
                  </MenuOptions>
                </Menu>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ) : undefined}
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.menuDivisionTitle}>Dispositivos Vinculados</Text>
      </View>
      {isLoading != true ? (
        <View style={{ marginBottom: 37 }}>
          {printers?.map((printer, index) =>
            printer.address != deFaultPrinter.address ? (
              <TouchableWithoutFeedback key={index}>
                <View style={styles.menuContainer}>
                  <View>
                    <Icon name="phone-android" size={30} color={"darkblue"} />
                  </View>
                  <View style={styles.menuItemContainer}>
                    {printer.name ? (
                      <Text style={styles.menuItemName}>{printer.name}</Text>
                    ) : undefined}
                    <Text>{printer.address}</Text>
                  </View>
                  <View>
                    <Menu>
                      <MenuTrigger>
                        <Icon
                          name="more-vert"
                          style={{
                            top: 0,
                            fontSize: 24,
                            color: "black",
                            paddingHorizontal: 13,
                            paddingVertical: 6,
                            borderRadius: 50,
                          }}
                        />
                      </MenuTrigger>
                      <MenuOptions
                        customStyles={{ optionText: { fontSize: 15 } }}
                        optionsContainerStyle={{ marginLeft: 6 }}
                      >
                        <MenuOption
                          text="Añadir Impresora"
                          style={styles.menuOption}
                          onSelect={async () => {
                            await savePrinterApi({
                              address: printer.address.toString(),
                              name: printer.name.toString(),
                            });

                            setDefaultPrinter(printer);
                          }}
                        />
                        {/*<MenuOption style={styles.menuOption} text='Impresora por Defecto'/>
                                            <MenuOption 
                                            style={styles.menuOption} 
                                            onSelect={() => {
                                                    
                                                }} 
                                            text='Crear Comentario'/> */}
                      </MenuOptions>
                    </Menu>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ) : undefined
          )}
        </View>
      ) : (
        <ActivityIndicator
          size={"large"}
          color={"darkblue"}
          style={{ marginTop: 25 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menuOption: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    fontSize: 25,
  },

  menuContainer: {
    padding: 15,
    flexDirection: "row",
    borderColor: "#a9a9a935",
    borderWidth: 0.2,
    height: 90,
    alignItems: "center",
  },

  menuItemContainer: {
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 20,
    width: WINDOW_DIMENSION.width * 0.7,
  },

  menuItemName: {
    fontWeight: "bold",
  },

  menuDivisionTitle: {
    color: "#1e90ff",
    fontWeight: "bold",
    paddingHorizontal: 15,
    marginBottom: 12,
  },
});
