import React, {useState} from "react"
import {Text, View, SafeAreaView, ScrollView, StyleSheet, Modal, TouchableOpacity, Image} from 'react-native'
import estilo from "../estilo"
import RadioBotao from "../RadioBotao"
import { doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore"; 
import { firebase, firebaseBD } from "../configuracoes/firebaseconfig/config"
import { alunoLogado, academiaDoAluno} from "../Home";
import {PSE} from "../../classes/PSE"
import { diarioDoDia } from "../Qtr";
import { ExercicioNoDiario } from "../../classes/ExercicioNoDiario";
import { DetalhamentoExercicioForca } from "../../classes/DetalhamentoDoExercicio";
import { contadorPSE } from "../Detalhamento";
import { getStorage } from "@firebase/storage";


const pseDoDiario = new PSE('', '')
const detalhamento = new DetalhamentoExercicioForca()
export default ({options =[], tipoPSE, navigation, route}) => {
    const [selected, setSelected] = useState(0)
    const {nomeExercicio} = route.params
    const {serie} = route.params
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
    console.log(serie)

    function criarDetalhamento() {
        const chave = `PSEdoExercicioSerie${serie}`;
        const dados = {
          resposta: pseDoDiario.getResposta(),
          valor: pseDoDiario.getValor(),
        };
      
        updateDoc(
          doc(firebaseBD, "Academias", alunoLogado.getAcademia(), "Professores", alunoLogado.getProfessor(),  "alunos", `Aluno ${alunoLogado.getEmail()}`, "Diarios",`Diario${ano}|${mes}|${dia}`,"Exercicio",nomeExercicio),{
            [chave]: dados,
          }
        )
          .then(() => {
            console.log("Novo documento criado com sucesso!");
          })
          .catch((erro) => {
            console.error("Erro ao criar novo documento:", erro);
          });
      }

      if(pseDoDiario.getResposta() == ""){
        pseDoDiario.setResposta("0. Extremamente fácil")
        pseDoDiario.setValor(0)
      }
      console.log('Chegou aqui')
    return (
      <Modal animationType="slide" style={{ flex: 1, height: '100%' }}>


            <SafeAreaView style={[style.conteudo, estilo.centralizado]}>
                <Text style={[estilo.tituloH523px, estilo.textoCorSecundaria]}>{tipoPSE}</Text>
                <Image
                  style={[{width: '90%', height: '30%'}, estilo.centralizado]}
                  source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/shapemeappbdteste.appspot.com/o/pseOmni.jpeg?alt=media&token=af991ef5-d2c8-4c7d-9bd3-91cb36fbdda8',
                  }}
                />
                {tipoPSE == 'PSE' ? <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.subtitulo]}>Quão intenso foi seu treino?</Text> :  
                               <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.subtitulo]}>Quão intenso foi esta série de exercício?</Text>
 }
                <RadioBotao 
                        options ={options}
                        selected={selected}
                        onChangeSelect={(opt, i) => {
                        setSelected(i); pseDoDiario.setResposta(opt); pseDoDiario.setValor(i)}}></RadioBotao>
                        <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>{criarDetalhamento();navigation.goBack()}}>
                            <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER {tipoPSE}</Text>
                        </TouchableOpacity>
            </SafeAreaView>
        </Modal>

    )
}

export {detalhamento, pseDoDiario}

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    conteudo: {
        width: '90%',

    },
    subtitulo: {
        marginTop: 20
    },
    botaoResponderPSE: {
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius:15,
      width: '60%',
      marginTop: '20%',

  }
})