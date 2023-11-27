import React, {useState} from "react"
import {Text, View, SafeAreaView, ScrollView, StyleSheet, Modal, TouchableOpacity} from 'react-native'
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

    function criarDetalhamento() {
        const chave = `PSEdoExercicioSerie${serie}`;
        const dados = {
          resposta: pseDoDiario.getResposta(),
          valor: pseDoDiario.getValor() + 6,
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
        pseDoDiario.setResposta("6. Nenhum esforço")
        pseDoDiario.setValor(6)
      }

    return (
        <Modal
        animationType="slide"
        >

        <ScrollView style={[style.container, estilo.corLightMenos1]}>
            <SafeAreaView style={[style.conteudo, estilo.centralizado]}>
                <Text style={[estilo.tituloH523px, estilo.textoCorSecundaria]}>{tipoPSE}</Text>
                {tipoPSE == 'PSE' ? <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.subtitulo]}>Quão intenso foi seu treino?</Text> :  
                               <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.subtitulo]}>Quão intenso foi esta série de exercício?</Text>
 }
                <RadioBotao 
                        options ={options}
                        selected={selected}
                        onChangeSelect={(opt, i) => {
                        setSelected(i); pseDoDiario.setResposta(opt); pseDoDiario.setValor(i)}}></RadioBotao>
                        <View style={{paddingTop: 20}}>
                        <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>{criarDetalhamento();navigation.goBack()}}>
                            <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER {tipoPSE}</Text>
                        </TouchableOpacity>
                        </View> 
            </SafeAreaView>
        </ScrollView>
        </Modal>

    )
}

export {detalhamento, pseDoDiario}

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
    },
    botaoResponderPSE: {
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius:15,
      width: '60%',
      marginTop: '20%'
  }
})