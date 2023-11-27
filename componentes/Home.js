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


export default ({ navigation, route }) => {
  const {fichas, avaliacoes, academia, aluno} = route.params
  const [conexao, setConexao] = useState(true)
  const [location, setLocation] = useState()
  const [locationAcademia, setLocationAcademia] = useState([0])
  const [distanciaDaAcademia, setDistanciaDaAcademia] = useState()
  const [carregador, setCarregador] = useState(true)
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false);

  console.log("Fichas na home", fichas[fichas.length - 1])
  useEffect(() => {

    const fetchData = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (!locationPermissionRequested) {
            setLocationPermissionRequested(true);
            alert("A localização é uma maneira de garantir sua presença na academia. Por favor, conceda");
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
          { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
          { latitude: geocodedLocation[0].latitude, longitude: geocodedLocation[0].longitude }
        );
        setDistanciaDaAcademia(distance);
        console.log(distance);
        setCarregador(false);
      } catch (error) {
        console.log(error);
      }
    };

    const executarFuncoes = async () => {
      await fetchData()
    }

    executarFuncoes()
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
      navigation.navigate('QTR', {ficha: fichas[fichas.length - 1], aluno: aluno})
    } else if (distanciaDaAcademia == undefined) {
      Alert.alert(
        "Recuperando sua localização",
        `Estamos recuperando sua localização. Aperte novamente para prosseguir.`,
        [
          { text: 'Ok' }
        ],
        { titleStyle: { color: 'red', fontSize: 20 } }
      );
    } else {
      Alert.alert(
        "Muito longe da academia",
        `No momento, parece que você está fora da academia. Distância atual: ${distanciaDaAcademia} metros de distância.`,
        [
          { text: 'OK' }
        ],
        { titleStyle: { color: 'red', fontSize: 20 } }

      );
      navigation.navigate('QTR', {ficha: fichas[fichas.length - 1], aluno: aluno})

    }
  }




  const handlePressAnalise = () => {
      navigation.navigate('Avaliações', {avaliacoes, fichas});
    
  }
  const handleEvolucao = () => {
    if (!conexao) {
      navigation.navigate('Modal sem conexão');
    } else {
      navigation.navigate('Evolução do treino');
    }
  }


  const [backButtonPressCount, setBackButtonPressCount] = useState(0);

  function handleBackButtonPress() {
    setBackButtonPressCount(backButtonPressCount + 1);

    if (backButtonPressCount < 1) {
      ToastAndroid.show('Pressione novamente para sair', ToastAndroid.SHORT);
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
    };
  }, [backButtonPressCount]);


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
      { <>
          <View style={style.areaBotoes}>
            <View style={style.containerBotao}>

              {location ?
                (carregador ?
                  <TouchableOpacity disabled style={[estilo.corDisabled, style.botao]}>
                    <ActivityIndicator color="#fffff" size="large" />
                    <Text style={[estilo.textoSmall12px, estilo.textoCorLight]}>Carregando distância...</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={[estilo.corPrimaria, style.botao]} onPress={() => { handlePressIniciarTreino() }}>
                    <View style={[{ transform: [{ rotate: '-45deg' }] }, style.iconeBotao]}>
                      <Ionicons name="barbell-outline" size={120} color="white" />
                    </View>
                    <Text style={[estilo.textoSmall12px, estilo.textoCorLight]}>INICIAR TREINO</Text>
                  </TouchableOpacity>
                ) :
                <TouchableOpacity style={[estilo.corDisabled, style.botao]} onPress={() => openAppSettings()}>
                  <MaterialIcons name="not-listed-location" size={120} color="white" />
                  <Text style={[estilo.textoSmall12px, estilo.textoCorLight, estilo.centralizado]}>PERMITA ACESSO E REINICIE O APP.</Text>

                </TouchableOpacity>
              }

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
              <TouchableOpacity style={[conexao? estilo.corPrimaria: estilo.corDisabled, style.botao]} onPress={() => handleEvolucao()} disabled={!conexao}>
                <View style={[style.iconeBotao]}>
                  <Entypo name="line-graph" size={120} color="white" />
                </View>
                <Text style={[estilo.textoSmall12px, estilo.textoCorLight, style.textoBotao]}>EVOLUÇÃO DO TREINO {conexao? "" : "OFFLINE"}</Text>
              </TouchableOpacity>
            </View>
            <View style={[style.containerBotao]} >
              <TouchableOpacity style={[conexao? estilo.corPrimaria : estilo.corDisabled, style.botao]} onPress={() => navigation.navigate('Chat - Professores', {aluno: aluno})} disabled={!conexao}>
                <View style={[style.iconeBotao]}>
                  <AntDesign name="wechat" size={120} color="white" />
                </View>
                <Text style={[estilo.textoSmall12px, estilo.textoCorLight, style.textoBotao]}> MENSAGENS {conexao? "" : "OFFLINE"}</Text>
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
    width: '45%',
    height: '100%',
  },
  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '80%',
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

