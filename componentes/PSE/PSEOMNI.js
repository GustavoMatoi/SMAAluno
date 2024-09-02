import React, { useState } from "react"
import { Text, SafeAreaView, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native'
import estilo from "../estilo"
import RadioBotao from "../RadioBotao"



const altura = Dimensions.get('screen').height
export default ({ options = [], tipoPSE, navigation, route }) => {
  const [selected, setSelected] = useState(0)
  const { nomeExercicio, repeticao, diario, index, detalhamento } = route.params


  console.log("Diario no detalhamento ", diario)
  const [value, setValue] = useState(0)
  const [resposta, setResposta] = useState('0. Extremamente fácil')
  const data = new Date()
  let dia = data.getDate()
  let mes = data.getMonth() + 1
  const ano = data.getFullYear()
  const hora = data.getHours()
  if (dia < 10) {
    dia = `0${dia}`
  }
  if (mes < 10) {
    mes = `0${mes}`
  }

  const criarDetalhamento = () => {
    const chave = `PSEdoExercicioSerie${repeticao}`;
    
    if (typeof detalhamento.Exercicios === 'undefined') {
      detalhamento.Exercicios = [];
    }
    
    if (typeof detalhamento.Exercicios[index] === 'undefined') {
      detalhamento.Exercicios[index] = {};
    }
  
    if (value == 0) {
      setValue(0);
      setResposta("0 - 30. Normalidade");
    }
  
    const dados = {
      resposta: resposta,
      valor: value,
    };
    
    detalhamento.Exercicios[index][chave] = dados;
    console.log('detalhamento.Exercicios[index][chave] = dados ', detalhamento.Exercicios[index][chave]);
  }
  return (
    <Modal animationType="slide" style={{ flex: 1, height: '100%' }}>


      <SafeAreaView style={[style.conteudo, estilo.centralizado]}>
        <Text style={[estilo.tituloH523px, estilo.textoCorSecundaria]}>{tipoPSE}</Text>
        <Image
          style={[{ width: '90%', height: '30%' }, estilo.centralizado]}
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/shapemeappbdteste.appspot.com/o/pseOmni.jpeg?alt=media&token=af991ef5-d2c8-4c7d-9bd3-91cb36fbdda8',
          }}
        />
        {tipoPSE == 'PSE' ? <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.subtitulo]}>Quão intenso foi seu treino?</Text> :
          <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.subtitulo]}>Quão intenso foi esta série de exercício?</Text>
        }
        <RadioBotao
          options={options}
          selected={selected}
          onChangeSelect={(opt, i) => {
            setSelected(i);
            setResposta(opt);
            setValue(i);
          }}
        />
        <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={() => { criarDetalhamento(); navigation.goBack() }}>
          <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER {tipoPSE}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}


const style = StyleSheet.create({
  container: {
    width: '90%',
    height: altura
  },
  conteudo: {
    width: '100%',

  },
  subtitulo: {
    marginTop: 20
  },
  botaoResponderPSE: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 15,
    width: '60%',
    marginTop: '20%',

  }
})