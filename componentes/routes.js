import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ficha from './TelaFichaDeTreino/FichaHeadOnly'
import { Text } from 'react-native'
import Perfil from './Perfil/Perfil'
import Home from './Home'
import Notificacoes from './Notificacoes'
import { Ionicons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { enderecoAcademia, enderecoAluno, alunoLogado } from "./NavegacaoLoginScreen/LoginScreen";
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, getFirestore } from 'firebase/firestore'
const Tab = createBottomTabNavigator()

export default function Routes({route}){
    const [carregando, setCarregando] = useState(true)
    const [fichas, setFichas] = useState([])
    const [avaliacoes, setAvaliacoes] = useState([])
    const [conexao, setConexao] = useState('')
    const {aluno, academia} = route.params
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
          setConexao(state.type === 'wifi' || state.type === 'cellular')
          if (conexao !== '') {
            if (conexao) {
              fetchDadosWifi()
            } else {
              //fetchAlunosSemNet()
            }
          }
        })
        return () => {
          unsubscribe()
        }
      }, [conexao])


      const fetchDadosWifi = async () => {
        const newArrayAlunos = [];
        console.log(aluno.email)
        console.log(aluno)
        try {
            const bd = getFirestore()
            const fichasRef = collection(bd, "Academias", aluno.Academia, "Professores", aluno.professorResponsavel, "alunos", `Aluno ${aluno.email}`, 'FichaDeExercicios')
    
            const fichasSnaspshot = await getDocs(fichasRef)
            const arrayFichaAux = []
            let index = 0
            
            for (const fichaDoc of fichasSnaspshot.docs) {
                const fichaData = fichaDoc.data()
                arrayFichaAux.push(fichaData)
                
                // Move this line inside the loop
                arrayFichaAux[index].Exercicios = []
            
                const exerciciosRef = collection(bd, "Academias", aluno.Academia, "Professores", aluno.professorResponsavel, "alunos", `Aluno ${aluno.email}`,'FichaDeExercicios', fichaDoc.id, "Exercicios")
                const exercicioSnapshot = await getDocs(exerciciosRef)
            
                for (const exercicioDoc of exercicioSnapshot.docs) {
                    const exercicioData = exercicioDoc.data()
                    arrayFichaAux[index].Exercicios.push(exercicioData)
                }
            
                index++
            }
            setFichas(arrayFichaAux)
            const avaliacoesRef = collection(bd, "Academias", aluno.Academia, "Professores", aluno.professorResponsavel, "alunos", `Aluno ${aluno.email}`, 'Avaliações')
            const avaliacoesSnapshot = await getDocs(avaliacoesRef)
            const arrayAvaliacoes = []
            for(const avaliacaoDoc of avaliacoesSnapshot.docs){
                const avaliacaoData = avaliacaoDoc.data()
                arrayAvaliacoes.push(avaliacaoData)
            }

            setAvaliacoes(arrayAvaliacoes)
        } catch (error) {
          console.error('Erro ao buscar alunos:', error);
        } finally {
            setCarregando(false)
        }
        console.log('fichas ', fichas)

      };

      if(carregando){
        return (
            <Text>Carregando...</Text>
        )
      }

    return (
        <Tab.Navigator   screenOptions={{
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
            initialParams={{fichas, avaliacoes, academia, aluno}}
            options={{
                tabBarIcon: ({size, color}) => (<Ionicons name="home-outline" size={size} color={color} />)
            }}/>
            <Tab.Screen 
            name="Ficha"  
            component={Ficha}
            initialParams={{ficha: fichas[fichas.length - 1]}}
            options={{
                tabBarIcon: ({size, color}) => (<Feather name="clipboard" size={size} color={color} />)
            }}/>
            <Tab.Screen 
            name="Perfil" 
            component={Perfil}
            initialParams={{aluno}}
            options={{
                tabBarIcon: ({size, color}) => (<AntDesign name="user" size={size} color={color} />)
            }}/>
            <Tab.Screen 
            name="Notificações" 
            component={Notificacoes}
            options={{
                tabBarIcon: ({size, color}) => (<Ionicons name="notifications-outline" size={size} color={color} />)
            }}/>
        </Tab.Navigator>
    )
}