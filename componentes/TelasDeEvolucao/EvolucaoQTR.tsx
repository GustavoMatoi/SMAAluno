import React, { useState, useEffect } from "react"
import { Text, View, SafeAreaView, ScrollView, StyleSheet, TextStyle } from 'react-native'
import estilo from "../estilo"
import RadioBotao from "../RadioBotao"
import { VictoryChart, VictoryLine, VictoryTheme, VictoryVoronoiContainer, VictoryAxis } from "victory-native"
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Entypo } from '@expo/vector-icons';
import BotaoSelect from "../BotaoSelect"
import NetInfo from '@react-native-community/netinfo'
import moment from "moment"
import Spinner from "react-native-loading-spinner-overlay"

const getMonthName = (month: number) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1];
};
type ObjetoDatas = {
  dia: string | number,
  mes: string | number, 
  ano: string | number
}

const organizeData = (arrayPse: Array<ObjetoDatas>) => {
  const organizedData = {};
  arrayPse.forEach((element) => {
    const dataFormatada = moment(`${element.ano}-${element.mes}-${element.dia}`, 'YYYY-MM-DD');
    const startOfWeek = dataFormatada.clone().startOf('isoWeek');
    const endOfWeek = dataFormatada.clone().endOf('isoWeek');
    const weekRange = `${startOfWeek.format('D MMM')} - ${endOfWeek.format('D MMM')}`;
    if (!organizedData[weekRange]) {
      organizedData[weekRange] = [];
    }
    organizedData[weekRange].push(element);
  });
  return organizedData;
};

const getDiaAbreviado = (dia) => {
  const dias = {
    "Monday": "Seg",
    "Tuesday": "Ter",
    "Wednesday": "Qua",
    "Thursday": "Qui",
    "Friday": "Sex",
    "Saturday": "Sáb",
    "Sunday": "Dom",
  };
  return dias[dia] || dia;
};

const aggregateData = (filteredData, interval, mesInicial) => {
  const aggregatedData = [];
  let currentGroup = [];
  for (let i = mesInicial; i < filteredData.length; i++) {
    if (currentGroup.length < interval) {
      currentGroup.push(filteredData[i]);
    } else {
      aggregatedData.push(currentGroup);
      currentGroup = [filteredData[i]];
    }
  }
  if (currentGroup.length > 0) {
    aggregatedData.push(currentGroup);
  }
  return aggregatedData;
};

export default ({ route }) => {
  type ObjetoGrafico = {
    x: number,
    y: number
  }

  type QtrObjeto = {
    data: string,
    qtr: number
  }

  type MesesObj = {
    data: string,
    dia: string | number
  }
  type DadosQTR  = {
    dia: string | number,
    mes: string | number,
    ano: string | number,
    qtr: number,
    diaDaSemana: string | number
  }

  const combinedTextStyle: TextStyle = {
    ...estilo.textoCorLight,
    ...estilo.textoP16px,
  };
  const { aluno } = route.params;


  
  const [arrayPse, setArrayPse] = useState<Array<DadosQTR>>([]);
  const [carregandoDados, setCarregandoDados] = useState<boolean>(true);
  const [conexao, setConexao] = useState<boolean>(true);
  const [arrayMeses, setArrayMeses] = useState<Array<MesesObj>>([]);
  const [qtrObjeto, setQtrObjeto] = useState<Array<QtrObjeto>>([]);
  const [mesSelecionado, setMesSelecionado] = useState<number>(0);
  const [arrayFiltrado, setArrayFiltrado] = useState<Array<ObjetoGrafico>>([{ x: 0, y: 0 }]);
  const [primeiroUltimoDiaEixoX, setPrimeiroUltimoDiaEixoX] = useState([]);
  const [valorMesInicial, setValorMesInicial] = useState<number>(0);
  const [arrayPseNoGrafico, setArrayPseNoGrafico] = useState<Array<ObjetoGrafico>>([{ x: 0, y: 0 }]);
  const [mesInicial, setMesInicial] = useState<number>(0);
  const [opcao, setOpcao] = useState<number>(0)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getPse = async () => {
      const db = getFirestore();
      const diariosRef = collection(db, "Academias", aluno.Academia, "Alunos", `${aluno.email}`, 'Diarios');
      const querySnapshot = await getDocs(diariosRef);

      const newArrayPse = [];
      const newArrayQtrObj = [];
      const arrayMesesAux = [];
      const arrayData = [];

      querySnapshot.forEach((doc) => {
        const mes = parseInt(doc.get('mes'), 10);
        const ano = doc.get('ano');
        const dia = doc.get('dia');
        const qtrValor = doc.get('QTR.valor');

        if (mes && ano && dia) {
          const mesNome = getMonthName(mes);
          arrayMesesAux.push({ data: `${mesNome} ${ano}`, dia });

          const dataFormatada = moment(`${ano}-${mes}-${dia}`, 'YYYY-MM-DD');
          const diaDaSemana = dataFormatada.format('dddd');

          arrayData.push(`${dia}/${mes}`);

          newArrayQtrObj.push({ qtr: qtrValor, data: `${mesNome} ${ano}` });
          newArrayPse.push({ dia, mes, ano, qtr: qtrValor, diaDaSemana });
        }
      });

      setArrayMeses(arrayMesesAux);
      setArrayPse(newArrayPse);
      setQtrObjeto(newArrayQtrObj);
      setCarregandoDados(false);
    };

    getPse();
  }, [aluno.email, aluno]);

  useEffect(() => {
    const index = qtrObjeto.findIndex(item => item.data === `${mesSelecionado}`);
    if (index !== -1) {
      setMesInicial(index);
    }
  }, [mesSelecionado, qtrObjeto]);

  const arrayBotaoSelect = arrayMeses.map(i => i.data);
  const arrayBotaoSelectSemRepeticoes = [...new Set(arrayBotaoSelect)];

  const handleSelectChange = (value: number) => {
    setMesSelecionado(value);
  };

  useEffect(() => {
    const index = arrayMeses.findIndex(item => item.data === `${mesSelecionado}`);
    if (index !== -1) {
      const aggregatedData90Days = aggregateData(qtrObjeto, 300, mesInicial);
      const arrayPseNoGrafico2 = aggregatedData90Days[0].map((i: QtrObjeto, element: number) => ({
        x: element + 1,
        y: i.qtr,
      }));

      setArrayPseNoGrafico(arrayPseNoGrafico2);
    }

    const organizedPseData = organizeData(arrayPse);
    const primeiroUltimoDia = [];
    const primeiroUltimoDiaString = [];

    let i = 0;
    for (const weekRange in organizedPseData) {
      if (i > valorMesInicial) {
        const weekData = organizedPseData[weekRange];

        if (weekData.length > 0) {
          const firstItem = weekData[0];
          const lastItem = weekData[weekData.length - 1];

          if (firstItem.diaDaSemana !== lastItem.diaDaSemana) {
            primeiroUltimoDia.push(firstItem.qtr, lastItem.qtr);
            primeiroUltimoDiaString.push(
              `${getDiaAbreviado(firstItem.diaDaSemana)}, ${firstItem.dia}/${firstItem.mes}`,
              `${getDiaAbreviado(lastItem.diaDaSemana)}, ${lastItem.dia}/${lastItem.mes}`
            );
          } else {
            primeiroUltimoDia.push(firstItem.qtr);
            primeiroUltimoDiaString.push(`${getDiaAbreviado(firstItem.diaDaSemana)}, ${firstItem.dia}/${firstItem.mes}`);
          }
        }
      }
      i++;
    }

    const primeiroUltimoDiaNoGrafico = primeiroUltimoDia.map((i, element) => ({
      x: element + 1,
      y: i
    }));
    setArrayFiltrado(primeiroUltimoDiaNoGrafico);
    setPrimeiroUltimoDiaEixoX(primeiroUltimoDiaString);
  }, [mesInicial, arrayPse, qtrObjeto, valorMesInicial, mesSelecionado]);

  useEffect(() => {
    const posicaoNumerica = arrayBotaoSelectSemRepeticoes.indexOf(`${mesSelecionado}`);
    setValorMesInicial(posicaoNumerica);
  }, [mesSelecionado, arrayBotaoSelectSemRepeticoes]);

  const eixoXNoGrafico = arrayPseNoGrafico.map((i, element) => `Dia ${element + 1}`);


  return (
    <ScrollView style={[estilo.corLightMenos1, style.container]}>
      <SafeAreaView>
        {conexao ? (
          carregandoDados ? (<Spinner
            visible={carregandoDados}
            textContent={'Carregando alunos...'}
            textStyle={combinedTextStyle}
          />
          ) : arrayPse.length === 0 ? (
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
            <View>
              <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, estilo.centralizado, { marginTop: '3%' }]}>Evolução QTR:</Text>
              <View style={[estilo.centralizado, { width: '90%' }]}>
                <BotaoSelect selecionado={true} onChange={(value, index) => {
                  handleSelectChange(value)
                }} titulo='Selecione um mês' max={1} options={arrayBotaoSelectSemRepeticoes} />
              </View>
              {arrayFiltrado.length === 0 ? (
                <View style={[{ width: '90%', marginVertical: '5%' }, estilo.centralizado]}>
                  <Text style={[estilo.tituloH619px, estilo.textoCorDanger, { textAlign: 'center' }]}>Selecione o mês do período inicial para renderizar os dados</Text>
                  <View style={[estilo.centralizado, { marginVertical: 10 }]}>
                    <Entypo name="line-graph" size={100} color="#FF6262" />
                  </View>
                </View>
              ) : (
                <VictoryChart theme={VictoryTheme.material}>
                  <VictoryAxis
                    style={{
                      axisLabel: { fontSize: 5 },
                      tickLabels: {
                        fontSize: opcao === 0 ? (arrayPseNoGrafico.length < 10 ? 10 : (arrayPseNoGrafico.length > 20 ? 7 : 5)) : (opcao === 1 ? (arrayFiltrado.length < 30 ? 8 : (arrayFiltrado.length > 30 ? 6 : 4)) : null)
                      }
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    domain={[6, 20]}
                    style={{
                      axisLabel: { fontSize: 12 },
                      tickLabels: { fontSize: 10 },
                    }}
                  />
                  <VictoryLine
                    containerComponent={<VictoryVoronoiContainer />}
                    animate={{ duration: 2000, onLoad: { duration: 1000 } }}
                    style={{
                      data: { stroke: "#0066FF" },
                      parent: { border: "1px solid #182128" },
                    }}
                    categories={opcao === 0 ? { x: eixoXNoGrafico } : { x: primeiroUltimoDiaEixoX }}
                    data={opcao === 0 ? arrayPseNoGrafico : arrayFiltrado}
                  />
                </VictoryChart>
              )}
              <View style={{ marginLeft: '5%', marginBottom: '10%' }}>
                <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Selecione o parâmetro que deseja visualizar sua evolução:</Text>
                <RadioBotao
                  horizontal={false}
                  options={['Diariamente', 'Primeiro e último dia da semana']}
                  selected={opcao}
                  onChangeSelect={(opt, i) => { setOpcao(i) }}
                />
                <View style={{ marginTop: '5%' }}>
                  <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>Valores:</Text>
                  {opcao === 0 ?
                    arrayPseNoGrafico.map((item) => <Text key={item.x} style={[estilo.textoSmall12px, estilo.textoCorSecundaria]}>Dia {item.x} | QTR: {item.y}</Text>) :
                    arrayFiltrado.map((item, index) => <Text key={index}>Dia: {primeiroUltimoDiaEixoX[index]} | QTR: {item.y}</Text>)
                  }
                </View>
              </View>
            </View>
          )
        ) : null}
      </SafeAreaView>
    </ScrollView>

  )
}
const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  Montserrat: {
    fontFamily: 'Montserrat'
  }
})