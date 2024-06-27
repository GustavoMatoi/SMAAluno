import React, {useState, useEffect, useCallback} from "react"
import {Text, View, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
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
import moment from 'moment';


export default ({ route }) => {
  const { aluno } = route.params;

  // Estados principais do componente
  const [arrayPse, setArrayPse] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [conexao, setConexao] = useState(true);
  const [opcao, setOpcao] = useState(0);
  const [arrayStrainNoGrafico, setArrayStrainNoGrafico] = useState([]);

  // Efeito para verificar a conexão de rede
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Função para buscar os dados de PSE
  const getPse = async () => {
    try {
      const db = getFirestore();
      const diariosRef = collection(db, "Academias", aluno.Academia, 'Alunos', `${aluno.email}`, 'Diarios');
      const querySnapshot = await getDocs(diariosRef);

      const newArrayPse = [];
      querySnapshot.forEach((doc) => {
        newArrayPse.push(doc.get('PSE.valor') * doc.get('duracao'));
      });
      setArrayPse(newArrayPse);
      setCarregandoDados(false);
    } catch (error) {
      console.error('Erro ao buscar dados de PSE:', error);
      setCarregandoDados(false);
    }
  };

  // Efeito para buscar dados de PSE ao montar o componente
  useEffect(() => {
    getPse();
  }, []);

  // Função para calcular dados semanais de PSE
  const calcularDadosSemanais = async () => {
    try {
      const db = getFirestore();
      const diariosRef = collection(db, "Academias", aluno.Academia, 'Alunos', `${aluno.email}`, 'Diarios');
      const querySnapshot = await getDocs(diariosRef);

      const newArrayPse = [];
      querySnapshot.forEach((doc) => {
        const CIT = doc.get('PSE.valor') * doc.get('duracao');
        newArrayPse.push({
          cit: CIT,
          dia: doc.get('dia'),
          mes: doc.get('mes'),
          ano: doc.get('ano'),
        });
      });

      // Organiza os dados em semanas e calcula CIT semanal e desvio padrão
      const semanasObj = {};
      newArrayPse.forEach((item) => {
        const data = moment(`${item.ano}-${item.mes}-${item.dia}`, 'YYYY-MM-DD');
        const semanaAno = `${data.week()}-${data.year()}`;

        if (semanasObj[semanaAno]) {
          semanasObj[semanaAno].push(item.cit);
        } else {
          semanasObj[semanaAno] = [item.cit];
        }
      });

      const arraySemanalTemporario = [];
      const arrayDesvioPadraoSemanalTemporario = [];
      Object.keys(semanasObj).forEach((semanaAno) => {
        const somaSemanal = semanasObj[semanaAno].reduce((acc, cit) => acc + cit, 0);
        const mediaSemanal = somaSemanal / semanasObj[semanaAno].length;
        arraySemanalTemporario.push(mediaSemanal);

        const quadradosDasDiferencas = semanasObj[semanaAno].map((valor) => Math.pow(valor - mediaSemanal, 2));
        const somaQuadradosDasDiferencas = quadradosDasDiferencas.reduce((acc, valor) => acc + valor, 0);
        const desvioPadraoSemanal = Math.sqrt(somaQuadradosDasDiferencas / semanasObj[semanaAno].length);
        arrayDesvioPadraoSemanalTemporario.push(desvioPadraoSemanal);
      });

      // Calcula o strain semanal
      const arrayStrainTemporario = arraySemanalTemporario.map((media, i) => media * arrayDesvioPadraoSemanalTemporario[i]);
      setArrayStrainNoGrafico(arrayStrainTemporario);
    } catch (error) {
      console.error('Erro ao calcular dados semanais:', error);
    }
  };

  // Efeito para calcular dados semanais ao atualizar arrayPseSemanal
  useEffect(() => {
    if (arrayPse.length > 0) {
      calcularDadosSemanais();
    }
  }, [arrayPse]);

  return (
    <ScrollView style={[estilo.corLightMenos1, style.container]}>
      <SafeAreaView>
        {conexao ? (
          carregandoDados ? (
            // Mostra Spinner enquanto os dados estão sendo carregados
            <Spinner
              visible={carregandoDados}
              textContent={'Carregando dados...'}
              textStyle={[estilo.textoCorLight, estilo.textoP16px]}
            />
          ) : arrayPse.length === 0 ? (
            // Mostra mensagem quando não há dados no arrayPse
            <View style={estilo.centralizado}>
              <Text style={[estilo.tituloH333px]}>Ops...</Text>
              <View style={{ marginTop: '5%' }}>
                <Entypo name="emoji-sad" size={100} color="#182128" />
              </View>
              <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, { marginTop: '10%', textAlign: 'center', marginHorizontal: '5%' }, style.Montserrat]}>
                Você ainda não realizou nenhum treino. Treine e tente novamente mais tarde.
              </Text>
            </View>
          ) : (
            // Renderiza o gráfico de evolução de Strain quando há dados no arrayStrainNoGrafico
            <View>
              <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, estilo.centralizado, { marginTop: '3%' }]}>Evolução Strain</Text>
              <VictoryChart theme={VictoryTheme.material}>
                <VictoryLine
                  containerComponent={<VictoryVoronoiContainer />}
                  animate={{ duration: 2000, onLoad: { duration: 1000 } }}
                  style={{
                    data: { stroke: "#0066FF" },
                    parent: { border: "1px solid #182128" },
                  }}
                  data={arrayStrainNoGrafico}
                />
              </VictoryChart>
              <View style={{ marginLeft: '5%', marginBottom: '10%' }}>
                <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Selecione o parâmetro que deseja visualizar a evolução:</Text>
                <RadioBotao
                  options={['Semanal']}
                  selected={opcao}
                  onChangeSelect={(opt, i) => { setOpcao(i); }}
                />
              </View>
            </View>
          )
        ) : (
          // Mostra modal de sem conexão quando a conexão não está disponível
          <ModalSemConexao />
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    Montserrat: {
        fontFamily: 'Montserrat'
    }
})