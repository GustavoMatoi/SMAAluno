import React, { useState, useEffect } from "react";
import {
  Text,
  BackHandler,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import estilo from "../estilo";
import { useFonts } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  DetalhamentoExercicioAerobico,
  DetalhamentoExercicioForca,
  DetalhamentoExercicioAlongamento,
} from "../../classes/DetalhamentoDoExercicio";

const windowHeight = Dimensions.get("window").height;

export default ({ route, navigation }) => {
  // Parâmetros vindos da navegação
  const {
    numeroDeSeries,   // pode vir como 0, null ou "-"
    tipoExercicio,    // "força", "alongamento" ou "cardio"
    nomeExercicio,
    diario,
    index,            // índice no array de detalhamento
    detalhamento,     // objeto de Detalhamento contendo Exercicios[]
  } = route.params;

  // Carregando fonte Montserrat (caso seja necessário)
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/Montserrat-Light.ttf"),
  });

  const nome = nomeExercicio || "";

  // Detecta se é "Cardio sem séries" (numeroDeSeries <= 0 ou "-")
  const isCardioSemSeries =
    tipoExercicio === "cardio" &&
    (!numeroDeSeries || numeroDeSeries === 0 || numeroDeSeries === "-");

  // Estados de array de séries: [1,2,...] ou [1] se cardio sem séries
  const [numSeries, setNumSeries] = useState([]);

  // Estados para valores digitados (strings), ajustados conforme numSeries
  const [pesoLevantado, setPesoLevantado] = useState([]); // Força ou Intensidade (cardio)
  const [numeroRepeticoes, setNumeroRepeticoes] = useState([]); // Reps (força) ou Duração (cardio)
  const [descanso, setDescanso] = useState([]); // Descanso (força) ou (cardio c/ séries)
  const [intensidadeDoRepouso, setIntensidadeDoRepouso] = useState([]); // só para cardio c/ séries

  // Mapas para exibir valor no TextInput
  const [inputValuesPeso, setInputValuesPeso] = useState({});
  const [inputValuesRepeticoes, setInputValuesRepeticoes] = useState({});
  const [inputValuesDescanso, setInputValuesDescanso] = useState({});
  const [inputValuesIntensidadeDoRepouso, setInputValuesIntensidadeDoRepouso] =
    useState({});

  // Estados para controle do PSE (quantos já respondidos)
  const [contadorPse, setContadorPse] = useState(0);
  const [contadorPse2, setContadorPse2] = useState(0);

  // Botão PSE habilitado ou não
  const [desabilitarPSES, setDesabilitarPSES] = useState(true);

  // 1) Monta o array de séries conforme tipoExercicio e numeroDeSeries :contentReference[oaicite:2]{index=2}
  useEffect(() => {
    let arr = [];
    if (tipoExercicio === "cardio") {
      // Se cardio sem séries → pelo menos 1 slot genérico
      if (isCardioSemSeries) {
        arr = [1];
      } else {
        // Cardio com séries definidas (>0)
        for (let i = 0; i < numeroDeSeries; i++) {
          arr[i] = i + 1;
        }
      }
    } else {
      // Força / Alongamento → segue numeroDeSeries (0 → [])
      if (numeroDeSeries && numeroDeSeries > 0) {
        for (let i = 0; i < numeroDeSeries; i++) {
          arr[i] = i + 1;
        }
      }
    }
    setNumSeries(arr);
  }, [numeroDeSeries, tipoExercicio]);

  // 2) Toda vez que numSeries mudar, reajusta o tamanho dos arrays de valores
  useEffect(() => {
    const tamanho = numSeries.length;
    setPesoLevantado(Array(tamanho).fill(""));
    setNumeroRepeticoes(Array(tamanho).fill(""));
    setDescanso(Array(tamanho).fill(""));
    setIntensidadeDoRepouso(Array(tamanho).fill(""));
  }, [numSeries]);

  // Funções para atualizar cada campo (permite somente dígitos) :contentReference[oaicite:3]{index=3}
  const handleChangeTextPesoLevantado = (value, idx) => {
    if (/^\d*$/.test(value)) {
      const copia = [...pesoLevantado];
      copia[idx] = value;
      setPesoLevantado(copia);
      setInputValuesPeso({ ...inputValuesPeso, [idx]: value });
    }
  };
  const handleChangeTextRepeticoes = (value, idx) => {
    if (/^\d*$/.test(value)) {
      const copia = [...numeroRepeticoes];
      copia[idx] = value;
      setNumeroRepeticoes(copia);
      setInputValuesRepeticoes({ ...inputValuesRepeticoes, [idx]: value });
    }
  };
  const handleChangeTextDescanso = (value, idx) => {
    if (/^\d*$/.test(value)) {
      const copia = [...descanso];
      copia[idx] = value;
      setDescanso(copia);
      setInputValuesDescanso({ ...inputValuesDescanso, [idx]: value });
    }
  };
  const handleChangeTextIntensidadeDoRepouso = (value, idx) => {
    if (/^\d*$/.test(value)) {
      const copia = [...intensidadeDoRepouso];
      copia[idx] = value;
      setIntensidadeDoRepouso(copia);
      setInputValuesIntensidadeDoRepouso({
        ...inputValuesIntensidadeDoRepouso,
        [idx]: value,
      });
    }
  };

  // 3) Habilita/desabilita botão de PSE conforme preenchimento :contentReference[oaicite:4]{index=4}
  useEffect(() => {
    if (tipoExercicio === "força") {
      if (
        pesoLevantado.filter((v) => v !== "").length === numSeries.length &&
        numeroRepeticoes.filter((v) => v !== "").length === numSeries.length &&
        descanso.filter((v) => v !== "").length === numSeries.length
      ) {
        setDesabilitarPSES(false);
      } else {
        setDesabilitarPSES(true);
      }
    } else if (tipoExercicio === "alongamento") {
      if (
        pesoLevantado.filter((v) => v !== "").length === numSeries.length &&
        numeroRepeticoes.filter((v) => v !== "").length === numSeries.length
      ) {
        setDesabilitarPSES(false);
      } else {
        setDesabilitarPSES(true);
      }
    } else if (tipoExercicio === "cardio") {
      if (isCardioSemSeries) {
        // Cardio sem séries: basta duração (numeroRepeticoes[0])
        if (numeroRepeticoes[0] && numeroRepeticoes[0] !== "") {
          setDesabilitarPSES(false);
        } else {
          setDesabilitarPSES(true);
        }
      } else {
        // Cardio com séries: exige todos os quatro campos preenchidos
        if (
          pesoLevantado.filter((v) => v !== "").length === numSeries.length &&
          numeroRepeticoes.filter((v) => v !== "").length === numSeries.length &&
          descanso.filter((v) => v !== "").length === numSeries.length &&
          intensidadeDoRepouso.filter((v) => v !== "").length ===
            numSeries.length
        ) {
          setDesabilitarPSES(false);
        } else {
          setDesabilitarPSES(true);
        }
      }
    }
  }, [
    pesoLevantado,
    numeroRepeticoes,
    descanso,
    intensidadeDoRepouso,
    numSeries,
    isCardioSemSeries,
  ]);

  // 4) Atualiza o objeto detalhamento ao clicar em “ENVIAR”
  const updateDocumento = () => {
    if (!detalhamento || !detalhamento.Exercicios) return;
    const det = detalhamento.Exercicios[index - 1] || {};

    if (tipoExercicio === "alongamento") {
      det.Nome = nome;
      det.duracao = pesoLevantado.map((v) => parseInt(v) || 0);
      det.descanso = numeroRepeticoes.map((v) => parseInt(v) || 0);
    } else if (tipoExercicio === "força") {
      det.Nome = nome;
      det.pesoLevantado = pesoLevantado.map((v) => parseInt(v) || 0);
      det.repeticoes = numeroRepeticoes.map((v) => parseInt(v) || 0);
      det.descanso = descanso.map((v) => parseInt(v) || 0);
    } else if (tipoExercicio === "cardio") {
      det.Nome = nome;
      det.intensidade = pesoLevantado.map((v) => parseInt(v) || 0);
      det.duracao = numeroRepeticoes.map((v) => parseInt(v) || 0);
      det.descanso = descanso.map((v) => parseInt(v) || 0);
      det.intensidadeDoRepouso = intensidadeDoRepouso.map((v) =>
        parseInt(v) || 0
      );
    }
  };

  // 5) Salvar ao pressionar hardware back (Android)  
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        updateDocumento();
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  // Header com botão de voltar
  const Header = () => (
    <View style={style.header}>
      <TouchableOpacity
        onPress={() => {
          updateDocumento();
          navigation.goBack();
        }}
        style={style.backButton}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={28}
          color={estilo.corPrimaria.color}
        />
      </TouchableOpacity>
      <Text style={[estilo.tituloH427px, style.headerTitle]}>
        Detalhes do exercício
      </Text>
    </View>
  );

  return (
    <ScrollView>
      <SafeAreaView
        style={[
          estilo.textoCorLightMenos1,
          style.container,
          estilo.corLightMenos1,
        ]}
      >
        <Header />

        <SafeAreaView style={style.conteudo}>
          {/* ---------- Nome do Exercício ---------- */}
          <Text style={[estilo.tituloH523px]}>{nomeExercicio}</Text>

          {/* ---------- Rótulo “Série” (se aplicável) ---------- */}
          {(tipoExercicio === "força" ||
            tipoExercicio === "alongamento" ||
            (tipoExercicio === "cardio" && !isCardioSemSeries)) && (
            <Text
              style={[
                estilo.textoP16px,
                estilo.textoCorSecundaria,
                style.Montserrat,
              ]}
            >
              Série
              {tipoExercicio === "alongamento" ? " (número inteiro)" : ""}
            </Text>
          )}

          {/* ---------- Quadradinhos numerados de “Série” ---------- */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={style.camposColuna}>
              {(tipoExercicio === "força" ||
                tipoExercicio === "alongamento" ||
                (tipoExercicio === "cardio" && !isCardioSemSeries)) &&
                numSeries.map((s) => (
                  <View key={`keySerie${s}`}>
                    <View style={[style.quadrado, estilo.corLightMais1]}>
                      <Text style={[estilo.textoP16px, style.Montserrat]}>
                        {s}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          </ScrollView>

          {/* ======== BLOCOS DE INPUT ======== */}

          {/* 1) Primeiro bloco: 
              - Força → “Peso levantado (kg)”
              - Alongamento → “Duração (segundos)”
              - Cardio sem séries → “Intensidade (km/h)”
              - Cardio c/ séries → “Intensidade (km/h) Série n”
          */}
          {tipoExercicio === "força" && (
            <>
              <Text
                style={[
                  estilo.textoP16px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Peso levantado (kg)
              </Text>
              <Text
                style={[
                  estilo.textoSmall12px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Preencha os campos abaixo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={style.camposColuna}>
                  {numSeries.map((s, idx) => (
                    <View key={`keyPesoSerie${idx}`}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder={`Peso Série ${s}`}
                        style={[style.quadrado, { textAlign: "center" }]}
                        value={inputValuesPeso[idx] || ""}
                        onChangeText={(value) =>
                          handleChangeTextPesoLevantado(value, idx)
                        }
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          {tipoExercicio === "alongamento" && (
            <>
              <Text
                style={[
                  estilo.textoP16px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Duração (segundos)
              </Text>
              <Text
                style={[
                  estilo.textoSmall12px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Preencha os campos abaixo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={style.camposColuna}>
                  {numSeries.map((s, idx) => (
                    <View key={`keyDuracaoSerie${idx}`}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder={`Dur. Série ${s}`}
                        style={[style.quadrado, { textAlign: "center" }]}
                        value={inputValuesPeso[idx] || ""}
                        onChangeText={(value) =>
                          handleChangeTextDuracao && // (reaproveitado do handleChangeTextRepeticoes)
                          handleChangeTextRepeticoes(value, idx)
                        }
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          {/* 1a) Cardio sem séries (Ex.: esteira sem campo “séries”, “descanso” ou “velocidade” na ficha) */}
          {isCardioSemSeries && (
            <>
              <Text
                style={[
                  estilo.textoP16px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Intensidade (km/h)
              </Text>
              <Text
                style={[
                  estilo.textoSmall12px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Preencha o campo abaixo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={style.camposColuna}>
                  <View key="keyCardioSemSerie_Vel">
                    <TextInput
                      keyboardType="numeric"
                      placeholder="Velocidade"
                      style={[style.quadrado, { textAlign: "center" }]}
                      value={inputValuesPeso[0] || ""}
                      onChangeText={(value) =>
                        handleChangeTextPesoLevantado(value, 0)
                      }
                    />
                  </View>
                </View>
              </ScrollView>

              <Text
                style={[
                  estilo.textoP16px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Duração (minutos)
              </Text>
              <Text
                style={[
                  estilo.textoSmall12px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Preencha o campo abaixo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={style.camposColuna}>
                  <View key="keyCardioSemSerie_Dur">
                    <TextInput
                      keyboardType="numeric"
                      placeholder="Dur. Exercício"
                      style={[style.quadrado, { textAlign: "center" }]}
                      value={inputValuesRepeticoes[0] || ""}
                      onChangeText={(value) =>
                        handleChangeTextRepeticoes(value, 0)
                      }
                    />
                  </View>
                </View>
              </ScrollView>
            </>
          )}

          {/** 2) Segundo bloco:
                  - Força → “Repetições (número inteiro)”
                  - Alongamento → “Descanso (segundos)”
                  - Cardio com séries → “Duração (minutos) Série n”
              **/}
          {tipoExercicio === "força" && (
            <>
              <Text
                style={[
                  estilo.textoP16px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Repetições (número inteiro)
              </Text>
              <Text
                style={[
                  estilo.textoSmall12px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Preencha os campos abaixo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={style.camposColuna}>
                  {numSeries.map((s, idx) => (
                    <View key={`keyRepsSerie${idx}`}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder={`Reps Série ${s}`}
                        style={[style.quadrado, { textAlign: "center" }]}
                        value={inputValuesRepeticoes[idx] || ""}
                        onChangeText={(value) =>
                          handleChangeTextRepeticoes(value, idx)
                        }
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          {tipoExercicio === "alongamento" && (
            <>
              <Text
                style={[
                  estilo.textoP16px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Descanso (segundos)
              </Text>
              <Text
                style={[
                  estilo.textoSmall12px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Preencha os campos abaixo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={style.camposColuna}>
                  {numSeries.map((s, idx) => (
                    <View key={`keyDescSerie${idx}`}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder={`Desc. Série ${s}`}
                        style={[style.quadrado, { textAlign: "center" }]}
                        value={inputValuesRepeticoes[idx] || ""}
                        onChangeText={(value) =>
                          handleChangeTextRepeticoes(value, idx)
                        }
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          {isCardioSemSeries === false && tipoExercicio === "cardio" && (
            <>
              <Text
                style={[
                  estilo.textoP16px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Duração (minutos)
              </Text>
              <Text
                style={[
                  estilo.textoSmall12px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Preencha os campos abaixo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={style.camposColuna}>
                  {numSeries.map((s, idx) => (
                    <View key={`keyDuracaoSerie${idx}`}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder={`Dur. Série ${s}`}
                        style={[style.quadrado, { textAlign: "center" }]}
                        value={inputValuesRepeticoes[idx] || ""}
                        onChangeText={(value) =>
                          handleChangeTextRepeticoes(value, idx)
                        }
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          {/* 3) Terceiro bloco:
                - Força → “Descanso (segundos)”
                - Cardio c/ séries → “Descanso (segundos) Série n”
            */}
          {tipoExercicio === "força" && (
            <>
              <Text
                style={[
                  estilo.textoP16px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Descanso (segundos)
              </Text>
              <Text
                style={[
                  estilo.textoSmall12px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Preencha os campos abaixo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={style.camposColuna}>
                  {numSeries.map((s, idx) => (
                    <View key={`keyDescForca${idx}`}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder={`Desc. Série ${s}`}
                        style={[style.quadrado, { textAlign: "center" }]}
                        value={inputValuesDescanso[idx] || ""}
                        onChangeText={(value) =>
                          handleChangeTextDescanso(value, idx)
                        }
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          {isCardioSemSeries === false && tipoExercicio === "cardio" && (
            <>
              <Text
                style={[
                  estilo.textoP16px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Descanso (segundos)
              </Text>
              <Text
                style={[
                  estilo.textoSmall12px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Preencha os campos abaixo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={style.camposColuna}>
                  {numSeries.map((s, idx) => (
                    <View key={`keyDescCardio${idx}`}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder={`Desc. Série ${s}`}
                        style={[style.quadrado, { textAlign: "center" }]}
                        value={inputValuesDescanso[idx] || ""}
                        onChangeText={(value) =>
                          handleChangeTextDescanso(value, idx)
                        }
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          {/* 4) Quarto bloco: Intensidade do repouso (só para cardio c/ séries) */}
          {isCardioSemSeries === false && tipoExercicio === "cardio" && (
            <>
              <Text
                style={[
                  estilo.textoP16px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Intensidade do repouso (km/h)
              </Text>
              <Text
                style={[
                  estilo.textoSmall12px,
                  estilo.textoCorSecundaria,
                  style.Montserrat,
                ]}
              >
                Preencha os campos abaixo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={style.camposColuna}>
                  {numSeries.map((s, idx) => (
                    <View key={`keyIDR${idx}`}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder={`IdR. Série ${s}`}
                        style={[style.quadrado, { textAlign: "center" }]}
                        value={inputValuesIntensidadeDoRepouso[idx] || ""}
                        onChangeText={(value) =>
                          handleChangeTextIntensidadeDoRepouso(value, idx)
                        }
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          {/* 5) PSE do exercício */}
          <Text
            style={[
              estilo.textoP16px,
              estilo.textoCorSecundaria,
              style.Montserrat,
            ]}
          >
            PSE do exercício
          </Text>
          <Text
            style={[
              estilo.textoSmall12px,
              estilo.textoCorSecundaria,
              style.Montserrat,
            ]}
          >
            Responda em ordem os formulários abaixo
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={style.camposColuna}>
              {/* PSE força */}
              {tipoExercicio === "força" &&
                numSeries.map((s, idx) => (
                  <View key={`keyPSEForca${idx}`}>
                    <TouchableOpacity
                      disabled={desabilitarPSES}
                      style={
                        desabilitarPSES
                          ? [style.quadrado, estilo.corDisabled, { borderRadius: 15 }]
                          : contadorPse >= s
                          ? [style.quadrado, estilo.corSuccess, { borderRadius: 15 }]
                          : [style.quadrado, estilo.corPrimaria, { borderRadius: 15 }]
                      }
                      onPress={() => {
                        setContadorPse(s);
                        setContadorPse2(idx);
                        navigation.navigate("PSE Omni", {
                          omeExercicio: nome,
                          repeticao: idx,
                          diario,
                          index: index - 1,
                          detalhamento,
                        });
                      }}
                    >
                      <MaterialCommunityIcons
                        name="checkbox-multiple-marked-outline"
                        size={60}
                        color="white"
                      />
                      <Text
                        style={[
                          estilo.textoSmall12px,
                          { marginBottom: 3 },
                          style.Montserrat,
                          estilo.textoCorLight,
                        ]}
                      >
                        PSE Série {s}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}

              {/* PSE cardio */}
              {tipoExercicio === "cardio" &&
                numSeries.map((s, idx) => (
                  <View key={`keyPSECardio${idx}`}>
                    <TouchableOpacity
                      disabled={desabilitarPSES}
                      style={
                        desabilitarPSES
                          ? [style.quadrado, estilo.corDisabled, { borderRadius: 15 }]
                          : contadorPse >= s
                          ? [style.quadrado, estilo.corSuccess, { borderRadius: 15 }]
                          : [style.quadrado, estilo.corPrimaria, { borderRadius: 15 }]
                      }
                      onPress={() => {
                        setContadorPse(s);
                        setContadorPse2(idx);
                        navigation.navigate("PSE Borg", {
                          omeExercicio: nome,
                          repeticao: idx,
                          diario,
                          index: index - 1,
                          detalhamento,
                        });
                      }}
                    >
                      <MaterialCommunityIcons
                        name="checkbox-multiple-marked-outline"
                        size={60}
                        color="white"
                      />
                      <Text
                        style={[
                          estilo.textoSmall12px,
                          { marginBottom: 3 },
                          style.Montserrat,
                          estilo.textoCorLight,
                        ]}
                      >
                        {isCardioSemSeries ? "PSE Único" : `PSE Série ${s}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}

              {/* PSE alongamento */}
              {tipoExercicio === "alongamento" &&
                numSeries.map((s, idx) => (
                  <View key={`keyPSEAlong${idx}`}>
                    <TouchableOpacity
                      disabled={desabilitarPSES}
                      style={
                        desabilitarPSES
                          ? [style.quadrado, estilo.corDisabled, { borderRadius: 15 }]
                          : contadorPse >= s
                          ? [style.quadrado, estilo.corSuccess, { borderRadius: 15 }]
                          : [style.quadrado, estilo.corPrimaria, { borderRadius: 15 }]
                      }
                      onPress={() => {
                        setContadorPse(s);
                        setContadorPse2(idx);
                        navigation.navigate("Perflex", {
                          nomeExercicio: nome,
                          repeticao: idx,
                          diario,
                          index: index - 1,
                          detalhamento,
                        });
                      }}
                    >
                      <MaterialCommunityIcons
                        name="checkbox-multiple-marked-outline"
                        size={60}
                        color="white"
                      />
                      <Text
                        style={[
                          estilo.textoSmall12px,
                          { marginBottom: 3 },
                          style.Montserrat,
                          estilo.textoCorLight,
                        ]}
                      >
                        PSE Repet. {s}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </ScrollView>

          {/* Botão “ENVIAR” */}
          <View style={style.botaoResponder}>
            <TouchableOpacity
              disabled={desabilitarPSES}
              style={[style.botaoResponderPSE, estilo.botao, estilo.corPrimaria]}
              onPress={() => {
                updateDocumento();
                navigation.goBack();
              }}
            >
              <Text style={[estilo.textoCorLight, estilo.tituloH523px]}>
                ENVIAR
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
};

// ---------- Estilos ----------
const style = StyleSheet.create({
  container: {
    height: windowHeight + 250,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: estilo.corLightMenos1.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    color: estilo.corPrimaria.color,
    fontSize: 20,
  },
  conteudo: {
    width: "95%",
    marginLeft: "5%",
    marginTop: 15,
  },
  camposColuna: {
    flexDirection: "row",
    padding: 15,
  },
  quadrado: {
    width: 75,
    height: 75,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    elevation: 5,
    marginRight: 15,
  },
  Montserrat: {
    fontFamily: "Montserrat",
  },
  botaoResponder: {
    marginTop: "10%",
    alignItems: "center",
  },
  botaoResponderPSE: {
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 15,
    width: "60%",
    marginTop: "20%",
    marginBottom: "20%",
  },
});
