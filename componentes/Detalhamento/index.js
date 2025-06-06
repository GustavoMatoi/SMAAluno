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
  const {
    numeroDeSeries,   
    tipoExercicio,   
    nomeExercicio,
    diario,
    index,           
    detalhamento,   
  } = route.params;

  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/Montserrat-Light.ttf"),
  });

  const nome = nomeExercicio || "";

  const isCardioSemSeries =
    tipoExercicio === "cardio" &&
    (!numeroDeSeries || numeroDeSeries === 0 || numeroDeSeries === "-");

  const [numSeries, setNumSeries] = useState([]);

  const [pesoLevantado, setPesoLevantado] = useState([]); 
  const [numeroRepeticoes, setNumeroRepeticoes] = useState([]);
  const [descanso, setDescanso] = useState([]); 
  const [intensidadeDoRepouso, setIntensidadeDoRepouso] = useState([]); 
  const [inputValuesPeso, setInputValuesPeso] = useState({});
  const [inputValuesRepeticoes, setInputValuesRepeticoes] = useState({});
  const [inputValuesDescanso, setInputValuesDescanso] = useState({});
  const [inputValuesIntensidadeDoRepouso, setInputValuesIntensidadeDoRepouso] =
    useState({});
  const [contadorPse, setContadorPse] = useState(0);
  const [contadorPse2, setContadorPse2] = useState(0);

  const [desabilitarPSES, setDesabilitarPSES] = useState(true);

  useEffect(() => {
  console.log("PARAMS RECEBIDOS:", {
    numeroDeSeries,
    tipoExercicio,
    nomeExercicio,
    diario,
    index,
    detalhamento,
  });
}, []);

  useEffect(() => {
    console.log("numero de series",numeroDeSeries)
    let arr = [];
    if (tipoExercicio === "cardio") {
      if (isCardioSemSeries) {
        arr = [1];
      } else {
        for (let i = 0; i < numeroDeSeries; i++) {
          arr[i] = i + 1;
        }
      }
    } else {
      if (numeroDeSeries && numeroDeSeries > 0) {
        for (let i = 0; i < numeroDeSeries; i++) {
          arr[i] = i + 1;
        }
      }
    }
    console.log("→ ARRAY numSeries gerado:", arr);
    setNumSeries(arr);
  }, [numeroDeSeries, tipoExercicio]);

  useEffect(() => {
    const tamanho = numSeries.length;
    const newPeso = Array(tamanho).fill("");
    const newReps = Array(tamanho).fill("");
    const newDescanso = Array(tamanho).fill("");
    const newIntRep = Array(tamanho).fill("");

    setPesoLevantado(newPeso);
    setNumeroRepeticoes(newReps);
    setDescanso(newDescanso);
    setIntensidadeDoRepouso(newIntRep);

    console.log("→ Estados reiniciados para tamanho", tamanho, {
      pesoLevantado: newPeso,
      numeroRepeticoes: newReps,
      descanso: newDescanso,
      intensidadeDoRepouso: newIntRep,
    });
  }, [numSeries]);

  const handleChangeTextPesoLevantado = (value, idx) => {
      if (/^\d*$/.test(value)) {
      const copia = [...pesoLevantado];
      copia[idx] = value;
      setPesoLevantado(copia);
      setInputValuesPeso({ ...inputValuesPeso, [idx]: value });
      console.log(`Peso Série ${idx} atualizado para:`, value, "| pesoLevantado:", copia);
    } else {
      console.log("Entrada inválida em Peso:", value);
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

  useEffect(() => {
      const totalPreenchidos = {
      peso: pesoLevantado.filter((v) => v !== "").length,
      reps: numeroRepeticoes.filter((v) => v !== "").length,
      desc: descanso.filter((v) => v !== "").length,
      intRepouso: intensidadeDoRepouso.filter((v) => v !== "").length,
    };

    console.log(">> CHECAGEM PSE:", {
      tipoExercicio,
      numSeriesLength: numSeries.length,
      estados: {
        pesoLevantado,
        numeroRepeticoes,
        descanso,
        intensidadeDoRepouso,
      },
      totalPreenchidos,
      isCardioSemSeries,
    });
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
        if (numeroRepeticoes[0] && numeroRepeticoes[0] !== "") {
          setDesabilitarPSES(false);
        } else {
          setDesabilitarPSES(true);
        }
      } else {
        if (
          numeroRepeticoes.filter((v) => v !== "").length === numSeries.length &&
          descanso.filter((v) => v !== "").length === numSeries.length &&
          intensidadeDoRepouso.filter((v) => v !== "").length ===
            numSeries.length
        ) {
          setDesabilitarPSES(false);
        } else {
          console.log("Desabilitando PSEs",pesoLevantado, numeroRepeticoes, descanso, intensidadeDoRepouso);
          console.log("Filtros:", {
            reps: numeroRepeticoes.filter((v) => v !== "").length,
            desc: descanso.filter((v) => v !== "").length,
            intRepouso: intensidadeDoRepouso.filter((v) => v !== "").length,
          });
          setDesabilitarPSES(true);
        }
      }
    }
    console.log("ESTADOS PARA PSE:", {
      tipoExercicio,
      numSeriesLength: numSeries.length,
      pesoLevantado,
      numeroRepeticoes,
      descanso,
      intensidadeDoRepouso,
      isCardioSemSeries,
      filtroPeso: pesoLevantado.filter(v => v !== "").length,
      filtroReps: numeroRepeticoes.filter(v => v !== "").length,
      filtroDesc: descanso.filter(v => v !== "").length,
      filtroIntRepouso: intensidadeDoRepouso.filter(v => v !== "").length,
    });

  }, [
    pesoLevantado,
    numeroRepeticoes,
    descanso,
    intensidadeDoRepouso,
    numSeries,
    isCardioSemSeries,
  ]);

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
          <Text style={[estilo.tituloH523px]}>{nomeExercicio}</Text>
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
                          handleChangeTextRepeticoes(value, idx)
                        }
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          )}
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
              {tipoExercicio === "força" &&
                numSeries.map((s, idx) => (
                  console.log(`keyPSEForca${idx}`),
                  console.log(`contadorPse: ${contadorPse}, s: ${s}`),
                  
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
