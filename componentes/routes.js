import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ficha from './TelaFichaDeTreino/FichaHeadOnly'
import { Text } from 'react-native'
import Perfil from './Perfil/Perfil'
import {View} from "react-native"
import Home from './Home'
import Notificacoes from './Notificacoes'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { enderecoAcademia, enderecoAluno, alunoLogado } from "./NavegacaoLoginScreen/LoginScreen";
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import { collection, getDocs, getFirestore, setDoc, doc } from 'firebase/firestore'
import estilo from './estilo'
const Tab = createBottomTabNavigator()

export default function Routes({ route }) {
  const [carregando, setCarregando] = useState(true)
  const [fichas, setFichas] = useState([])
  const [avaliacoes, setAvaliacoes] = useState([])
  const [diarios, setDiarios] = useState([])
  const [conexao, setConexao] = useState('')
  const [progresso, setProgresso] = useState(0.0)
  const { aluno, academia } = route.params
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular')
      if (conexao !== '') {
        if (conexao) {
          fetchDadosWifi()
        } else {
          fetchAlunosSemNet()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [conexao])


  const fetchDadosWifi = async () => {
    setProgresso(0)
    try {
      const bd = getFirestore()
      const fichasRef = collection(bd, "Academias", aluno.Academia, "Professores", aluno.professorResponsavel, "alunos", `Aluno ${aluno.email}`, 'FichaDeExercicios')

      const fichasSnaspshot = await getDocs(fichasRef)
      const arrayFichaAux = []
      let index = 0

      for (const fichaDoc of fichasSnaspshot.docs) {
        const fichaData = fichaDoc.data()
        arrayFichaAux.push(fichaData)
        arrayFichaAux[index].Exercicios = []

        const exerciciosRef = collection(bd, "Academias", aluno.Academia, "Professores", aluno.professorResponsavel, "alunos", `Aluno ${aluno.email}`, 'FichaDeExercicios', fichaDoc.id, "Exercicios")
        const exercicioSnapshot = await getDocs(exerciciosRef)

        for (const exercicioDoc of exercicioSnapshot.docs) {
          const exercicioData = exercicioDoc.data()
          arrayFichaAux[index].Exercicios.push(exercicioData)
        }

        index++
      }
      console.log('arrayFichaAux ', arrayFichaAux)
      console.log(aluno)
      setProgresso(0.3)
      setFichas(arrayFichaAux)
      const avaliacoesRef = collection(bd, "Academias", aluno.Academia, "Professores", aluno.professorResponsavel, "alunos", `Aluno ${aluno.email}`, 'Avaliações')
      const avaliacoesSnapshot = await getDocs(avaliacoesRef)
      const arrayAvaliacoes = []
      for (const avaliacaoDoc of avaliacoesSnapshot.docs) {
        const avaliacaoData = avaliacaoDoc.data()
        arrayAvaliacoes.push(avaliacaoData)
      }

      arrayFichaAux.forEach(async (i, index) => {
        try {
          const fichaString = JSON.stringify(i)
          await AsyncStorage.setItem(`alunoLocal Ficha ${index}`, fichaString)

        } catch (error) {
          console.log("Error ", error)
        }
      })
      setProgresso(0.6)

      setAvaliacoes(arrayAvaliacoes)

      arrayAvaliacoes.forEach(async (i, index) => {
        try {
          const avaliacaoString = JSON.stringify(i)
          await AsyncStorage.setItem(`alunoLocal Avaliacao ${index}`, avaliacaoString)
        } catch (error) {
          console.log("Error ", error)
        }
      })
      verificaDocumentos()
      let indexDiario = 0
      /*  const diariosRef = collection(bd, "Academias", aluno.Academia, "Professores", aluno.professorResponsavel, "alunos", `Aluno ${aluno.email}`, 'Diarios')
        const diariosSnapshot = await getDocs(diariosRef)
        const arrayDiarios = []
  
  
        for (const diarioDoc of diariosSnapshot.docs) {
          const diarioData = diarioDoc.data()
          arrayDiarios.push(diarioData)
  
          const currentIndex = arrayDiarios.length - 1; 
  
          if (!arrayDiarios[currentIndex].Exercicio) {
            arrayDiarios[currentIndex].Exercicio = [];
          }
  
          const exerciciosRef = collection(bd, "Academias", aluno.Academia, "Professores", aluno.professorResponsavel, "alunos", `Aluno ${aluno.email}`, 'Diarios', diarioDoc.id, "Exercicio")
          const exercicioSnapshot = await getDocs(exerciciosRef)
  
          for (const exercicioDoc of exercicioSnapshot.docs) {
            const exercicioData = exercicioDoc.data()
            arrayDiarios[currentIndex].Exercicio.push(exercicioData)
          }
        } */

    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setProgresso(1)
      setCarregando(false)
    }
  };

  const fetchAlunosSemNet = async () => {
    const fichasAux = []
    const avaliacoesAux = []
    setProgresso(0)

    try {
      const keys = await AsyncStorage.getAllKeys()
      for (const key of keys) {
        if (key.includes('Ficha')) {
          const itemDoAS = await AsyncStorage.getItem(key)
          const itemDoAsJSON = JSON.parse(itemDoAS)
          //console.log("Key: ", key, "item do AS:", itemDoAsJSON)
          fichasAux.push(itemDoAsJSON)
          setProgresso(0.3)
        }
        if (key.includes('Avaliacao')) {
          const itemDoAS = await AsyncStorage.getItem(key)
          const itemDoAsJSON = JSON.parse(itemDoAS)
         // console.log("Key: ", key, "item do AS:", itemDoAsJSON)
          avaliacoesAux.push(itemDoAsJSON)
          setProgresso(0.6)
        }

      }
      console.log("Fichas Aux", fichasAux)
      setAvaliacoes(avaliacoesAux)
      setFichas(fichasAux)
    } catch (error) {
      console.log("Erro no Async Storage")
    } finally {
      setCarregando(false)
      setProgresso(1)
    }
    console.log("fichas na tela anterior ", fichas)
    //console.log("avaliacoes na tela anterior", avaliacoes)
  }

  const verificaDocumentos = async () => {
    if (conexao) {
      const bd = getFirestore();
      try {
        const keys = await AsyncStorage.getAllKeys();
        for (const key of keys) {
          const value = await AsyncStorage.getItem(key);
          index = 0
          if (value) {
            if (key.includes('Diario') && !key.includes('Exercicio')) {
              console.log("Chegou aqui ZAS");

              console.log('keykeykeykeykeykey ', key, " Value ", value);
              const chavesDoDiario = key.split(' ');
              const palavraDiario = chavesDoDiario[0];
              const palavraData = chavesDoDiario[1];

              console.log('palavraDiario', palavraDiario);
              console.log('palavraData', palavraData);

              const diarioDoc = JSON.parse(value);
              console.log("DiarioDoc", diarioDoc);

              setDoc(doc(bd, "Academias", aluno.Academia, "Professores", aluno.professorResponsavel, "alunos", `Aluno ${aluno.email}`, 'Diarios', `Diario${palavraData}`), diarioDoc);
              AsyncStorage.removeItem(key)

            
            }
            if (key.includes('Diario') && key.includes('Exercicio')) {

              console.log('keykeykeykeykeykey ', key, " Value ", value);
              const chavesDoDiario = key.split(' ');
              const palavraDiario = chavesDoDiario[0];
              const palavraData = chavesDoDiario[1];
              const palavraExercicio = chavesDoDiario[2];
              const palavraExercicio2 = chavesDoDiario[3];
              const palavraNumeroExercicio = chavesDoDiario[4]
              console.log('palavraDiario', palavraDiario);
              console.log('palavraData', palavraData);
              console.log('palavraExercicio', palavraExercicio);
              console.log('palavraExercicio', palavraExercicio2);

              const diarioDoc = JSON.parse(value);
              console.log("DiarioDoc", diarioDoc);


              setDoc(doc(bd, "Academias", aluno.Academia, "Professores", aluno.professorResponsavel, "alunos", `Aluno ${aluno.email}`, 'Diarios', `Diario${palavraData}`, 'Exercicio', `Exercicio ${palavraNumeroExercicio}`), diarioDoc);
              AsyncStorage.removeItem(key)

            }
          }
        }
      } catch (error) {
        console.error('Erro ao obter dados do AsyncStorage:', error);
      }
    }
  };


  if (carregando) {
    return (
      <View style={[estilo.centralizado, {marginTop: 'auto', marginBottom: 'auto', alignItems: 'center'}]}>
        <Text style={[estilo.textoCorPrimaria, estilo.textoP16px, {marginBottom: 20}]}>Carregando...</Text>
        <Progress.Circle size={100} indeterminate={false} progress={progresso} />

      </View>
    )
  }
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#182128',
        borderTopColor: '#182128'

      },
      tabBarActiveTintColor: '#0066FF',
      tabBarInactiveTintColor: '#CFCDCD',
    }}>
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{ fichas, avaliacoes, academia, aluno }}
        options={{
          tabBarIcon: ({ size, color }) => (<Ionicons name="home-outline" size={size} color={color} />)
        }} />
      <Tab.Screen
        name="Ficha"
        component={Ficha}
        initialParams={{ ficha: fichas[fichas.length - 1] }}
        options={{
          tabBarIcon: ({ size, color }) => (<Feather name="clipboard" size={size} color={color} />)
        }} />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        initialParams={{ aluno }}
        options={{
          tabBarIcon: ({ size, color }) => (<AntDesign name="user" size={size} color={color} />)
        }} />
      <Tab.Screen
        name="Notificações"
        initialParams={{aluno}}
        component={Notificacoes}
        options={{
          tabBarIcon: ({ size, color }) => (<Ionicons name="notifications-outline" size={size} color={color} />)
        }} />
    </Tab.Navigator>
  )
}