import React, { useEffect, useState, Component } from "react"
import { Text, TouchableOpacity, View, SafeAreaView, Modal, StyleSheet, BackHandler, ToastAndroid, Alert, ActivityIndicator, Platform } from 'react-native'
import estilo from "./estilo"
import Logo from "./Logo"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { firebase, firebaseBD } from './configuracoes/firebaseconfig/config'
import { Entypo } from '@expo/vector-icons';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Aluno } from "../classes/Aluno"
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location'
import { getDistance } from "geolib"
import * as Linking from 'expo-linking';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { alunoLogado, enderecoAluno, enderecoAcademia } from "./NavegacaoLoginScreen/LoginScreen";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default ({ navigation, route }) => {
  const { fichas, avaliacoes, academia, aluno } = route.params
  const [conexao, setConexao] = useState(true)
  const [location, setLocation] = useState()
  const [locationAcademia, setLocationAcademia] = useState([0])
  const [distanciaDaAcademia, setDistanciaDaAcademia] = useState(0)
  const [carregador, setCarregador] = useState(true)
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false);
  const [distanciaCarregada, setDistanciaCarregada] = useState(false);

  if(aluno.inativo === true){
    Alert.alert("Aluno inativo", "Algum professor te marcou como inativo. Se isso for engano, entre em contato com algum professor da academia e tente novamente mais tarde.")
    navigation.navigate('Login')
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        navigation.navigate('Login')
        AsyncStorage.clear()
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  useEffect(() => {
    const fetchData = async () => {
      if (conexao) {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            if (!locationPermissionRequested) {
              setLocationPermissionRequested(true);
              alert(
                'A localização é uma maneira de garantir sua presença na academia. Por favor, conceda'
              );
            }
            return;
          }
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
          const geocodedLocation = await Location.geocodeAsync(
            `${academia.endereco.rua}, ${academia.endereco.numero} - ${academia.endereco.bairro}, ${academia.endereco.cidade} - ${academia.endereco.estado}`
          );

          setLocationAcademia(geocodedLocation);
          const distance = getDistance(
            {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            },
            {
              latitude: geocodedLocation[0].latitude,
              longitude: geocodedLocation[0].longitude,
            }
          );
          setDistanciaDaAcademia(distance);
          console.log(distance);
          setDistanciaCarregada(true);
        } catch (error) {
          console.log(error);
          setDistanciaCarregada(true);
        }
      } else {
        setDistanciaDaAcademia(0);
        setDistanciaCarregada(true);
        setLocation(true);
      }
    };

    const executarFuncoes = async () => {
      await fetchData();
    };

    executarFuncoes();
  }, []);


  const openAppSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular')
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handlePressIniciarTreino = async () => {

    if (distanciaDaAcademia < 600) {
      navigation.navigate('QTR', { ficha: fichas[fichas.length - 1], aluno: aluno })
    }  else {
      Alert.alert(
        "Muito longe da academia",
        `No momento, parece que você está fora da academia.`,
        [
          { text: 'OK' }
        ],
        { titleStyle: { color: 'red', fontSize: 20 } }

      );

    }
  }




  const handlePressAnalise = () => {
    navigation.navigate('Avaliações', { avaliacoes, fichas });

  }
  const handleEvolucao = () => {

    navigation.navigate('Evolução do treino', { aluno: aluno });

  }



  return (
    <SafeAreaView style={[estilo.corLightMenos1, style.container]}>

      <View style={style.areaLogo}>
        <Logo />
      </View>
      <View style={style.areaFrase}>
        <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, estilo.centralizado, { textAlign: 'center' }]}>
          NÃO HÁ DESCULPAS PARA O SUCESSO. TREINE COM FOCO E DEDICAÇÃO!
        </Text>
      </View>
      {<>
        <View style={style.areaBotoes}>
          <View style={style.containerBotao}>

            {location ? (
              distanciaCarregada ? (
                <TouchableOpacity
                  style={[estilo.corPrimaria, style.botao]}
                  onPress={() => {
                    handlePressIniciarTreino();
                  }}
                >
                  <View style={[{ transform: [{ rotate: '-45deg' }] }, style.iconeBotao]}>
                    <Ionicons name="barbell-outline" size={120} color="white" />
                  </View>
                  <Text style={[estilo.textoSmall12px, estilo.textoCorLight]}>INICIAR TREINO</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  disabled
                  style={[estilo.corDisabled, style.botao]}
                >
                  <ActivityIndicator color="#fffff" size="large" />
                  <Text style={[estilo.textoSmall12px, estilo.textoCorLight]}>Carregando distância...</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={[estilo.corDisabled, style.botao]}
                onPress={() => openAppSettings()}
              >
                <MaterialIcons name="not-listed-location" size={120} color="white" />
                <Text style={[estilo.textoSmall12px, estilo.textoCorLight, estilo.centralizado]}>PERMITA ACESSO E REINICIE O APP.</Text>
              </TouchableOpacity>
            )}

          </View>

          <View style={style.containerBotao}>
            <TouchableOpacity style={[estilo.corPrimaria, style.botao]} onPress={() => handlePressAnalise()}>
              <View style={[style.iconeBotao]}>
                <MaterialCommunityIcons name="clipboard-text-search-outline" size={120} color="white" />
              </View>
              <Text style={[estilo.textoSmall12px, estilo.textoCorLight, style.textoBotao]}>AVALIAÇÕES E FICHAS</Text>
            </TouchableOpacity>
          </View>

        </View>
        <View style={style.areaBotoes}>

          <View style={style.containerBotao}  >
            <TouchableOpacity style={[conexao ? estilo.corPrimaria : estilo.corDisabled, style.botao]} onPress={() => handleEvolucao()} disabled={!conexao}>
              <View style={[style.iconeBotao]}>
                <Entypo name="line-graph" size={120} color="white" />
              </View>
              <Text style={[estilo.textoSmall12px, estilo.textoCorLight, style.textoBotao]}>EVOLUÇÃO DO TREINO {conexao ? "" : "OFFLINE"}</Text>
            </TouchableOpacity>
          </View>
          <View style={[style.containerBotao]} >
            <TouchableOpacity style={[conexao ? estilo.corPrimaria : estilo.corDisabled, style.botao]} onPress={() => navigation.navigate('Chat - Professores', { aluno: aluno })} disabled={!conexao}>
              <View style={[style.iconeBotao]}>
                <AntDesign name="wechat" size={120} color="white" />
              </View>
              <Text style={[estilo.textoSmall12px, estilo.textoCorLight, style.textoBotao]}> MENSAGENS {conexao ? "" : "OFFLINE"}</Text>
            </TouchableOpacity>
          </View>
        </View>

      </>}


    </SafeAreaView>
  )
}


const style = StyleSheet.create({
  container: {
    height: '100%'
  },
  areaLogo: {
    paddingTop: '5%',
    height: '10%',
  },
  areaFrase: {
    marginVertical: '10%',
    height: '15%',
  },
  areaBotoes: {
    height: '32%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  areaNavigation: {
    height: '7%',
    marginTop: 'auto',
    alignSelf: 'baseline',
    borderWidth: 1,
    width: '100%'
  },
  modalContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#F8FAFF',
    width: '70%',
    height: '35%',
    padding: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerBotao: {
    width: '40%',
    height: '100%',
  },
  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '75%',
    borderRadius: 15,
    padding: 5
  },

  iconeBotao: {
    padding: 5,
  },
  textoBotao: {
    textAlign: 'center'
  }

})

