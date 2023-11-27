import React, {useState} from "react"
import {Text, View, Button, SafeAreaView, ScrollView, StyleSheet, Modal, TouchableOpacity} from 'react-native'
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


const detalhamento = new DetalhamentoExercicioForca()
export default ({options =[], tipoPSE, navigation, route}) => {
    const [selected, setSelected] = useState(0)
    const {nomeExercicio, repeticao, diario, index} = route.params


    console.log("Diario no detalhamento ", diario)
    const [value, setValue] = useState('')
    const [resposta, setResposta] = useState('')
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
        const chave = `PerflexDoExercicio${repeticao}`;

      const dados = {
         resposta: resposta,
         valor: value,
      };
      diario.Exercicio[index][chave]= dados
      console.log('Diario no perflex ', diario)
      }

    return (
        <Modal
        animationType="slide"
        >

        <ScrollView style={[style.container, estilo.corLightMenos1]}>
            <SafeAreaView style={[style.conteudo, estilo.centralizado]}>
                <Text style={[estilo.tituloH523px, estilo.textoCorSecundaria]}>{tipoPSE}</Text>
                <Button title="Aa" onPress={() => console.log('Diario aaa', dia)}></Button>
                {tipoPSE == 'PSE' ? <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.subtitulo]}>Quão intenso foi seu treino?</Text> :  
                               <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.subtitulo]}>Quão intenso foi esta série de exercício?</Text>
 }
                <RadioBotao 
                        options ={options}
                        selected={selected}
                        onChangeSelect={(opt, i) => {
                        setSelected(i); setResposta(opt); setValue(i)}}></RadioBotao>
                        <View style={{paddingTop: 20}}>
                        <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>{  criarDetalhamento();navigation.goBack(); 
}}>
                            <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER {tipoPSE}</Text>
                        </TouchableOpacity>
                        </View> 
            </SafeAreaView>
        </ScrollView>
        </Modal>

    )
}


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
})