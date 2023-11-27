import React, {useState} from "react"
import {Text, View, SafeAreaView, ScrollView, StyleSheet, Modal, TouchableOpacity} from 'react-native'
import estilo from "../estilo"
import RadioBotao from "../RadioBotao"
import { doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore"; 
import { firebase, firebaseBD } from "../configuracoes/firebaseconfig/config"
import { alunoLogado, academiaDoAluno} from "../Home";
import {PSE} from "../../classes/PSE"
import { horaInicio, minutoInicio} from "../Qtr";

const pseDoDia = new PSE('', '')
export default ({ options = [], tipoPSE, navigation, route }) => {
    const { diario, aluno } = route.params;
    const [selected, setSelected] = useState(0);
    const [pseValue, setPSEValue] = useState(0);
    const [pseResposta, setPseResposta] = useState('0. Repouso')
    console.log("ALUNOOOO NO PSEEEE", aluno)
    const responderPSE = () => {
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
    
        const duracaoDoTreinoHoras = (hora - horaInicio) * 60
        const duracaoDoTreinoMinutos = (minuto - minutoInicio)
    
        const duracao = duracaoDoTreinoHoras + duracaoDoTreinoMinutos
    
        if (minutoInicio < 0){
            const duracao = duracao*(-1)
        }
      
      
        diario.fimDoTreino = fimDoTreino;
      diario.duracao = duracao;
      diario.PSE.valor = pseValue;
      diario.PSE.resposta = pseResposta
      
      // Update PSE value
      setDoc(
        doc(
          firebaseBD,
          'Academias',
          aluno.Academia,
          'Professores',
          aluno.professorResponsavel,
          'alunos',
          `Aluno ${aluno.email}`,
          'Diarios',
          `Diario${ano}|${mes}|${dia}`
        ),
        {
          diario,
        }
      );
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