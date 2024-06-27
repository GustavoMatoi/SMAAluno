import React, { useState, useEffect } from "react"
import { Text, View, SafeAreaView, ScrollView, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native'
import estilo from "../estilo"
import RadioBotao from "../RadioBotao"
import { doc, setDoc } from "firebase/firestore";
import { firebaseBD } from "../configuracoes/firebaseconfig/config"
import { horaInicio, minutoInicio } from "../Qtr";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default ({ options = [], tipoPSE, navigation, route }) => {
  const { diario, aluno, detalhamento } = route.params;
  const [selected, setSelected] = useState<number>(0);
  const [pseValue, setPSEValue] = useState<number>(0);
  const [pseResposta, setPseResposta] = useState<string>('0. Repouso')
  const [conexao, setConexao] = useState<boolean>(true)
  const [duracao, setDuracao] = useState<number>(0)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular')
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const responderPSE = async () => {
    if (duracao === 0) {
      Alert.alert("Tempo de treino não preenchido.","É necessário preencher o tempo de duração de seu treino.")
    } else {
      const data = new Date()
      let dia: string | number = data.getDate()
      let mes: string | number = data.getMonth() + 1
      const ano: number = data.getFullYear()
      const hora: number = data.getHours()
      if (dia < 10) {
        dia = `0${dia}`
      }
      if (mes < 10) {
        mes = `0${mes}`
      }
      const minuto: number | string = data.getMinutes()
      const fimDoTreino: string = `${hora}:${minuto}`

      let tipoTreino: string = 'Ficha de Treino'
      if (typeof detalhamento !== 'undefined') {
        tipoTreino = "Diario"
      }

      if(isNaN(duracao)) return Alert.alert("Valor inválido.","Preencha a duração apenas com números.")
      const diarioSalvo: object = {
        fimDoTreino: fimDoTreino,
        duracao: duracao,
        inicio: diario.inicio,
        mes: mes,
        ano: ano,
        dia: dia,
        tipoDeTreino: tipoTreino,
        PSE: {
          valor: pseValue,
          resposta: pseResposta
        },
        QTR: {
          valor: diario.QTR.valor,
          resposta: diario.QTR.resposta
        },
      }

      if (conexao) {
        setDoc(
          doc(firebaseBD, 'Academias', aluno.Academia, 'Alunos', `${aluno.email}`, `Diarios`, `Diario${ano}|${mes}|${dia}`),
          diarioSalvo
        );
        if(typeof detalhamento !== 'undefined'){
          detalhamento.Exercicios.forEach(element => {
            setDoc(doc(firebaseBD, 'Academias', aluno.Academia, 'Alunos', `${aluno.email}`, `Diarios`, `Diario${ano}|${mes}|${dia}`, 'Exercicio', element.Nome), {
              ...element
            })
          });
        }

      } else {
        try {
          const diarioString: string = JSON.stringify(diarioSalvo)
          await AsyncStorage.setItem(`Diario ${ano}|${mes}|${dia}`, diarioString)
          if (typeof detalhamento !== 'undefined') {
            detalhamento.Exercicios.forEach(async (i, index) => {
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
      Alert.alert('Resposta registrada com sucesso!', 'Seus dados de treino foram salvos com sucesso no banco de dados.');

      navigation.navigate('Home');
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
            horizontal={false}
            options={options}
            selected={selected}
            onChangeSelect={(opt, i) => {
              setSelected(i);
              setPSEValue(i);
              setPseResposta(opt);
            }}
          ></RadioBotao>
          <Text style={[estilo.tituloH619px, { marginVertical: '3%' }]}>Informe o tempo de treino, em minutos:</Text>
          <TextInput
            onChangeText={text => setDuracao(parseInt(text))}
            keyboardType="numeric"
            placeholder="Informe o tempo de treino"
            style={[estilo.corLight, style.botaoInput, duracao === 0 ? { borderWidth: 1, borderColor: 'red' } : {}]}
          />
          <View style={{ paddingTop: 20 }}>
            <TouchableOpacity
              style={[estilo.botao, estilo.corPrimaria]}
              onPress={() => {
                responderPSE();
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
  },
  botaoInput: {
    width: '90%',
    height: 50,
    borderRadius: 5,
    padding: 10
  }

})

