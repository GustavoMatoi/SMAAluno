import React, { useState, useEffect } from 'react'
import { Text, Button, StyleSheet, View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, BackHandler, Alert } from 'react-native'
import estilo from '../estilo'
import FichaDeTreino from '../Ficha/FichaDeTreino'
import BotaoDetalhamento from './BotaoDetalhamento'
import Caixinha from './Caixinha'
import { Feather } from '@expo/vector-icons';
import ExerciciosAlongamento from "../Ficha/ExerciciosAlongamento"
import ExerciciosForça from "../Ficha/ExerciciosForça"
import ExerciciosCardio from "../Ficha/ExerciciosCardio"
import { collection, doc, getDocs, getFirestore, where, deleteDoc, query, addDoc } from "firebase/firestore";
import { firebase, firebaseBD } from '../configuracoes/firebaseconfig/config'
import { alunoLogado } from "../Home"
import { FichaDeExercicios } from "../../classes/FichaDeExercicios"
import { ExercicioNaFicha } from "../../classes/ExercicioNaFicha"
import { Exercicio } from "../../classes/Exercicio"
import { Diario } from "../../classes/Diario"
import NetInfo from '@react-native-community/netinfo';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const largura = Dimensions.get('window').width

export default ({ navigation, route }) => {
  const {dadosIniciaisDoDiario, ficha, aluno, detalhamento, diario} = route.params
  const [verificador, setVerificador] = useState(false)
  const [conexao, setConexao] = useState(true);
  const [backPressedCount, setBackPressedCount] = useState(0);
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
  const exercicios = [...ficha.Exercicios]
  const handleBackPress = () => {
    setBackPressedCount(backPressedCount + 1);

    if (backPressedCount === 1) {
      Alert.alert('Atenção', 'Ao pressionar o botão de voltar novamente todos os dados que foram cadastrados serão perdidos. Se deseja continuar, aperte para voltar novamente.');

      setTimeout(() => {
        setBackPressedCount(0);
      }, 3000);
      return true;
    } else if (backPressedCount === 2) {
      navigation.navigate('Home');

      setBackPressedCount(0);
      return true;
    }

    return false;
  }


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [backPressedCount]);



  let i = 0;



  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular')
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleNavegacaoForca = (exercicioNaFicha) => {
      contador++
      confereDetalhamento()
      navigation.navigate('Detalhamento', { numeroDeSeries: exercicioNaFicha.series, repeticoes: exercicioNaFicha.repeticoes, descanso: exercicioNaFicha.descanso, tipoExercicio: 'força', nomeExercicio: exercicioNaFicha.Nome.exercicio, diario: diario, index: contador, detalhamento});
    }
  const handleNavegacaoAerobico = (exercicioNaFicha) => {
      contador++
      confereDetalhamento()
      navigation.navigate('Detalhamento', { numeroDeSeries: exercicioNaFicha.series, tipoExercicio: 'cardio', nomeExercicio: exercicioNaFicha.Nome.exercicio, diario: diario, index: contador, detalhamento })
    
  }
  const handleNavegacaoAlongamento = (exercicioNaFicha) => {
      contador++
      confereDetalhamento()

      navigation.navigate('Detalhamento', { series: exercicioNaFicha.series, tipoExercicio: 'alongamento', nomeExercicio: exercicioNaFicha.Nome, duracao: exercicioNaFicha.duracao, diario: diario, index: contador, detalhamento});
  }
  const handleNavegacaoPse = () => {
      confereDetalhamento()
      navigation.navigate('PSE', {diario: diario, aluno: aluno, detalhamento: detalhamento})
  }

  let contador = 0

  const confereDetalhamento = () => {
    if (ficha.Exercicios.length === contador) {
      setVerificador(true)
    }
  }


  return (
    <ScrollView style={[style.container, estilo.corLightMenos1]}>
      <View style={[estilo.corPrimaria, style.header]}>
      {!conexao ?
        <TouchableOpacity onPress={() => {
          Alert.alert(
            "Modo Offline",
            "Atualmente, o seu dispositivo está sem conexão com a internet. Por motivos de segurança, o aplicativo oferece funcionalidades limitadas nesse estado. Durante o período offline, os dados são armazenados localmente e serão sincronizados com o banco de dados assim que uma conexão estiver disponível."
          );
        }} style={[estilo.centralizado, { marginTop: '10%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
          <Text style={[estilo.textoP16px, estilo.textoCorDisabled]}>MODO OFFLINE - </Text>
          <AntDesign name="infocirlce" size={20} color="#CFCDCD" />
        </TouchableOpacity>
        : null}

        <Text style={[estilo.textoCorLight, estilo.tituloH148px]}>DIÁRIO</Text>
      </View>
      <SafeAreaView style={[style.caixa]}>
        <Caixinha></Caixinha>
      </SafeAreaView>

      {exercicios.map((exercicioNaFicha, index) => (
        <View key={index}>
          <ScrollView horizontal={true}>
            {exercicioNaFicha.tipo == 'força' ?
              <Text style={[{ marginTop: 20 }]}>
                <View style={{ width: largura }}>
                  <ExerciciosForça
                    nomeDoExercicio={exercicioNaFicha.Nome.exercicio}
                    series={exercicioNaFicha.series}
                    repeticoes={exercicioNaFicha.repeticoes}
                    descanso={exercicioNaFicha.descanso}
                    cadencia={exercicioNaFicha.cadencia}
                    imagem={exercicioNaFicha.Nome.imagem}

                  />
                </View>
                <BotaoDetalhamento onPress={() => { handleNavegacaoForca(exercicioNaFicha) }} />
              </Text>
              : exercicioNaFicha.tipo == 'alongamento' ?
                <Text style={[{ marginTop: 20 }]}>
                  <View style={{ width: largura }}>
                    <ExerciciosAlongamento
                      nomeDoExercicio={exercicioNaFicha.Nome}
                      series={exercicioNaFicha.series}
                      repeticoes={exercicioNaFicha.repeticoes}
                      descanso={exercicioNaFicha.descanso}
                      imagem={exercicioNaFicha.imagem}
                    />
                  </View>
                  <BotaoDetalhamento onPress={() => { handleNavegacaoAlongamento(exercicioNaFicha) }} />
                </Text>
                : exercicioNaFicha.tipo == 'aerobico' ?
                  <Text style={[{ marginTop: 20 }]}>
                    <View style={{ width: largura }}>
                      <ExerciciosCardio
                    nomeDoExercicio={exercicioNaFicha.Nome.exercicio}
                    velocidadeDoExercicio={exercicioNaFicha.velocidade}
                        duracaoDoExercicio={exercicioNaFicha.duracao}
                        seriesDoExercicio={exercicioNaFicha.series}
                        descansoDoExercicio={exercicioNaFicha.descanso}
                      />
                    </View>
                    <BotaoDetalhamento onPress={() => { handleNavegacaoAerobico(exercicioNaFicha) }} />
                  </Text>
                  : null
            }
          </ScrollView>
        </View>
          )) }
      {exercicios.length !== 0 ?
        <TouchableOpacity style={verificador ? [estilo.corPrimaria, style.botaoResponderPSE, estilo.centralizado] : [estilo.corDisabled, style.botaoResponderPSE, estilo.centralizado]}
          disabled={!verificador}
          onPress={() => { handleNavegacaoPse() }}>
          <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER PSE</Text>
        </TouchableOpacity>

        : <View style={[estilo.centralizado, { marginTop: '5%', marginLeft: '20%', marginRight: '20%', marginBottom: '20%' }]}>
          <View style={estilo.centralizado}>
            <Text style={[estilo.tituloH427px, estilo.textoCorSecundaria, { textAlign: 'center', fontFamily: 'Montserrat' }]}>
              Ops...
            </Text>
            <Entypo name="emoji-sad" size={150} color="#182128" />
          </View>
          <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, { textAlign: 'center', fontFamily: 'Montserrat' }]}>
            Parece que você ainda não possui nenhuma ficha de exercícios. Que tal solicitar uma ao seu professor responsável?
          </Text>

          <TouchableOpacity style={[estilo.corPrimaria, style.botaoResponderPSE, estilo.centralizado]}
            onPress={() => {  navigation.navigate('Home') }}>
            <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      }

    </ScrollView>

  )
}


const style = StyleSheet.create({
  container: {
    height: '100%',
  },
  header: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },
  caixa: {
    width: '100%',
    alignItems: 'center'
  },

  diarioArea: {

  },
  diario: {
    marginTop: 20,
  },
  areaBotao: {
    width: 80,
    height: 50,
    marginLeft: 0,

  },
  botaoResponderPSE: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 15,
    width: '60%',
    marginTop: '20%',
    marginBottom: '20%'
  }
}
)
