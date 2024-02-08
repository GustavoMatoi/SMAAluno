import React, {useState, useEffect} from "react"
import {Text, View, SafeAreaView, ScrollView, StyleSheet, Modal, TouchableOpacity} from 'react-native'
import estilo from "../estilo"
import RadioBotao from "../RadioBotao"
import { doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore"; 
import { firebase, firebaseBD } from "../configuracoes/firebaseconfig/config"
import { alunoLogado, academiaDoAluno} from "../Home";
import {PSE} from "../../classes/PSE"
import { horaInicio, minutoInicio} from "../Qtr";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pseDoDia = new PSE('', '')
export default ({ options = [], tipoPSE, navigation, route }) => {
    const { diario, aluno, detalhamento } = route.params;
    console.log('diario no pse', diario)
    console.log('detalhamento', detalhamento)
    const [selected, setSelected] = useState(0);
    const [pseValue, setPSEValue] = useState(0);
    const [pseResposta, setPseResposta] = useState('0. Repouso')
    const [conexao, setConexao] = useState(true)
    
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setConexao(state.type === 'wifi' || state.type === 'cellular')
      })
  
      return () => {
        unsubscribe()
      }
    }, [])
    
    const responderPSE = async () => {
        const data = new Date()
        let dia = data.getDate()
        let mes = data.getMonth() + 1
        const ano = data.getFullYear()
        const hora = data.getHours()
          if (dia < 10){
            dia = `0${dia}`
          }
          if (mes < 10){
            mes = `0${mes}`
          }
        const minuto = data.getMinutes()
        const fimDoTreino = `${hora}:${minuto}`
        console.log('fimDoTreino, ', fimDoTreino)
    
        const duracaoDoTreinoHoras = (hora - horaInicio) * 60
        const duracaoDoTreinoMinutos = (minuto - minutoInicio)
    
        const duracao = duracaoDoTreinoHoras + duracaoDoTreinoMinutos
    
        if (minutoInicio < 0){
            const duracao = duracao*(-1)
        }
      
        console.log(detalhamento)
        let tipoTreino = 'Ficha de Treino'
        if(typeof detalhamento !== 'undefined'){
          tipoTreino = "Diario"
        }
        console.log(detalhamento)
        const diarioSalvo =  {
          fimDoTreino: fimDoTreino,
          duracao: duracao,
          inicio: diario.inicio, 
          mes: mes, 
          ano: ano, 
          dia: dia,
          tipoDeTreino: tipoTreino,
          PSE : {
             valor: pseValue,
             resposta: pseResposta
           },
           QTR: {
             valor: diario.QTR.valor,
             resposta: diario.QTR.resposta
           },
         }

        if(conexao){
          setDoc(
            doc(firebaseBD, 'Academias', aluno.Academia, 'Alunos', `Aluno ${aluno.email}`, `Diarios`,  `Diario${ano}|${mes}|${dia}`),
         diarioSalvo
        );

        detalhamento.Exercicios.forEach(element => {
          setDoc(doc(firebaseBD, 'Academias', aluno.Academia, 'Alunos', `Aluno ${aluno.email}`, `Diarios`,  `Diario${ano}|${mes}|${dia}`, 'Exercicio', element.Nome), {
            ...element
          })
        });
        } else {
          try {
            const diarioString = JSON.stringify(diarioSalvo)
            await AsyncStorage.setItem(`Diario ${ano}|${mes}|${dia}`, diarioString)

            
            console.log("diarioString", diarioSalvo)
            console.log("diarioString", diarioSalvo)
            if(typeof detalhamento !== 'undefined'){
              detalhamento.Exercicios.forEach(async(i, index) => {
                console.log(`i `, i)
                const exercicioString = JSON.stringify(i)
                const data = `${ano}|${mes}|${dia}`
                await AsyncStorage.setItem(`Diario ${data} - Exercicio ${index}`, exercicioString)
              })
            }
          } catch (error) {
            console.log("Erro: ", error)
          }
        }
      
    };



    
  
    return (
      <Modal animationType="slide">
        <ScrollView style={[style.container, estilo.corLightMenos1]}>
          <SafeAreaView style={[style.conteudo, estilo.centralizado]}>
            <Text style={[estilo.tituloH523px, estilo.textoCorSecundaria]}>{tipoPSE}</Text>
            {tipoPSE == 'PSE' ? (
              <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.subtitulo]}>
                Quão intenso foi seu treino?
              </Text>
            ) : (
              <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.subtitulo]}>
                Quão intenso foi esta série de exercício?
              </Text>
            )}
            <RadioBotao
              options={options}
              selected={selected}
              onChangeSelect={(opt, i) => {
                setSelected(i);
                setPSEValue(i); 
                setPseResposta(opt);
              }}
            ></RadioBotao>
            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity
                style={[estilo.botao, estilo.corPrimaria]}
                onPress={() => {
                  alert('Resposta registrada com sucesso!');
                  responderPSE();
                  navigation.navigate('Home');
                }}
              >
                <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER {tipoPSE}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ScrollView>
      </Modal>
    );
  };

const style = StyleSheet.create({
    container: {
        width: '100%',
    },
    conteudo: {
        width: '90%',
        margin: 20,
    },
    subtitulo: {
        marginTop: 20
    }
})