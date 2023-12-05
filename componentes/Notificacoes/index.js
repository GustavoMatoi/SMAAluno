import React, {useState, useEffect} from "react"
import {Text, View, SafeAreaView, StyleSheet, ScrollView, Alert, TouchableOpacity} from 'react-native'
import Notificacao from "./Notificacao"
import { firebase, firebaseBD } from '../configuracoes/firebaseconfig/config'
import { Entypo } from '@expo/vector-icons';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Notificacoes } from "../../classes/Notificacoes"
import estilo from "../estilo"
import NetInfo from '@react-native-community/netinfo';
import { AntDesign } from '@expo/vector-icons';

export default ({route}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [notificacoes, setNotificacoes] = useState([]);
  
    const {aluno} = route.params
    useEffect(() => {
        async function getNotificacoes() {
          const db = getFirestore();
          const notificacoesRef = collection(db,"Academias", aluno.Academia,"Professores",aluno.professorResponsavel,"alunos",`Aluno ${aluno.email}`,"Notificações");
          
          try {
            const notificacoesSnapshot = await getDocs(notificacoesRef);
            const notificacoesData = notificacoesSnapshot.docs.map((doc) => doc.data());
            setNotificacoes(notificacoesData.reverse());
          } catch (error) {
            console.log("Error fetching notifications:", error);
          } finally {
            setIsLoading(false);
          }
        }
        getNotificacoes();
        console.log(notificacoes)

    }, []);
    const [conexao, setConexao] = useState(true)
    
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setConexao(state.type === 'wifi' || state.type === 'cellular')
      })
  
      return () => {
        unsubscribe()
      }
    }, [])
    return (
<ScrollView>
  <SafeAreaView style={estilo.corLightMenos1}>
    <Text style={[estilo.tituloH427px, estilo.textoCorSecundaria, style.alinhamentoTexto]}>Notificações</Text>
      {conexao?   notificacoes.map((notificacao, index) => (
      <Notificacao key={index} tipo={notificacao.tipo} titulo={notificacao.titulo} data={notificacao.data} texto={notificacao.texto} remetente={notificacao.remetente}/>
    )) : <TouchableOpacity onPress={() => {
      Alert.alert(
        "Modo Offline",
        "Atualmente, o seu dispositivo está sem conexão com a internet. Por motivos de segurança, o aplicativo oferece funcionalidades limitadas nesse estado. Durante o período offline, os dados são armazenados localmente e serão sincronizados com o banco de dados assim que uma conexão estiver disponível."
      );
    }} style={[estilo.centralizado, { marginTop: '10%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
      <Text style={[estilo.textoP16px, estilo.textoCorDisabled]}>MODO OFFLINE - </Text>
      <AntDesign name="infocirlce" size={20} color="#CFCDCD" />
    </TouchableOpacity>}
  </SafeAreaView>
</ScrollView>


    )
}

const style = StyleSheet.create({
    alinhamentoTexto: {
        margin: 20
    },
    barraDivisora: {
        flexDirection: 'row',
        alignItems: 'baseline'
    }
})