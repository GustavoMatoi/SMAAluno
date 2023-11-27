import React, {useState, useEffect} from "react"
import {Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import estilo from "../estilo"
import RadioBotao from "../RadioBotao"
import {VictoryChart, VictoryLine, VictoryTheme, VictoryVoronoiContainer, VictoryLabel} from "victory-native"
import {useFonts} from 'expo-font'
import { doc, setDoc, collection,getDocs, query,where,addDoc, getFirestore, getDoc } from "firebase/firestore"; 
import { firebase, firebaseBD } from "../configuracoes/firebaseconfig/config"
import { Entypo } from '@expo/vector-icons'; 
import { Exercicio } from "../../classes/Exercicio"

const exercicioNovo = new Exercicio('', '')
import { alunoLogado } from "../Home"
export default ({navigation}) => {
    const [fontsLoaded] = useFonts({
      'Montserrat': require('../../assets/Montserrat.ttf'),
    })
    const [arrayNomeExercicio, setArrayExercicio] = useState([]);
    const [carregandoDados, setCarregandoDados] = useState(true);
  
    const getExercicios = async () => {
      const user = firebase.auth().currentUser;
      const db = getFirestore();
      const alunoRef = collection(db, "aluno");
      const email = user.email;
      const queryAluno = query(alunoRef, where("email", "==", email));
      const diariosRef = collection(db, "Academias", alunoLogado.getAcademia(), "Professores", alunoLogado.getProfessor(),"alunos", `Aluno ${alunoLogado.getEmail()}`, 'FichaDeExercicios');

      const querySnapshot = await getDocs(diariosRef);
    
      const promises = [];
      querySnapshot.forEach((doc) => {
        const exerciciosRef = collection(doc.ref, "Exercicios");
        const promise = getDocs(exerciciosRef).then((exerciciosSnapshot) => {
          const exercicios = exerciciosSnapshot.docs.map((exercicioDoc) => {
            return {
              nome: exercicioDoc.data().Nome,
              tipo: exercicioDoc.data().tipo
            };
          });
          return exercicios;
        });
        promises.push(promise);
      });
    
      const arraysNomeExercicio = await Promise.all(promises);
      const newArrayNomeExercicio = arraysNomeExercicio.flat();
    
      setArrayExercicio(newArrayNomeExercicio);
      setCarregandoDados(false);
    };
    useEffect(() => {
      getExercicios();
    }, []);
  
    console.log(arrayNomeExercicio)
    /*
                  return (
                <TouchableOpacity
                  style={[
                    styles.botaoExercicio,
                    estilo.corLight,
                    estilo.sombra,
                  ]}
                  onPress={() =>
                    navigation.navigate("EVOLUÇÃO DO EXERCÍCIO", {
                      nome: exercicio.nome,
                      tipo: exercicio.tipo, // Adicione esta linha para passar o tipo
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
                    Exercício {exercicio.nome} ({exercicio.tipo})
                  </Text>
                </TouchableOpacity>
              );
    
    */
    return (
      <ScrollView style={[estilo.corLightMenos1, {height: '100%'} ]}>
        <SafeAreaView style={[estilo.container]}>
          <View style={[styles.conteudo, estilo.centralizado]}>
            <Text style={[{fontSize: 20, marginBottom: '10%'}, estilo.textoCorSecundaria, styles.Montserrat]}>Selecione o exercício que deseja visualizar a evolução.</Text>
            {carregandoDados ? <Text>Carregando....</Text>: 
            <View>
            {arrayNomeExercicio.map((exercicio) => {
              if(exercicio.tipo === 'alongamento'){
                return (
                  <TouchableOpacity
                    style={[
                      styles.botaoExercicio,
                      estilo.corLight,
                      estilo.sombra,
                    ]}
                    onPress={() =>
                      navigation.navigate("EVOLUÇÃO DO EXERCÍCIO", {
                        nome: exercicio.nome,
                        tipo: exercicio.tipo, // Adicione esta linha para passar o tipo
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
                      Exercício {exercicio.nome} ({exercicio.tipo})
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    style={[
                      styles.botaoExercicio,
                      estilo.corLight,
                      estilo.sombra,
                    ]}
                    onPress={() =>
                      navigation.navigate("EVOLUÇÃO DO EXERCÍCIO", {
                        nome: exercicio.nome,
                        tipo: exercicio.tipo, // Adicione esta linha para passar o tipo
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
                      Exercício {exercicio.nome.exercicio} ({exercicio.tipo})
                    </Text>
                  </TouchableOpacity>
                );
              }
  })}
          </View>
            }
          </View>
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
