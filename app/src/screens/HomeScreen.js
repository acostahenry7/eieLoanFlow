import React, { useState, useEffect, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import { RNCamera, Camera } from "react-native-camera";
import { isEmpty, set } from "lodash";
import { createVisitApi } from "../api/visit";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import { createVisitCommentaryApi, getPayementRoutes } from "../api/payments";
import { WINDOW_DIMENSION as windowDimensions } from "../utils/constants";
import * as Yup from "yup";
import Loading from "../components/Loading";
import CardTemplate from "../components/CardTemplate";
import { getCollectorsApi, updateCollectorParams } from "../api/collectors";
import tw from "twrnc";
import FadeInOut from "react-native-fade-in-out";
import RenderHtml from "react-native-render-html";
import ModalDropdown from "react-native-modal-dropdown";
import NetInfo from "@react-native-community/netinfo";

export default function HomeScreen(props) {
  const { navigation } = props;
  //const isFocused = useIsFocused()
  const [update, setUpdate] = useState(false);
  const cameraRef = useRef(null);
  const test = useRef(null);
  const [modalVisibility, setmodalVisibility] = useState(false);
  const [commentaryVisibility, setCommentaryVisibility] = useState(false);
  const [isCommentaryFormVisible, setIsCommentaryFormVisible] = useState(false);
  const { auth } = useAuth();
  const [scanedStatus, setScanedStatus] = useState(true);
  const [visitId, setVisitId] = useState("");
  const [routes, setRoutes] = useState({});
  const [collectors, setCollectors] = useState([]);
  const [currentCollector, setCurrentCollector] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [paramFormVisible, setParamFormVisible] = useState(false);
  const [searchCollector, setSearchCollector] = useState(false);
  const [searchedStatus, setSearchedStatus] = useState("");
  const [sectionFilter, setSectionFilter] = useState("Todos");
  const html = require(`../utils/templates/Receipt.html`);

  const goToPage = (page) => {
    navigation.navigate(page);
  };

  console.log(windowDimensions);

  const [netInfo, setNetInfo] = useState("");

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      setNetInfo(state.isInternetReachable.toString());
    });
  }, []);

  const formik = useFormik({
    initialValues: { commentary: "" },
    //validationSchema: Yup.object(validationSchema()),
    validateOnChange: false,
    onSubmit: async (values) => {
      let data = {
        commentary: values.commentary,
        visitId,
      };
      console.log("hi");
      const response = await createVisitCommentaryApi(data);
      setIsCommentaryFormVisible(false);
      if (response == true) {
        Alert.alert(
          "Comentario Creado!",
          "Se ha añadido un comentario para esta visita."
        );
      }

      formik.setFieldValue("commentary", "");
    },
  });

  const paramForm = useFormik({
    initialValues: { routeParam: "" },
    validateOnChange: false,
    onSubmit: async (values) => {
      let data = {
        routerRestriction: values.routeParam,
        userId: currentCollector.jhi_user?.user_id,
      };
      console.log(
        "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
        currentCollector
      );

      console.log(data);
      const response = await updateCollectorParams(data);

      if (response)
        Alert.alert(
          "Listo!",
          "El Parámetro CANTIDAD DE CLIENTES POR RUTA fué actualizado exitosamente para el cliente " +
            currentCollector.first_name
        );

      setParamFormVisible(false);
    },
  });

  const [isBarcodeRead, setIsBarcodeRead] = useState(false);
  const [barcodeType, setBarcodeType] = useState("");
  const [barcodeValue, setBarcodeValue] = useState("");

  useEffect(async () => {
    if (isBarcodeRead) {
      const { id, first_name, last_name, identification } =
        JSON.parse(barcodeValue);

      let data = {
        customerId: id,
        userId: auth?.user_id,
        username: auth?.login,
        currentLocation: "Calle 4 No. 33",
        commentary: null,
      };

      const response = await createVisitApi(data);
      setVisitId(response?.visit_id);
      setmodalVisibility(false);
      setCommentaryVisibility(true);
    }
  }, [isBarcodeRead, barcodeType, barcodeValue]);

  const onBarcodeRead = (event) => {
    if (!isBarcodeRead) {
      setIsBarcodeRead(true);
      setBarcodeType(event.type);
      setBarcodeValue(event.data);
    }
  };

  let i = 0;

  useEffect(async () => {
    (async () => {
      setIsLoading(true);

      const response = await getPayementRoutes(auth?.employee_id);

      setIsLoading(false);
      if (response) {
        setRoutes({});
        console.log("hi");
        console.log(response);
        setRoutes(response.filteredData);
      } else {
        setRoutes(routes);
      }

      console.log("MY ROUTES", response);
    })();
  }, [auth]);

  let searchedCollectors = [];
  useEffect(async () => {
    (async () => {
      if (auth?.login == "admin") {
        console.log("MODULE ADMIN");
        const response = await getCollectorsApi();
        if (searchedStatus.length >= 1) {
          searchedCollectors = response?.filter((collector) => {
            var collectorName = (
              collector.first_name +
              " " +
              collector.last_name +
              " " +
              collector.identification
            ).toLowerCase();

            var searchedText = searchedStatus.toLowerCase();

            return collectorName.includes(searchedText);
          });
          setCollectors(searchedCollectors);
        } else {
          setCollectors(response);
        }
      }
    })();
  }, [auth, searchedStatus]);

  let source = {
    html: `
    <p style='text-align:center;'>
      Hello World!
    </p>`,
  };

  return (
    <SafeAreaView style={{}}>
      {/* <Text>{netInfo}</Text> */}
      <Modal visible={false}>
        <RenderHtml contentWidth={100} source={source} />
      </Modal>

      {
        <Modal
          visible={paramFormVisible}
          animationType={"fade"}
          transparent={true}
        >
          <View style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.3)" }}>
            <View
              style={{
                ...styles.modalContainer,
                paddingHorizontal: 30,
                height: "auto",
              }}
            >
              <Icon
                name="times"
                style={{ textAlign: "right", fontSize: 18 }}
                onPress={() => setParamFormVisible(false)}
              />
              <Text
                style={{
                  ...styles.commentaryTitle,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Parámetros Definidos
              </Text>
              <View style={{ marginTop: 30 }}>
                <View>
                  <Text>Cantidad de Clientes en ruta / por día:</Text>
                  <TextInput
                    value={paramForm.values.routeParam}
                    onChangeText={(text) =>
                      paramForm.setFieldValue("routeParam", text)
                    }
                    style={{
                      borderColor: "gray",
                      borderWidth: 0.7,
                      marginTop: 5,
                      borderRadius: 5,
                      paddingHorizontal: 3,
                    }}
                  />
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <Button
                  title="Actualizar Parámetros"
                  onPress={paramForm.handleSubmit}
                />
              </View>
            </View>
          </View>
        </Modal>
      }

      {
        //Visit Form
        <Modal
          visible={commentaryVisibility}
          transparent={true}
          style={{}}
          animationType="fade"
        >
          <View style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.3)" }}>
            <View style={styles.modalContainer}>
              <View style={tw`flex-row`}>
                <Text style={{ ...styles.commentaryTitle, marginLeft: 15 }}>
                  Visita registrada exitosamente!
                </Text>
                <Icon
                  name="times"
                  size={24}
                  style={{
                    textAlignVertical: "center",
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    Alert.alert(
                      "Eliminando Visita",
                      "Usted ha eliminado todo registro de esta visita."
                    );
                    setIsBarcodeRead(false);
                    setBarcodeType("");
                    setBarcodeValue("");
                    setCommentaryVisibility(false);
                    setIsCommentaryFormVisible(false);
                  }}
                />
              </View>
              <View style={styles.commentaryBody}>
                <Text style={styles.commentaryBodyTitle}>
                  Qué desea realizar?
                </Text>
                <View style={styles.commentaryBodyIcons}>
                  <View style={{}}>
                    <Icon
                      name="comment-alt"
                      style={styles.commentaryBodyIcon}
                      onPress={() => {
                        setIsBarcodeRead(false);
                        setBarcodeType("");
                        setBarcodeValue("");

                        setCommentaryVisibility(false);
                        setIsCommentaryFormVisible(true);
                      }}
                    />
                    <Text
                      style={{
                        textAlignVertical: "center",
                        fontWeight: "bold",
                        maxWidth: 120,
                        textAlign: "center",
                      }}
                    >
                      Crear Comentario de Visita
                    </Text>
                  </View>
                  <View style={{ marginLeft: 40 }}>
                    <Icon
                      name="file-invoice-dollar"
                      style={{
                        ...styles.commentaryBodyIcon,
                        paddingLeft: 32,
                        paddingVertical: 20,
                      }}
                      onPress={() => {
                        setIsBarcodeRead(false);
                        setBarcodeType("");
                        setBarcodeValue("");
                        setCommentaryVisibility(false);
                        navigation.navigate("Customers", {
                          screen: "Customer",
                          params: { id: JSON.parse(barcodeValue)?.id },
                        });
                      }}
                    />
                    <Text
                      style={{
                        textAlignVertical: "center",
                        fontWeight: "bold",
                        maxWidth: 120,
                        textAlign: "center",
                      }}
                    >
                      Pago a préstamo Cliente
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      }
      {
        //Commentary Modal
        <Modal visible={isCommentaryFormVisible} transparent={true}>
          <View style={{ ...styles.modalContainer, height: 290 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  ...styles.commentaryTitle,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Crear Comentario
              </Text>
              <Icon
                style={{ paddingTop: 2, textAlign: "right", fontSize: 19 }}
                name="times"
                onPress={() => {
                  setIsBarcodeRead(false);
                  setBarcodeType("");
                  setBarcodeValue("");

                  setCommentaryVisibility(true);
                  setIsCommentaryFormVisible(false);
                }}
              />
            </View>
            <View
              style={{
                ...styles.commentaryBody,
                backgroundColor: "white",
                borderWidth: 0,
              }}
            >
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={{ ...styles.textInput, height: 100, marginBottom: 30 }}
                value={formik.values.commentary}
                onChangeText={(text) =>
                  formik.setFieldValue("commentary", text)
                }
              />
              <Button
                style={{}}
                onPress={formik.handleSubmit}
                title="Crear Comentario"
              />
            </View>
          </View>
        </Modal>
      }

      {/*Modal collectors config params*/}

      {/*Qr Scanner*/}
      <Modal animationType="slide" visible={modalVisibility}>
        <View>
          <Icon
            name="times"
            style={{
              right: 25,
              top: 25,
              zIndex: 2,
              fontSize: 25,
              position: "absolute",
              color: "white",
            }}
            onPress={() => setmodalVisibility(false)}
          />
          <Text
            style={{
              marginTop: 180,
              marginLeft: 67,
              color: "white",
              fontSize: 18,
              zIndex: 2,
              position: "absolute",
              fontWeight: "bold",
            }}
          >
            Escanee el código QR del Cliente
          </Text>
        </View>
        <View style={{}}>
          <RNCamera
            ref={cameraRef.current}
            style={{
              //flex: 1,
              zIndex: 0,
              //height: '100%',
              width: "100%",
            }}
            onBarCodeRead={onBarcodeRead}
          >
            <View style={{ height: "100%" }}>
              <View
                style={{ height: 260, backgroundColor: "#00000040" }}
              ></View>
              <View
                style={{
                  height: 292,
                  width: 292,
                  borderWidth: 6,
                  borderRadius: 5,
                  borderColor: "white",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "auto",
                }}
              ></View>
              <View
                style={{
                  height: 260,
                  backgroundColor: "#00000040",
                  marginTop: "auto",
                }}
              ></View>
            </View>
          </RNCamera>
        </View>
      </Modal>

      {/*Top Navbar*/}
      <View
        style={{
          height: 80,
          width: "100%",
          backgroundColor: "white",
          elevation: 5,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderBottomColor: "#4682b4",
          borderBottomWidth: 2,
        }}
      >
        <Icon name="handshake" style={{ fontSize: 35, color: "#4682b4" }} />
        <Text
          style={{
            marginLeft: 20,
            fontSize: 27,
            fontFamily: "Helvetica Neue",
            fontWeight: "bold",
          }}
        >
          EIE Loanflow
        </Text>
      </View>

      {/*Payment Route*/}
      {auth?.login != "admin" ? (
        <View style={{}}>
          <View
            style={{
              height: 150,
              paddingHorizontal: 6,
              paddingVertical: 10,
              backgroundColor: "rgba(153,190,226, 0.2)",
              backgroundColor: "whitesmoke",
            }}
          >
            <View
              style={{
                backgroundColor: "#4682b4",
                height: "100%",
                borderRadius: 10,
                elevation: 15,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="route" color={"white"} size={28} />
              <Text
                style={{
                  marginLeft: 8,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 20,
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                Ruta de Cobros
              </Text>
            </View>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height:
                windowDimensions.height > 805
                  ? windowDimensions.height * 0.67 //0.6
                  : windowDimensions.height * 0.624,
              backgroundColor: "whitesmoke",
              //paddingTop: 10,
              paddingHorizontal: 3,
              //paddingBottom: 10,
            }}
          >
            {isLoading == true ? (
              <Loading />
            ) : (
              <View>
                <View style={{ paddingHorizontal: 15 }}>
                  <ModalDropdown
                    style={{ ...styles.selectItem }}
                    dropdownStyle={{
                      ...styles.selectItemOptions,
                      width: "100%",
                    }}
                    dropdownTextStyle={styles.selectItemOptionsText}
                    disabled={false}
                    onSelect={(index, value) => {
                      setSectionFilter(value);
                    }}
                    options={["Todos", ...Object.keys(routes)]}
                    defaultValue="Todos"
                    textStyle={styles.selectItemText}
                    dropdownTextHighlightStyle={{
                      backgroundColor: "grey",
                      color: "white",
                    }}
                  />
                </View>
                {Object.keys(routes).map(function (key, item) {
                  let searchKey = key;
                  console.log(sectionFilter);
                  if (sectionFilter.length > 1) {
                    if (sectionFilter == "Todos") {
                      searchKey = key;
                    } else {
                      if (key == sectionFilter) {
                        searchKey = key;
                      } else {
                        searchKey = "";
                      }
                    }
                  }

                  return (
                    <View key={item} style={{ paddingBottom: 30 }}>
                      <View style={{ paddingVertical: 10 }}>
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 12,
                            color: "rgba(0,0,0,0.5)",
                          }}
                        >
                          {searchKey}
                        </Text>
                      </View>
                      {routes[searchKey]?.map((item, index) => (
                        <View key={index}>
                          <CardTemplate
                            data={item}
                            admin={false}
                            uid={item.customer_id}
                            mainTitle="Cliente"
                            mainText={item.name}
                            secondaryTitle="Dirección"
                            secondaryText={item.location}
                            menuOptions={[
                              {
                                name: "Localizar",
                                action: () => {
                                  navigation.navigate("Gps");
                                },
                              },
                            ]}
                          />
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <View style={{}}>
          <View
            style={{
              height: 150,
              paddingHorizontal: 6,
              paddingVertical: 10,
              backgroundColor: "rgba(153,190,226, 0.2)",
            }}
          >
            <View
              style={{
                backgroundColor: "#4682b4",
                height: "100%",
                height: "100%",
                borderRadius: 10,
                elevation: 15,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="user" color={"white"} size={28} />
              <Text
                style={{
                  marginLeft: 8,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 20,
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                Cobradores
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              backgroundColor: "rgba(153,190,226, 0.2)",
              paddingVertical: 10,
              paddingHorizontal: 15,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <FadeInOut visible={searchCollector} duration={300}>
                <TextInput
                  style={{
                    ...styles.textInput,
                    backgroundColor: "rgba(255,255,255,0.5)",
                  }}
                  onChangeText={(text) => {
                    setSearchedStatus(text);
                  }}
                  value={searchedStatus}
                  placeholder="Buscar cobrador..."
                />
              </FadeInOut>

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={searchCollector == false ? "search" : "times"}
                  size={20}
                  onPress={() => {
                    setSearchCollector(!searchCollector);
                    if (searchCollector == true) {
                      setSearchedStatus("");
                    }
                  }}
                  style={{
                    marginLeft: 15,
                    marginTop: 5,
                    borderWidth: 0.5,
                    borderRadius: 2,
                    width: 36,
                    height: 36,
                    textAlignVertical: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    backgroundColor: "rgba(255, 255, 255,0.4)",
                    borderColor: "rgba(0,0,0,0.4)",
                  }}
                />
              </View>
            </View>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height:
                windowDimensions.height > 805
                  ? windowDimensions.height * 0.6 //0.6
                  : windowDimensions.height * 0.624,
              backgroundColor: "rgba(153,190,226, 0.2)",
              //paddingTop: 10,
              paddingHorizontal: 3,
              marginBottom: 300,
            }}
          >
            {isLoading == true ? (
              <ActivityIndicator
                style={{
                  marginTop: 100,
                }}
                color={"blue"}
                size={"large"}
              />
            ) : (
              collectors?.map((item, index) => (
                <CardTemplate
                  key={index}
                  data={item}
                  uid={item.customer_id}
                  admin={true}
                  mainTitle="Cobrador"
                  mainText={`${item.first_name} ${item.last_name}`}
                  secondaryTitle="Dirección"
                  secondaryText={`${item.street} ${item.street2}`}
                  menuOptions={[
                    {
                      name: "Cantidad de Clientes",
                      action: async () => {
                        setParamFormVisible(true);
                        await setCurrentCollector(item);
                      },
                    },
                  ]}
                  screen={"collectors"}
                />
              ))
            )}
          </ScrollView>
        </View>
      )}

      {/*QR Scanner trigger Icon*/}
      {/* <View style={{ height: "100%" }}> */}

      <Icon
        onPress={() => {
          console.log("hi");
          setmodalVisibility(true);
        }}
        name="qrcode"
        color={"black"}
        style={{
          position: "absolute",
          bottom: 20,
          right: 30,
          zIndex: 999,
          backgroundColor: "#4682b4",
          color: "white",
          fontSize: 40,
          width: 67,
          height: 67,
          elevation: 5,
          paddingTop: 12,
          paddingBottom: 10,
          paddingLeft: 15.5,
          borderRadius: 50,
        }}
      />

      {/* </View> */}
    </SafeAreaView>
  );

  //   <View style={{ flexDirection: "row" }}>
  //     {/* <Icon name="handshake" style={{ fontSize: 35, color: "#4682b4" }} />
  //     <Text
  //       style={{
  //         marginLeft: 20,
  //         fontSize: 27,
  //         fontFamily: "robotic",
  //         fontWeight: "bold",
  //       }}
  //     >
  //       EIE Loanflow
  //     </Text> */}
  //     <View
  //       style={{ width: "50%", height: 45, backgroundColor: "blue" }}
  //     ></View>
  //     <View
  //       style={{ width: "50%", height: 45, backgroundColor: "blue" }}
  //     ></View>
  //   </View>
  //   <View style={{ marginTop: 40, height: "100%", paddingHorizontal: 20 }}>
  //     {/* <Button
  //             title='Escanear Código QR'
  //             onPress={() => {
  //                     setmodaVisibility(true)
  //                     console.log(modaVisibility);
  //                 }}/> */}
  //     <View
  //       style={{
  //         position: "absolute",
  //         right: 20,
  //         //top: windowDimensions.height - 300,
  //       }}
  //     >
  //       <View style={{ flexDirection: "row", alignItems: "center" }}>
  //         {/* <Text
  //           onPress={() => {
  //             setmodalVisibility(true);
  //           }}
  //           style={{
  //             bottom: -10,
  //             marginRight: 8,
  //             fontSize: 15,
  //             paddingHorizontal: 7,
  //             paddingVertical: 3,
  //             color: "white",
  //             elevation: 4,
  //             borderRadius: 5,
  //             backgroundColor: "skyblue",
  //             zIndex: 999,
  //           }}
  //         >
  //           Escanear Qr
  //         </Text> */}
  //         <Icon
  //           onPress={() => {
  //             console.log("hi");
  //             setmodalVisibility(true);
  //           }}
  //           name="qrcode"
  //           color={"black"}
  //           style={{
  //             bottom: -10,
  //             zIndex: 999,
  //             backgroundColor: "#4682b4",
  //             color: "white",
  //             fontSize: 40,
  //             width: 67,
  //             height: 67,
  //             elevation: 5,
  //             paddingTop: 12,
  //             paddingBottom: 10,
  //             paddingLeft: 15.5,
  //             borderRadius: 50,
  //           }}
  //         />
  //       </View>
  //     </View>
  //     {/* <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "center",
  //         marginBottom: 15,
  //       }}
  //     >
  //       <Text
  //         style={{
  //           textAlign: "center",
  //           marginTop: -10,
  //           color: "grey",
  //           fontSize: 17,
  //           width: 300,
  //         }}
  //       >
  //         Ruta de Cobros
  //       </Text>
  //       <Icon
  //         name="sync"
  //         size={22}
  //         color={"white"}
  //         style={{
  //           padding: 7,
  //           borderRadius: 50,
  //           marginTop: -15,
  //           backgroundColor: "#4682b4",
  //         }}
  //         onPress={async () => {
  //           //setUpdate(!update)
  //           setIsLoading(true);
  //           setRoutes([]);
  //           const response = await getPayementRoutes(auth?.employee_id);
  //           setIsLoading(false);
  //           setRoutes(response);
  //         }}
  //       />
  //     </View> */}
  //     <View
  //       style={{
  //         backgroundColor: "yellow",
  //         borderRadius: 50,
  //         height: 50,
  //         position: "absolute",
  //       }}
  //     ></View>
  //     <ScrollView
  //       showsVerticalScrollIndicator={false}
  //       style={{
  //         marginTop: 70,
  //         maxHeight: 568,
  //         paddingTop: 2,
  //       }}
  //     >
  //       {isLoading == true ? (
  //         <ActivityIndicator
  //           style={{
  //             marginTop: 100,
  //           }}
  //           color={"blue"}
  //           size={"large"}
  //         />
  //       ) : (
  //         routes?.map((item, index) => (
  //           <CardTemplate
  //             key={index}
  //             data={item}
  //             uid={item.customer_id}
  //             mainTitle="Cliente"
  //             mainText={item.name}
  //             secondaryTitle="Dirección"
  //             secondaryText={item.location}
  //             menuOptions={[
  //               {
  //                 name: "Localizar",
  //                 action: () => {
  //                   navigation.navigate("Gps");
  //                 },
  //               },
  //             ]}
  //           />
  //         ))
  //       )}
  //     </ScrollView>
  //   </View>

  //   <Modal animationType="slide" visible={modalVisibility}>
  //     <View>
  //       <Icon
  //         name="times"
  //         style={{
  //           right: 25,
  //           top: 25,
  //           zIndex: 2,
  //           fontSize: 25,
  //           position: "absolute",
  //           color: "white",
  //         }}
  //         onPress={() => setmodalVisibility(false)}
  //       />
  //       <Text
  //         style={{
  //           marginTop: 180,
  //           marginLeft: 67,
  //           color: "white",
  //           fontSize: 18,
  //           zIndex: 2,
  //           position: "absolute",
  //           fontWeight: "bold",
  //         }}
  //       >
  //         Escanee el código QR del Cliente
  //       </Text>
  //     </View>
  //     <View style={{}}>
  //       <RNCamera
  //         ref={cameraRef.current}
  //         style={{
  //           //flex: 1,
  //           zIndex: 0,
  //           //height: '100%',
  //           width: "100%",
  //         }}
  //         onBarCodeRead={onBarcodeRead}
  //       >
  //         <View style={{ height: "100%" }}>
  //           <View
  //             style={{ height: 260, backgroundColor: "#00000040" }}
  //           ></View>
  //           <View
  //             style={{
  //               height: 292,
  //               width: 292,
  //               borderWidth: 6,
  //               borderRadius: 5,
  //               borderColor: "white",
  //               marginLeft: "auto",
  //               marginRight: "auto",
  //               marginTop: "auto",
  //             }}
  //           ></View>
  //           <View
  //             style={{
  //               height: 260,
  //               backgroundColor: "#00000040",
  //               marginTop: "auto",
  //             }}
  //           ></View>
  //         </View>
  //       </RNCamera>
  //     </View>
  //   </Modal>
  //   {/* <View style={{position: 'absolute', backgroundColor: '#a9a9a940', height: '30%', width: '100%'}}/>
  //        <View style={{  zIndex: 1 , marginTop: 'auto', backgroundColor: '#a9a9a940', height: '30%', width: '100%'}}/> */}
  // </SafeAreaView>
  //);
}

const styles = StyleSheet.create({
  modalView: {
    marginTop: "auto",
    marginBottom: "auto",
    marginHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  formGroup: {
    paddingVertical: 10,
  },

  textInput: {
    marginTop: 5,
    height: 20,
    borderWidth: 1,
    borderColor: "#D1D7DB",
    width: 330,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 3,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 0,
  },

  modalContainer: {
    height: 400,
    marginTop: "auto",
    marginBottom: "auto",
    backgroundColor: "white",
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    elevation: 5,
  },

  commentaryTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 19,
    //backgroundColor: 'skyblue',
    paddingVertical: 5,
    borderRadius: 8,
  },

  commentaryBody: {
    padding: 12,
    marginTop: 15,
    alignItems: "center",
    height: "80%",
    borderColor: "grey",
    borderWidth: 0.2,
    borderRadius: 5,
    backgroundColor: "#b0e0e612",
  },

  commentaryBodyTitle: {
    fontSize: 15,
    marginLeft: "auto",
    marginRight: "auto",
    paddingVertical: 17,
  },

  commentaryBodyIcons: {
    marginTop: "auto",
    marginBottom: "auto",
    paddingHorizontal: 20,
    flexDirection: "row",
  },

  commentaryBodyIcon: {
    fontSize: 70,
    marginLeft: "auto",
    marginRight: "auto",
    width: 120,
    height: 120,
    paddingHorizontal: 25,
    paddingVertical: 25,
    backgroundColor: "skyblue",
    borderRadius: 10,
    color: "white",
    marginBottom: 10,
  },

  selectItem: {
    //alignSelf: 'center',
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderColor: "#D1D7DB",
    paddingVertical: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: "row",
  },

  selectItemText: {
    fontSize: 16,
    color: "black",
    width: "100%",
    textAlign: "center",
  },

  selectItemOptions: {
    paddingTop: 0,
    borderWidth: 1,
    maxWidth: 300,
    marginTop: 10,
    marginLeft: 20,
    backgroundColor: "white",
  },

  selectItemOptionsText: {
    width: "100%",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "transparent",
    color: "black",
  },
});
