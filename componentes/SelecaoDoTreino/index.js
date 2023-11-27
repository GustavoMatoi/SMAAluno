import React, {useState, useEffect} from "react"
import {Text, View, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions} from 'react-native'
import estilo from "../estilo"
import { Foundation } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore"; 
import { firebase, firebaseBD } from "../configuracoes/firebaseconfig/config"
import { alunoLogado, academiaDoAluno} from "../Home";
import {useFonts } from "expo-font"
import NetInfo from '@react-native-community/netinfo';

const height = Dimensions.get('window').height
export default ({navigation, route}) => {
  const {diario, ficha, aluno} = route.params
  console.log('Diario na seleção do treino ', diario)
    const [fontsLoaded] = useFonts({
        'Montserrat': require('../../assets/Montserrat-Light.ttf'),
    })

    const [conexao, setConexao] = useState(true)



    
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setConexao(state.type === 'wifi' || state.type === 'cellular')
      })
  
      return () => {
        unsubscribe()
      }
    }, [])
  
    const checkWifiConnection = () => {
        NetInfo.fetch().then((state) => {
          if (state.type === 'wifi' || state.type === 'cellular') {
            console.log('Conectado ao Wi-Fi');
            setConexao(true)
          } else {
            console.log('Não conectado ao Wi-Fi');
            setConexao(false)
        }
        });
      };
      useEffect(() => {
        checkWifiConnection();
      }, []);
    
      const handleNavegacaoFicha = () => {
        if (!conexao) {
          navigation.navigate('Modal sem conexão');
        } else {
          diario.maneiraDeTreino = "Ficha"
          navigation.navigate('Ficha', {diario: diario, ficha, aluno})
        }
      }

      const handleNavegacaoDiario = () => {
        if (!conexao) {
          navigation.navigate('Modal sem conexão');
        } else {
            diario.maneiraDeTreino = 'Diario'
            navigation.navigate('Diario', {diario: diario});
            }
      }

    return (
        <SafeAreaView style={[estilo.corLightMenos1, style.container]}>
            <Text style={[estilo.textoP16px, style.textoEscolha, estilo.centralizado, style.Montserrat]}>Por onde gostaria de treinar? Não se esqueça de responder o formulário PSE para cadastrar sua presença.</Text>
            <View style={[style.areaBotoes, estilo.centralizado ]}>
                <TouchableOpacity style={[estilo.corPrimaria,style.containerBotao]} onPress={()=>{handleNavegacaoFicha()}}>
                    <View style={{height: '80%'}}>
                        <Foundation name="clipboard-notes" size={100} color='#FFF' />
                    </View>
                    <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>FICHA</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[estilo.corPrimaria,style.containerBotao]} onPress={()=>{handleNavegacaoDiario()}}>
                    <View style={{height: '80%'}}>
                        <Ionicons name="checkbox-outline" size={100} color="#FFF" />
                    </View>
                    <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>DIÁRIO</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        height: height,
    },
    textoEscolha:{
        textAlign: 'left',
        marginTop: '30%',
        marginBottom: 10,
        width: '80%'
    },
    areaBotoes: {
        flexDirection: 'row'
    },
    containerBotao: {
        margin: 10,
        width: 150,
        height: 150,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        elevation: 10
    },
    Montserrat: {
        fontFamily: 'Montserrat'
    }
})