import React, { useState, useEffect } from "react"
import { Text, Button, Modal, BackHandler, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import estilo from "../estilo"
import { useFonts } from 'expo-font'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Botao from "../Botao";
import PSE from "../PSE";
import { doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { firebase, firebaseBD } from "../configuracoes/firebaseconfig/config"
import { Diario } from "../../classes/Diario";
import { DetalhamentoExercicioAerobico, DetalhamentoExercicioForca, DetalhamentoExercicioAlongamento } from "../../classes/DetalhamentoDoExercicio";
import { alunoLogado } from "../Home";
import { diarioDoDia } from "../Diario"
import { qtrDoDia } from "../Qtr"
import { detalhamento, pseDoDiario } from "../PSE/PSEOMNI";


let detalhamentoAerobicoDia = new DetalhamentoExercicioAerobico('')
let detalhamentoForcaDia = new DetalhamentoExercicioForca('')
let detalhamentoAlongamentoDia = new DetalhamentoExercicioAlongamento('')
let contadorPSE = 0
const windowHeight = Dimensions.get('window').height;

export default ({ route, navigation }) => {
    const { numeroDeSeries, tipoExercicio, nomeExercicio, series, diario, index } = route.params

    const { repeticoes } = route.params
    const [fontsLoaded] = useFonts({
        'Montserrat': require('../../assets/Montserrat-Light.ttf'),
    })

    const indexo = index
    console.log("Diario no Detalhamento ", diario)
    const nome = nomeExercicio

    console.log('index ', index)
    const [duracao, setDuracao] = useState([])
    const [descanso, setDescanso] = useState([])
    const [pesoLevantado, setPesoLevantado] = useState([]);
    const [numeroRepeticoes, setNumeroRepeticoes] = useState([]);
    const [desabilitado, setDesabilitado] = useState(true)
    const [intensidadeDoRepouso, setIntensidadeDoRepouso] = useState([])
    const [desabilitarPSES, setDesabilitarPSES] = useState(true)

    const [contadorPse, setContadorPse] = useState(0)
    const [contadorPse2, setContadorPse2] = useState(1)

    const [detalhamento, setDetalhamento] = useState({})

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove();
    }, []);

    function handleBackPress() {
        return true;
    }


    let i = 0;


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

    const handlePesoLevantado = (index, value) => {
        const newInputValues = [...pesoLevantado];
        newInputValues[index] = parseInt(value);
        setPesoLevantado(newInputValues);

    }

    const handleRepeticoes = (index, value) => {
        const newInputValues = [...numeroRepeticoes];
        newInputValues[index] = parseInt(value);

        setNumeroRepeticoes(newInputValues);

        
    }
    const handleDuracao = (index, value) => {
        const newInputValues = [...duracao];
        newInputValues[index] = parseInt(value);
        setDuracao(newInputValues);
    }

    const handleDescanso = (index, value) => {
        const newInputValues = [...descanso];
        newInputValues[index] = parseInt(value);
        setDescanso(newInputValues);

    }
    const handleIntensidadeDoRepouso = (index, value) => {
        const newInputValues = [...descanso];
        newInputValues[index] = parseInt(value);
        setIntensidadeDoRepouso(newInputValues);

    }

    let numSeries = Array()
    while (numeroDeSeries > i) {
        numSeries[i] = i + 1;
        i++
    }

    for (let i = 0; i < numeroDeSeries; i++) {
        numSeries[i] = i + 1;
    }

    let numRepeticoes = Array()

    for (let i = 0; i < series; i++) {
        numRepeticoes[i] = i + 1;
    }


    const updateDocumento = () => {
        if (tipoExercicio == 'força') {
            updateDoc(doc(firebaseBD, "Academias", `${alunoLogado.getAcademia()}`, `Professores`, `${alunoLogado.getProfessor()}`, `alunos`, `Aluno ${alunoLogado.getEmail()}`, `Diarios`, `Diario${ano}|${mes}|${dia}`, `Exercicio`, `${nomeExercicio}`), {
                Nome: nomeExercicio,
                pesoLevantado: pesoLevantado,
                repeticoes: numeroRepeticoes,
                descanso: descanso

            }
            ).then(() => {
                console.log('Novo documento criado com sucesso!');
            })
                .catch((erro) => {
                    console.error('Erro ao criar novo documento:', erro);
                });
        } else if (tipoExercicio == 'alongamento') {
            atualizaOsValores()
        } else {
            updateDoc(doc(firebaseBD, "Academias", `${alunoLogado.getAcademia()}`, `Professores`, `${alunoLogado.getProfessor()}`, `alunos`, `Aluno ${alunoLogado.getEmail()}`, `Diarios`, `Diario${ano}|${mes}|${dia}`, `Exercicio`, `${nomeExercicio}`), {
                Nome: nomeExercicio,
                intensidade: pesoLevantado,
                duracao: numeroRepeticoes,
                descanso: descanso,
                intensidadeDoRepouso: intensidadeDoRepouso
            }
            ).then(() => {
                console.log('Novo documento criado com sucesso!');
            })
                .catch((erro) => {
                    console.error('Erro ao criar novo documento:', erro);
                });
        }
    }

    const verificaCampos = (tipoExercicio, i) => {
        if (desabilitado == true) {
        }
    }

    useEffect(() => {

        if (tipoExercicio == 'força') {
            if (numSeries.length === pesoLevantado.length && numeroRepeticoes.length === numSeries.length && numSeries.length == descanso.length) {
                setDesabilitarPSES(false)
            }
        }
        if (tipoExercicio == 'alongamento') {

            if (numRepeticoes.length === pesoLevantado.length && numRepeticoes.length === numeroRepeticoes.length) {
                setDesabilitarPSES(false)
            }

        } if (tipoExercicio == 'cardio') {
            if (numSeries.length === pesoLevantado.length && numSeries.length === numeroRepeticoes.length && numSeries.length === descanso.length && numSeries.length == intensidadeDoRepouso.length) {
                setDesabilitarPSES(false)

            }
        }

    }, [pesoLevantado, numeroRepeticoes, descanso, intensidadeDoRepouso, contadorPse2])
    const [inputValuesPeso, setInputValuesPeso] = useState({});

    const handleChangeTextPesoLevantado = (value, index) => {
        if (/^\d*$/.test(value)) {
            setInputValuesPeso({ ...inputValuesPeso, [index]: value });
            handlePesoLevantado(index, value);
        }
        if (tipoExercicio === 'alongamento') {
            setDetalhamento(
                {
                    nome: nomeExercicio,
                    duracao: [...pesoLevantado],
                    descanso: [...numeroRepeticoes],

                }

            )
                console.log(numeroRepeticoes)
            diario.Exercicio[indexo - 1] = detalhamento
            console.log('Updated values:', pesoLevantado, numeroRepeticoes, detalhamento);
        
    }
    };
    const [inputValuesRepeticoes, setInputValuesRepeticoes] = useState({});

    const handleChangeTextRepeticoes = (value, index) => {
        if (/^\d*$/.test(value)) {
            setInputValuesRepeticoes({ ...inputValuesRepeticoes, [index]: value });
            handleRepeticoes(index, value);

            if (tipoExercicio === 'alongamento') {
                setDetalhamento(
                    {
                        nome: nomeExercicio,
                        duracao: [...pesoLevantado],
                        descanso: [...numeroRepeticoes],
    
                    }
    
                )
                    console.log(numeroRepeticoes)
                diario.Exercicio[indexo - 1] = detalhamento
                console.log('Updated values:', pesoLevantado, numeroRepeticoes, detalhamento);
            
        }        }
    };
    const [inputValuesDescanso, setInputValuesDescanso] = useState({});

    const handleChangeTextDescanso = (value, index) => {
        if (/^\d*$/.test(value)) {
            setInputValuesDescanso({ ...inputValuesDescanso, [index]: value });
            handleDescanso(index, value);

        }
    };
    const [inputValuesIntensidadeDoRepouso, setInputValuesIntensidadeDoRepouso] = useState({});

    const handleInputValuesIntensidadeDoRepouso = (value, index) => {
        if (/^\d*$/.test(value)) {
            setIntensidadeDoRepouso({ ...inputValuesDescanso, [index]: value });
            handleIntensidadeDoRepouso(index, value);
        }
    };


    const atualizaOsValores = () => {
        if (tipoExercicio === 'alongamento') {
                setDetalhamento(
                    {
                        nome: nomeExercicio,
                        duracao: pesoLevantado,
                        descanso: numeroRepeticoes,
    
                    }
    
                )
                    console.log(numeroRepeticoes)
                diario.Exercicio[indexo - 1] = detalhamento
                console.log('Updated values:', pesoLevantado, numeroRepeticoes, detalhamento);
            
        }
    }

    return (
        <ScrollView>
            <SafeAreaView style={[estilo.textoCorLightMenos1, style.container, estilo.corLightMenos1]}>
                <SafeAreaView style={[style.conteudo, { marginTop: '10%' }]}>

                    <Text style={[estilo.tituloH427px]}>Detalhes do exercício: {nomeExercicio}</Text>
                    {tipoExercicio == 'força' || tipoExercicio == 'cardio' ?
                        <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Série</Text> :
                        tipoExercicio == 'alongamento' ?
                            <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Série (número inteiro)</Text> :
                            null
                    }
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={style.camposColuna}>
                            {numSeries.length == 0 ?
                                numRepeticoes.map((i) =>
                                    <View key={`keySerie${i}`}  >
                                        <View style={[style.quadrado, estilo.corLightMais1]} >
                                            <Text style={[estilo.textoP16px, style.Montserrat]}>{i}</Text>
                                        </View>
                                    </View>
                                )
                                : numSeries.map((i) =>
                                    <View key={`keySerie${i}`}  >
                                        <View style={[style.quadrado, estilo.corLightMais1]} >
                                            <Text style={[estilo.textoP16px, style.Montserrat]}>{i}</Text>
                                        </View>
                                    </View>
                                )}
                        </View>
                    </ScrollView>
                    {tipoExercicio == 'força' ?
                        <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Peso levantado (kg)</Text> :
                        tipoExercicio == 'alongamento' ?
                            <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Duração</Text> :
                            tipoExercicio == 'cardio' ?
                                <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Intensidade (km/h)</Text> :
                                null
                    }
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat]}>Preencha os campos abaixo</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={style.camposColuna}>
                            {numSeries.length > 0 ? numSeries.map((i) =>
                                <View key={tipoExercicio == 'força' ? `keyPesoSerie${i - 1}` :
                                    tipoExercicio == 'cardio' ? `keyVelocidadeSerie${i - 1}` : null}>
                                    <TextInput
                                        keyboardType="numeric"
                                        placeholder={
                                            tipoExercicio == 'força'
                                                ? `Peso serie${i}`
                                                : tipoExercicio == 'cardio'
                                                    ? `Vel. Serie${i}`
                                                    : tipoExercicio == 'alongamento'
                                                        ? `Dur. serie${i}`
                                                        : null
                                        }
                                        style={[style.quadrado, { textAlign: 'center' }]}
                                        key={i - 1}
                                        value={inputValuesPeso[i - 1] || ''}
                                        onChangeText={(value) => { console.log(value); handleChangeTextPesoLevantado(value, i - 1) }}
                                    />
                                </View>
                            ) :
                                numRepeticoes.map((i) =>
                                    <View key={`keyDuracaoSerie${i}`}>
                                        <TextInput
                                            keyboardType="numeric"
                                            placeholder={
                                                tipoExercicio == 'força'
                                                    ? `Peso serie${i}`
                                                    : tipoExercicio == 'cardio'
                                                        ? `Vel. Serie${i}`
                                                        : tipoExercicio == 'alongamento'
                                                            ? `Dur. serie${i}`
                                                            : null
                                            }
                                            style={[style.quadrado, { textAlign: 'center' }]}
                                            key={i - 1}
                                            value={inputValuesPeso[i - 1] || ''}
                                            onChangeText={(value) => { console.log(value); handleChangeTextPesoLevantado(value, i - 1) }}
                                        />
                                    </View>
                                )
                            }
                        </View>
                    </ScrollView>


                    {tipoExercicio == 'força' ?
                        <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Repetições (número inteiro)</Text> :
                        tipoExercicio == 'alongamento' ?
                            <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Descanso (segundos)</Text> :
                            tipoExercicio == 'cardio' ?
                                <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Duração (minutos)</Text> :
                                null
                    }
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat]}>Preencha os campos abaixo</Text>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={style.camposColuna}>
                            {numSeries.length > 0 ?
                                numSeries.map((i) =>
                                    <View key={tipoExercicio == 'força' ? `keyRepsSerie${i}` :
                                        tipoExercicio == 'cardio' ? `keyDuracao${i}` : null} >
                                        <TextInput
                                            keyboardType="numeric"
                                            placeholder={
                                                tipoExercicio == 'força'
                                                    ? `Reps serie${i}`
                                                    : tipoExercicio == 'cardio'
                                                        ? `Dur. Serie${i}`
                                                        : tipoExercicio == 'alongamento'
                                                            ? `Desc. serie${i}`
                                                            : null
                                            }
                                            style={[style.quadrado, { textAlign: 'center' }]}
                                            key={i - 1}
                                            value={inputValuesRepeticoes[i - 1] || ''}
                                            onChangeText={(value) => { console.log(value); handleChangeTextRepeticoes(value, i - 1) }}
                                        />
                                    </View>
                                ) :
                                numRepeticoes.map((i) =>
                                    <View key={`keyDescSerie${i}`} >
                                        <TextInput
                                            keyboardType="numeric"
                                            placeholder={
                                                tipoExercicio == 'força'
                                                    ? `Peso serie${i}`
                                                    : tipoExercicio == 'cardio'
                                                        ? `Vel. Serie${i}`
                                                        : tipoExercicio == 'alongamento'
                                                            ? `Desc. serie${i}`
                                                            : null
                                            }
                                            style={[style.quadrado, { textAlign: 'center' }]}
                                            key={i - 1}
                                            value={inputValuesRepeticoes[i - 1] || ''}
                                            onChangeText={(value) => { console.log(value); handleChangeTextRepeticoes(value, i - 1) }}
                                        />
                                    </View>
                                )}
                        </View>
                    </ScrollView>

                    {tipoExercicio == 'cardio' || tipoExercicio == 'força' ?
                        <>
                            <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Descanso (segundos)</Text>
                            <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat]}>Preencha os campos abaixo</Text>

                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style={style.camposColuna}>
                                    {numSeries.map((i) =>
                                        <View key={`keyDescansoSerie${i}`}>
                                            <TextInput
                                                keyboardType="numeric"
                                                placeholder={`Desc. Serie${i}`
                                                }
                                                style={[style.quadrado, { textAlign: 'center' }]}
                                                key={i - 1}
                                                value={inputValuesDescanso[i - 1] || ''}
                                                onChangeText={(value) => { console.log(value); handleChangeTextDescanso(value, i - 1) }}
                                            />
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </> : null}
                    {tipoExercicio == 'cardio' ?
                        <>
                            <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>Intensidade do repouso (km/h)</Text>
                            <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat]}>Preencha os campos abaixo</Text>

                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style={style.camposColuna}>
                                    {numSeries.map((i) =>
                                        <View key={`keyDescansoSerie${i}`}>
                                            <TextInput
                                                keyboardType="numeric"
                                                placeholder={`IdR. Serie${i}`
                                                }
                                                style={[style.quadrado, { textAlign: 'center' }]}
                                                key={i - 1}
                                                onChangeText={(value) => { console.log(value); handleInputValuesIntensidadeDoRepouso(value, i - 1) }}
                                            />
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </> : null}
                    <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>PSE do exercício</Text>
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat]}>Responda em ordem os formulários abaixo</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={style.camposColuna}>
                            {tipoExercicio == 'força' ? numSeries.map((i) =>
                                <View key={`keyPSEdoExercicioForca${i}`}>
                                    <TouchableOpacity
                                        style={desabilitarPSES ? [style.quadrado, estilo.corDisabled, { borderRadius: 15 }] : contadorPse >= i ? [style.quadrado, estilo.corSuccess, { borderRadius: 15 }] : [style.quadrado, estilo.corPrimaria, { borderRadius: 15 }]}
                                        disabled={desabilitarPSES}
                                        onPress={() => { setContadorPse(i++); setContadorPse2(contadorPse); navigation.navigate('PSE Omni', { nomeExercicio: nome, serie: i - 1 });; verificaCampos(tipoExercicio, i - 1) }}>
                                        <MaterialCommunityIcons name="checkbox-multiple-marked-outline" size={60} color="white" />
                                        <Text style={[estilo.textoSmall12px, { marginBottom: 3 }, style.Montserrat, estilo.textoCorLight]}>PSE Série{i}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : tipoExercicio == 'cardio' ? numSeries.map((i) =>
                                <View key={`keyPSEDoExercicioAerobico${i}`}>
                                    <TouchableOpacity
                                        disabled={desabilitarPSES}
                                        style={desabilitarPSES ? [style.quadrado, estilo.corDisabled, { borderRadius: 15 }] : contadorPse >= i ? [style.quadrado, estilo.corSuccess, { borderRadius: 15 }] : [style.quadrado, estilo.corPrimaria, { borderRadius: 15 }]}
                                        onPress={() => { setContadorPse(i++); setContadorPse2(contadorPse); console.log("iiiii" + i + " " + "contadorPSE: " + contadorPse2); navigation.navigate('PSE Borg', { nomeExercicio: nome, serie: i - 1 }); verificaCampos(tipoExercicio, i - 1) }}>
                                        <MaterialCommunityIcons name="checkbox-multiple-marked-outline" size={60} color="white" />
                                        <Text style={[estilo.textoSmall12px, { marginBottom: 3 }, style.Montserrat, estilo.textoCorLight]}>PSE Série{i}</Text>
                                    </TouchableOpacity>
                                </View>) :
                                tipoExercicio == 'alongamento' ?
                                    numRepeticoes.map((i) =>
                                        <View key={`keyPSEExercicioAlongamento${i}`}>
                                            <TouchableOpacity
                                                disabled={desabilitarPSES}
                                                style={desabilitarPSES ? [style.quadrado, estilo.corDisabled, { borderRadius: 15 }] : contadorPse >= i ? [style.quadrado, estilo.corSuccess, { borderRadius: 15 }] : [style.quadrado, estilo.corPrimaria, { borderRadius: 15 }]}
                                                onPress={() => { setContadorPse2(contadorPse); setContadorPse(i++);  navigation.navigate('Perflex', { nomeExercicio: nome, repeticao: i - 1, diario: diario, index: index - 1 }); verificaCampos(tipoExercicio, i - 1) }}>
                                                <MaterialCommunityIcons name="checkbox-multiple-marked-outline" size={60} color="white" />
                                                <Text style={[estilo.textoSmall12px, { marginBottom: 3 }, style.Montserrat, estilo.textoCorLight]}>PSE Repet.{i}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : null
                            }
                        </View>
                    </ScrollView>
                    <View style={style.botaoResponder}>
                        <TouchableOpacity
                            disabled={
                                (numSeries.length !== 2 || numRepeticoes.length !== 2)
                                    ? (contadorPse2 !== numSeries.length - 1 && contadorPse2 !== numRepeticoes.length - 1)
                                    : (contadorPse2 !== numSeries.length - 2 && contadorPse2 !== numRepeticoes.length - 2)
                            }
                            style={[style.botaoResponderPSE, estilo.botao, estilo.corPrimaria]}
                            onPress={() => { updateDocumento(); navigation.goBack() }}>

                            <Text style={[estilo.textoCorLight, estilo.tituloH523px]}>ENVIAR</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </SafeAreaView>
        </ScrollView>

    )
}

const style = StyleSheet.create({
    container: {
        height: windowHeight + 250,
        width: '100%',
    },
    conteudo: {
        width: '95%',
        marginLeft: '5%'
    },
    camposColuna: {
        flexDirection: 'row',
        padding: 15
    },
    camposInput: {
        justifyContent: 'space-around',
        marginTop: 20
    },
    quadrado: {
        width: 75,
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        elevation: 5,
        marginRight: 15
    },
    Montserrat: {
        fontFamily: 'Montserrat'
    },
    botaoResponder: {
        marginTop: '10%'
    },
    botaoResponderPSE: {
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 15,
        width: '60%',
        marginTop: '20%'
    }
})