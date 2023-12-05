import React, {useState, useEffect} from "react"
import {Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native'
import estilo from "../estilo"
import Botao from "../Botao"
import {firebase, firebaseBD} from '../configuracoes/firebaseconfig/config'
import { collection,setDoc,doc, getDocs, getFirestore, where , query, addDoc} from "firebase/firestore";
import { alunoLogado } from "../Home"
import { Avaliacao } from "../../classes/Avaliacao"
import { Entypo } from '@expo/vector-icons'; 
import NetInfo from '@react-native-community/netinfo';

export default ({ navigation, route }) => {
  const {avaliacoes, fichas} = route.params
  const numAvaliacoes = avaliacoes.length
  const [conexao, setConexao] = useState(true);
  const [data, setData] = useState()
  function stringToDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  }

  console.log('Fichas na tela de avaliações', fichas)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular')
    })

    return () => {
      unsubscribe()
    }
  }, [])

    const handleNavegacaoAnalise = (i) => {
        navigation.navigate('Analise do Programa de Treino', {avaliacao: avaliacoes[i],avaliacaoAnterior: avaliacoes[i-1], posicaoDoArray: i, ficha: fichas[i]}) 
    }


  
      return (
        <ScrollView style={[style.container, estilo.corLightMenos1]} >
          {
          avaliacoes.length == 0 ? 
          <View>
             <Text style={[estilo.centralizado, estilo.tituloH333px]}>Ops...</Text>
                        <View style={[estilo.centralizado, {marginTop: '5%'}]}><Entypo name="emoji-sad" size={100} color="#182128" /></View>
                        <Text style={[ estilo.textoCorSecundaria, estilo.textoP16px, {marginTop: '10%', textAlign: 'center', marginHorizontal: '5%'}, style.Montserrat]}>Você ainda não possui nenhuma avaliação cadastrada. Realize uma avaliação física e tente novamente mais tarde.</Text>

          </View>
          
          : avaliacoes.length == 1? 
          <View style={style.conteudos} key={`keyBotaoAvaliacoes${1}`}>
          <TouchableOpacity
          
            style={[estilo.botao, estilo.corPrimaria]}
            onPress={() => navigation.navigate('Analise do Programa de Treino', {avaliacao: avaliacaoArray[0], posicaoDoArray: 0, ficha: fichas[0]})}
          >
            <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>
              {console.log(data)}
              Avaliação {1}
            </Text>
          </TouchableOpacity>
        </View>
          :
          avaliacoes.map((doc, i) => (
            <View style={style.conteudos} key={`keyBotaoAvaliacoes${i}`}>
              <TouchableOpacity
              
                style={[estilo.botao, estilo.corPrimaria]}
                onPress={() => {handleNavegacaoAnalise(i)}}
              >
                <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>
                  {console.log(data)}
                  Avaliação {i  + 1}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      );
    };


const style = StyleSheet.create({
    container: {
        height: '100%',
    },
    conteudos:{
        marginTop: 10,
        marginBottom: 20
    }
})