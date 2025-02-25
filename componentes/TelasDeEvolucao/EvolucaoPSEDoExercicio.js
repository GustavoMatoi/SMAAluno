import React, {useState, useEffect, useCallback} from "react"
import {Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import estilo from "../estilo"
import RadioBotao from "../RadioBotao"
import {VictoryChart, VictoryLine, VictoryTheme, VictoryVoronoiContainer, VictoryLabel, VictoryAxis} from "victory-native"
import {useFonts} from 'expo-font'
import { doc, setDoc, collection,getDocs, query,where ,addDoc, getFirestore, getDoc } from "firebase/firestore"; 
import { firebase, firebaseBD } from "../configuracoes/firebaseconfig/config"
import { Entypo } from '@expo/vector-icons'; 
import Spinner from "react-native-loading-spinner-overlay"
import NetInfo from '@react-native-community/netinfo';
import BotaoSelect from "../BotaoSelect"
import { alunoLogado } from "../Home"
import moment from 'moment';

export default ({navigation, route}) => {
  const {aluno} = route.params
    const [arrayNomeExercicio, setArrayExercicio] = useState([]);
    const [carregandoDados, setCarregandoDados] = useState(true);
    const [conexao, setConexao] = useState(true)

    useEffect (() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setConexao(state.type === 'wifi' || state.type === 'cellular')

      })

      return () => {
        unsubscribe()
      }
    })
    const getExercicios = async () => {
      const db = getFirestore();
      
      try {
        // 1. Buscar a ficha mais recente
        const fichasRef = collection(db, `Academias/${aluno.Academia}/Alunos/${aluno.email}/FichaDeExercicios`);
        const fichasSnapshot = await getDocs(fichasRef);
        
        // Encontrar a ficha mais recente
        const fichas = fichasSnapshot.docs.sort((a, b) => 
          b.id.localeCompare(a.id)
        );
        
        if (fichas.length === 0) {
          setCarregandoDados(false);
          return;
        }
    
        const fichaAtual = fichas[0];
        
        // 2. Buscar exercícios da ficha atual
        const exerciciosFichaRef = collection(fichaAtual.ref, 'Exercicios');
        const exerciciosFichaSnapshot = await getDocs(exerciciosFichaRef);
        
        // Mapear exercícios da ficha com nome correto
        const exerciciosDaFicha = exerciciosFichaSnapshot.docs.map(doc => ({
          nome: doc.data().Nome?.exercicio || doc.id, // Captura o nome correto da ficha
          tipo: doc.data().tipo
        }));
    
        console.log('Exercícios na ficha:', exerciciosDaFicha);
    
        // 3. Buscar diários que contêm PSE
        const diariosRef = collection(db, `Academias/${aluno.Academia}/Alunos/${aluno.email}/Diarios`);
        const diariosSnapshot = await getDocs(diariosRef);
    
        // 4. Coletar exercícios com PSE
        const exerciciosComPSE = new Map();
    
        for (const diarioDoc of diariosSnapshot.docs) {
          const exerciciosRef = collection(diarioDoc.ref, 'Exercicio');
          const exerciciosSnapshot = await getDocs(exerciciosRef);
          
          exerciciosSnapshot.forEach(exercicioDoc => {
            // Verificar se tem algum PSE registrado
            const hasPSE = Object.keys(exercicioDoc.data()).some(key => 
              key.startsWith('PSEdoExercicioSerie') && 
              typeof exercicioDoc.get(key)?.valor === 'number'
            );
    
            // Encontrar correspondência na ficha
            const exercicioFicha = exerciciosDaFicha.find(e => 
              e.nome === exercicioDoc.id // Comparação direta pelo ID do documento
            );
    
            if (exercicioFicha && hasPSE) {
              exerciciosComPSE.set(exercicioDoc.id, {
                nome: exercicioDoc.id, // Usa o ID do documento como nome
                tipo: exercicioFicha.tipo
              });
            }
          });
        }
    
        console.log('Exercícios com PSE:', Array.from(exerciciosComPSE.values()));
        setArrayExercicio(Array.from(exerciciosComPSE.values()));
        setCarregandoDados(false);
    
      } catch (error) {
        console.error('Erro ao carregar exercícios:', error);
        setCarregandoDados(false);
      }
    };
    useEffect(() => {
      getExercicios();
    }, []);
    return (
      <ScrollView style={[estilo.corLightMenos1, {height: '100%'} ]}>
        <SafeAreaView style={[estilo.container]}>
          {conexao ? <View style={[styles.conteudo, estilo.centralizado]}>
            <Text style={[{fontSize: 20, marginBottom: '10%'}, estilo.textoCorSecundaria, styles.Montserrat]}>Selecione o exercício que deseja visualizar a evolução.</Text>
            {carregandoDados ? 
             <Spinner
             visible={carregandoDados}
             textContent={'Carregando dados...'}
             textStyle={[estilo.textoCorLight, estilo.textoP16px]}
           />: 
            <View>
       {arrayNomeExercicio.map((exercicio) => {
  return exercicio.tipo === 'força' || exercicio.tipo == 'aerobico' ? (
    <TouchableOpacity
      style={[
        styles.botaoExercicio,
        estilo.corLight,
        estilo.sombra,
      ]}
      onPress={() =>
        navigation.navigate("Evolução PSE do Exercício", {
          nome: exercicio.nome,
          tipo: exercicio.tipo, 
          aluno: aluno,
        })
      }
    >
      <Text
        style={[
          estilo.textoP16px,
          styles.Montserrat,
          estilo.textoCorSecundaria,
          { marginLeft: "5%", marginTop: "auto", marginBottom: "auto" },
        ]}
      >
        Exercício {exercicio.nome} ({exercicio.tipo == 'aerobico' ? 'Pse Borg' : 'Pse Omni'})
      </Text>
    </TouchableOpacity>
  ) : null;
            })}
          </View>
            }
          </View>: <ModalSemConexao />}
        </SafeAreaView>
      </ScrollView>
    );
  }
const styles = StyleSheet.create({
    container: {
        marginBottom: '5%',
        height: '100%'
    },
    Montserrat: {
        fontFamily: 'Montserrat'
    },
    conteudo: {
        marginVertical: '15%',
        width: '95%'
    },
    botaoExercicio: {
        width: '95%',
        height: 60,
        marginTop: '1%'
        
    }
});