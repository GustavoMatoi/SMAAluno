import React, { useState, useEffect } from "react"
import { Text, View, SafeAreaView, ScrollView, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native'
import estilo from "../estilo"
import RadioBotao from "../RadioBotao"
import { doc, setDoc } from "firebase/firestore";
import { firebaseBD } from "../configuracoes/firebaseconfig/config"
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default ({ options = [], tipoPSE, navigation, route }) => {
  const { diario, aluno, detalhamento,ficha } = route.params;
  const [selected, setSelected] = useState(0);
  const [pseValue, setPSEValue] = useState(0);
  const [pseResposta, setPseResposta] = useState('0. Repouso');
  const [duracao, setDuracao] = useState(0);
  const [inicioTreino, setInicioTreino] = useState('');

  const [conexao, setConexao] = useState<boolean>(true);

  const formatarHora = (text: string) => {
    let digits = text.replace(/\D/g, '');
    digits = digits.substring(0, 4);
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}:${digits.substring(2)}`;
    }
    return digits;
  };

  const saveData = async () => {
    try {
      await AsyncStorage.multiSet([
        ['@pse_selected', selected.toString()],
        ['@pse_value', pseValue.toString()],
        ['@pse_resposta', pseResposta],
        ['@pse_duracao', duracao.toString()],
        ['@pse_inicioTreino', inicioTreino]
      ]);
    } catch (e) {
      console.log('Erro ao salvar dados:', e);
    }
  };
  useEffect(() => {
    saveData();
  }, [selected, duracao, inicioTreino]);
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedSelected = await AsyncStorage.getItem('@pse_selected');
        const savedPSEValue = await AsyncStorage.getItem('@pse_value');
        const savedPSEResposta = await AsyncStorage.getItem('@pse_resposta');
        const savedDuracao = await AsyncStorage.getItem('@pse_duracao');
        const savedInicioTreino = await AsyncStorage.getItem('@pse_inicioTreino');

        if (savedSelected) setSelected(parseInt(savedSelected));
        if (savedPSEValue) setPSEValue(parseInt(savedPSEValue));
        if (savedPSEResposta) setPseResposta(savedPSEResposta);
        if (savedDuracao) setDuracao(parseInt(savedDuracao));
        if (savedInicioTreino) setInicioTreino(savedInicioTreino);
      } catch (e) {
        console.log('Erro ao carregar dados:', e);
      }
    };

    loadSavedData();
  }, []);
  useEffect(() => {
  // Sugere 60 minutos se não houver valor salvo
  if (!duracao || duracao === 0) {
    setDuracao(60);
  }
  
  // Sugere hora atual se não houver valor salvo
  if (!inicioTreino) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setInicioTreino(`${hours}:${minutes}`);
  }
}, []);

  useEffect(() => {
    (async () => {
      try {
        const savedSelected     = await AsyncStorage.getItem('@pse_selected');
        const savedPSEValue     = await AsyncStorage.getItem('@pse_value');
        const savedPSEResposta  = await AsyncStorage.getItem('@pse_resposta');
        const savedDuracao      = await AsyncStorage.getItem('@pse_duracao');
        const savedInicioTreino = await AsyncStorage.getItem('@pse_inicioTreino');

        if (savedSelected !== null)     setSelected(parseInt(savedSelected));
        if (savedPSEValue !== null)     setPSEValue(parseInt(savedPSEValue));
        if (savedPSEResposta !== null)  setPseResposta(savedPSEResposta);
        if (savedDuracao !== null)      setDuracao(parseInt(savedDuracao));
        if (savedInicioTreino !== null) setInicioTreino(savedInicioTreino);
      } catch (e) {
        console.log('Erro carregando estado do PSE:', e);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular');
    });
    return () => unsubscribe();
  }, []);

  const responderPSE = async () => {
    if (duracao === 0) {
      Alert.alert("Tempo de treino não preenchido.", "É necessário preencher o tempo de duração de seu treino.");
      return;
    }
    const data = new Date();
    let dia: string | number = data.getDate();
    let mes: string | number = data.getMonth() + 1;
    const ano: number = data.getFullYear();
    const hora: number = data.getHours();
    if (dia < 10) dia = `0${dia}`;
    if (mes < 10) mes = `0${mes}`;
    const minuto: number | string = data.getMinutes();
    const fimDoTreino: string = `${hora}:${minuto}`;

    let fichaLetra = '';
    if (ficha && ficha.Exercicios && ficha.Exercicios.length > 0) {
      fichaLetra = ficha.Exercicios[0].ficha;
      console.log("Ficha Letra: ", fichaLetra);
      console.log("Ficha de exercícios: ", ficha.Exercicios[0].ficha);
    } else if (ficha && ficha.ficha) {
      fichaLetra = ficha.ficha;
      console.log("Ficha Letra: ", ficha.ficha);
    }

    let tipoTreino: string = `Ficha de Treino - ${fichaLetra}`;
    if (typeof ficha !== 'undefined') {
      tipoTreino = `Diario - ${fichaLetra}`;
    }

    let inicioFinal = inicioTreino;
    if (!inicioFinal || inicioFinal.trim() === '') {
      inicioFinal = diario.inicio;
    }

    if (isNaN(duracao)) {
      return Alert.alert("Valor inválido.", "Preencha a duração apenas com números.");
    }

    const diarioSalvo: object = {
      fimDoTreino: fimDoTreino,
      duracao: duracao,
      inicio: inicioFinal,
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
    };

    if (conexao) {
      await setDoc(
        doc(firebaseBD, 'Academias', aluno.Academia, 'Alunos', `${aluno.email}`, `Diarios`, `Diario${ano}|${mes}|${dia}`),
        diarioSalvo
      );
      console.log("Diário salvo com sucesso:", diarioSalvo);
      console.log("Detalhamento:",detalhamento);
      if (typeof detalhamento !== 'undefined' && detalhamento.Exercicios && detalhamento.Exercicios.length > 0) {
        detalhamento.Exercicios.forEach(element => {
          setDoc(
            doc(firebaseBD, 'Academias', aluno.Academia, 'Alunos', `${aluno.email}`, `Diarios`, `Diario${ano}|${mes}|${dia}`, 'Exercicio', element.Nome),
            { ...element }
          );
        });
      }
      if (!detalhamento || !detalhamento.Exercicios || detalhamento.Exercicios.length === 0) {
        if (!(detalhamento && detalhamento.aviso && detalhamento.aviso.includes("sem detalhamento"))) {
          Alert.alert("Detalhamento não preenchido", "Você não preencheu os exercícios detalhados do seu treino.");
          return;
        }
      }

      Alert.alert('Resposta registrada com sucesso!', 'Seus dados de treino foram salvos com sucesso no banco de dados.');
      await AsyncStorage.multiRemove([
        '@pse_selected',
        '@pse_value',
        '@pse_resposta',
        '@pse_duracao',
        '@pse_inicioTreino'
      ]);
      navigation.navigate('Home');
    } else {
        try {
        const diarioString: string = JSON.stringify(diarioSalvo);
        await AsyncStorage.setItem(`Diario ${ano}|${mes}|${dia}`, diarioString);
        if (typeof detalhamento !== 'undefined') {
          detalhamento.Exercicios.forEach(async (i, index) => {
            const exercicioString = JSON.stringify(i);
            const dataChave = `${ano}|${mes}|${dia}`;
            await AsyncStorage.setItem(`Diario ${dataChave} - Exercicio ${index}`, exercicioString);
          });}
          await AsyncStorage.multiRemove([
        '@pse_selected',
        '@pse_value',
        '@pse_resposta',
        '@pse_duracao',
        '@pse_inicioTreino'
      ]);
        Alert.alert('Sem conexão a internet', 'Procure responder o PSE quando estiver conectado à internet.');
      } catch (error) {
        console.log("Erro: ", error);
      }
    }
  };

  return (
    <Modal animationType="slide">
       <View style={{ flex: 1 }}>
        <View style={style.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={style.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={estilo.corPrimaria.color}
          />
        </TouchableOpacity>
        <Text style={[estilo.tituloH427px, style.headerTitle]}>
          {tipoPSE}
        </Text>
      </View>
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
                AsyncStorage.setItem('@pse_selected', i.toString());
                AsyncStorage.setItem('@pse_value', i.toString());
                AsyncStorage.setItem('@pse_resposta', opt);
              }}
            />

            <Text style={[estilo.tituloH619px, { marginVertical: '3%' }]}>Informe o tempo de treino, em minutos:</Text>
            <TextInput
              onChangeText={text => {
                const num = parseInt(text) || 0;
                setDuracao(num);
                AsyncStorage.setItem('@pse_duracao', num.toString());
              }}
              keyboardType="numeric"
              placeholder="Informe o tempo de treino"

              style={[
                estilo.corLight,
                style.botaoInput,
                duracao === 0 ? { borderWidth: 1, borderColor: 'red' } : {},
              ]}
              value={duracao === 0 ? '' : duracao.toString()}
            />

            <Text style={[estilo.tituloH619px, { marginVertical: '3%' }]}>
              Horário de início do treino (opcional):
            </Text>
            <TextInput
              onChangeText={text => {
                const formatted = formatarHora(text);
                setInicioTreino(formatted);
                AsyncStorage.setItem('@pse_inicioTreino', formatted);
              }}
              placeholder="Formato HH:MM (ex: 08:50)"
              keyboardType="numbers-and-punctuation"
              style={[estilo.corLight, style.botaoInput]}
              value={inicioTreino}
              maxLength={5} 
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
        </View>
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
    marginTop: 20,
  },
  botaoInput: {
    width: '90%',
    height: 50,
    borderRadius: 5,
    padding: 10,
  },header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: estilo.corLightMenos1.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    color: estilo.corPrimaria.color,
    fontSize: 20,
  }
});
