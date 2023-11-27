import React, {useState, useEffect} from "react"
import {Text, View, SafeAreaView, StyleSheet, ScrollView} from 'react-native'
import Notificacao from "./Notificacao"
import { firebase, firebaseBD } from '../configuracoes/firebaseconfig/config'
import { Entypo } from '@expo/vector-icons';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { alunoLogado } from "../Home";
import { Notificacoes } from "../../classes/Notificacoes"
import estilo from "../estilo"
export default props => {
    const [isLoading, setIsLoading] = useState(true);
    const [notificacoes, setNotificacoes] = useState([]);
  
    useEffect(() => {
        async function getNotificacoes() {
          const db = getFirestore();
          const notificacoesRef = collection(db,"Academias",alunoLogado.getAcademia(),"Professores",alunoLogado.getProfessor(),"alunos",`Aluno ${alunoLogado.getEmail()}`,"Notificações");
          
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

    return (
<ScrollView>
  <SafeAreaView style={estilo.corLightMenos1}>
    <Text style={[estilo.tituloH427px, estilo.textoCorSecundaria, style.alinhamentoTexto]}>Notificações</Text>
    {notificacoes.map((notificacao, index) => (
      <Notificacao key={index} tipo={notificacao.tipo} titulo={notificacao.titulo} data={notificacao.data} texto={notificacao.texto} remetente={notificacao.remetente}/>
    ))}
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