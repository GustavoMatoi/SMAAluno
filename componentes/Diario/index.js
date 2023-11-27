import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, BackHandler, Alert } from 'react-native'
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

const largura = Dimensions.get('window').width

export default ({ navigation, route }) => {
  const {dadosIniciaisDoDiario} = route.params
  const [diario, setDiario] = useState(dadosIniciaisDoDiario); // Substitua dadosIniciaisDoDiario pelos valores iniciais apropriados
  const [exercicio, setExercicio] = useState(new Exercicio())
  const [exercicioNoDiario, setExercicioNaFicha] = useState(new ExercicioNaFicha())
  const [fichaDeExercicios, setFichaDeExercicios] = useState(new FichaDeExercicios())
  const [isLoading, setIsLoading] = useState(true)
  const [ultimaFicha, setUltimaFicha] = useState([]);
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
  function handleBackPress() {
    setBackPressedCount(backPressedCount + 1);

    if (backPressedCount === 1) {
      Alert.alert('Atenção', 'Ao pressionar o botão de voltar novamente todos os dados que foram cadastrados serão perdidos. Se deseja continuar, aperte para voltar novamente.');

      setTimeout(() => {
        setBackPressedCount(0);
      }, 3000);
      return true;
    } else if (backPressedCount === 2) {
      excluirDocumento();

      setBackPressedCount(0);
      return true;
    }

    return false;
  }


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [backPressedCount]);

  function handleBackPress() {
    setBackPressedCount(backPressedCount + 1);

    if (backPressedCount === 1) {
      Alert.alert('Atenção',
        'Ao pressionar o botão de voltar novamente todos os dados que foram cadastrados serão perdidos. Se deseja continuar, aperte para voltar novamente.');

      setTimeout(() => {
        setBackPressedCount(0);
      }, 3000);
      return true;
    } else if (backPressedCount === 2) {
      excluirDocumento().then(() => {
        navigation.navigate('Home');
      });
      setBackPressedCount(0);
      return true;
    }

    return false;
  }



  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [backPressedCount]);

  useEffect(() => {
    async function getExercicios() {
      const db = getFirestore();
      const diarioRef = collection(db, "Academias", `${alunoLogado.getAcademia()}`, "Professores", `${alunoLogado.getProfessor()}`, "alunos", `Aluno ${alunoLogado.getEmail()}`, "FichaDeExercicios");
      const exerciciosSnapshot = await getDocs(diarioRef);
      const exerciciosPromises = exerciciosSnapshot.docs.map(async (exercicioDoc) => {
        const exerciciosRef = collection(exercicioDoc.ref, "Exercicios");
        const exerciciosSnapshot = await getDocs(exerciciosRef);
        return exerciciosSnapshot.docs.map((exercicio) => {
          const exercicioData = exercicio.data();
          const novoExercicio = new Exercicio();
          novoExercicio.setNome(exercicioData.Nome);
          novoExercicio.setTipo(exercicioData.tipo);
          const novoExercicioNaFicha = new ExercicioNaFicha();
          novoExercicioNaFicha.setExercicio(novoExercicio);
          novoExercicioNaFicha.setConjugado(false);
          novoExercicioNaFicha.setDescanso(exercicioData.descanso);
          novoExercicioNaFicha.setDuracao(exercicioData.duracao);
          novoExercicioNaFicha.setRepeticoes(exercicioData.repeticoes);
          novoExercicioNaFicha.setSeries(exercicioData.series);
          novoExercicioNaFicha.setVelocidade(exercicioData.velocidade);
          novoExercicioNaFicha.setImagem(exercicioData.imagem)
          return novoExercicioNaFicha;
        });
      });
      const exercicios = await Promise.all(exerciciosPromises);
      const arrayFicha = Object.values(exercicios);
      const exerciciosFlat = exercicios.flat();
      for (let i = 0; i < arrayFicha.length; i++) {
        for (const key in arrayFicha[i]) {
          if (arrayFicha[i].hasOwnProperty(key)) {
            const value = arrayFicha[i][key];
            if (typeof value === 'object') {
              console.log('Atributo: ' + key + ', Valor: ' + JSON.stringify(value, null, 2));
            } else {
              console.log('Atributo: ' + key + ', Valor: ' + value);
            }
          }
        }
      }
      for (let i = 0; i < arrayFicha.length; i++) {
        alunoLogado.addFichaDeExercicios(arrayFicha)
      }
      const ultimaFicha = arrayFicha[arrayFicha.length - 1]
      setUltimaFicha(ultimaFicha);
      setIsLoading(false);
    }
    getExercicios();
  }, []);




  let i = 0;



  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular')
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const checkWifiConnection = () => {
    NetInfo.fetch().then((state) => {
      if (state.type === 'wifi' || state.type === 'cellular') {
        console.log('Conectado ao Wi-Fi');
        setConexao(true)
      } else {
        console.log('Não conectado ao Wi-Fi');
        setConexao(false)
      }
    });
  };
  useEffect(() => {
    checkWifiConnection();
  }, []);

  const handleNavegacaoForca = (exercicioNaFicha) => {
    if (!conexao) {
      navigation.navigate('Modal sem conexão diario');
    } else {
      contador++
      confereDetalhamento()
      navigation.navigate('Detalhamento', { numeroDeSeries: exercicioNaFicha.series, repeticoes: exercicioNaFicha.repeticoes, descanso: exercicioNaFicha.descanso, tipoExercicio: 'força', nomeExercicio: exercicioNaFicha.exercicio.nome.exercicio  });
    }
  }
  const handleNavegacaoAerobico = (exercicioNaFicha) => {
    if (!conexao) {
      navigation.navigate('Modal sem conexão diario');
    } else {
      contador++
      confereDetalhamento()
      navigation.navigate('Detalhamento', { numeroDeSeries: exercicioNaFicha.series, tipoExercicio: 'cardio', nomeExercicio: exercicioNaFicha.exercicio.nome.exercicio })
    }
  }
  const handleNavegacaoAlongamento = (exercicioNaFicha) => {
      contador++
      diario.Exercicio = []
      confereDetalhamento()
      navigation.navigate('Detalhamento', { series: exercicioNaFicha.series, tipoExercicio: 'alongamento', nomeExercicio: exercicioNaFicha.exercicio.nome, duracao: exercicioNaFicha.duracao, diario: diario, index: contador });
  }
  const handleNavegacaoPse = () => {

      confereDetalhamento()
      navigation.navigate('PSE', {diario: diario})
  }




  const criarDiario = () => {
    const db = getFirestore()
    setDoc(doc(db, "Academias", `${alunoLogado.getAcademia()}`, "Professores", `${alunoLogado.getProfessor()}`, "alunos", `Aluno ${alunoLogado.getEmail()}`, "Diarios", `Diario${ano}|${mes}|${dia}`), {
    }).then(() => {
      console.log('Novo documento criado com sucesso!');
    })
      .catch((erro) => {
        console.error('ZZZZ:', erro);
      });
    i = i + 1;
  }
  if (i = 0) {
    criarDiario()

  }

  let contador = 0

  const confereDetalhamento = () => {
    if (ultimaFicha.length === contador) {
      setVerificador(true)
    }
  }

  console.log('Diario no diario', diario)

  return (
    <ScrollView style={[style.container, estilo.corLightMenos1]}>
      <View style={[estilo.corPrimaria, style.header]}>
        <Text style={[estilo.textoCorLight, estilo.tituloH148px]}>DIÁRIO</Text>
      </View>
      <SafeAreaView style={[style.caixa]}>
        <Caixinha></Caixinha>
      </SafeAreaView>

      {ultimaFicha && ultimaFicha.map((exercicioNaFicha, index) => (
        <View key={index}>
          <ScrollView horizontal={true}>
            {exercicioNaFicha.exercicio.tipo == 'força' ?
              <Text style={[{ marginTop: 20 }]}>
                <View style={{ width: largura }}>
                  <ExerciciosForça
                    nomeDoExercicio={exercicioNaFicha.exercicio.nome.exercicio}
                    series={exercicioNaFicha.series}
                    repeticoes={exercicioNaFicha.repeticoes}
                    descanso={exercicioNaFicha.descanso}
                  />
                </View>
                <BotaoDetalhamento onPress={() => { handleNavegacaoForca(exercicioNaFicha) }} />
              </Text>
              : exercicioNaFicha.exercicio.tipo == 'alongamento' ?
                <Text style={[{ marginTop: 20 }]}>
                  <View style={{ width: largura }}>
                    <ExerciciosAlongamento
                      nomeDoExercicio={exercicioNaFicha.exercicio.nome}
                      series={exercicioNaFicha.series}
                      repeticoes={exercicioNaFicha.repeticoes}
                      descanso={exercicioNaFicha.descanso}
                      imagem={exercicioNaFicha.imagem}
                    />
                  </View>
                  <BotaoDetalhamento onPress={() => { handleNavegacaoAlongamento(exercicioNaFicha) }} />
                </Text>
                : exercicioNaFicha.exercicio.tipo == 'aerobico' ?
                  <Text style={[{ marginTop: 20 }]}>
                    <View style={{ width: largura }}>
                      <ExerciciosCardio
                        nomeDoExercicio={exercicioNaFicha.exercicio.nome.exercicio}
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
      ))}
      {ultimaFicha ?
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
            onPress={() => { excluirDocumento(); navigation.navigate('Home') }}>
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
