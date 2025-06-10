import React, { useState, useEffect, useRef } from "react"
import { Text, View, BackHandler, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, FlatList } from 'react-native'
import estilo from "../estilo"
import FichaDeTreino from "../Ficha/FichaDeTreino"
import Caixinha from "./Caixinha"
import NetInfo from '@react-native-community/netinfo';
import { Entypo } from '@expo/vector-icons';

import { AntDesign } from '@expo/vector-icons';
export default ({ navigation, route }) => {
    const backButtonRef = useRef(0)
    const [ultimaFicha, setUltimaFicha] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const { diario, ficha, aluno } = route.params

    const [conexao, setConexao] = useState(true)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConexao(state.type === 'wifi' || state.type === 'cellular')
        })

        return () => {
            unsubscribe()
        }


    }, [])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
        }

    }, [])
    const onPressHandler = () => {
        const detalhamento = {
        aviso: "Ficha de treino sem detalhamento individual de exercícios.",
        Exercicios: [] 
    };
        navigation.navigate('PSE', { diario, aluno,detalhamento,ficha });
        console.log("DIARIO ANTES DE NAVEGAR PRO PSE", diario);
    };




    const handleBackPress = () => {
        backButtonRef.current += 1
        if (backButtonRef.current === 2) {
            navigation.goBack()
            backButtonRef.current = 0
            return true
        } else {
            alert('Caso deseja trocar a maneira de treino, pressione novamente para voltar')
            return true
        }
    }


    console.log("ULTIMA FICHAAAA" + ultimaFicha)


    return (
        <ScrollView style={[estilo.corPrimaria, style.container]}>
            <SafeAreaView style={[estilo.centralizado, style.header]}>
                {!conexao ?
                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            "Modo Offline",
                            "Atualmente, o seu dispositivo está sem conexão com a internet. Por motivos de segurança, o aplicativo oferece funcionalidades limitadas nesse estado. Durante o período offline, os dados são armazenados localmente e serão sincronizados com o banco de dados assim que uma conexão estiver disponível."
                        );
                    }} style={[estilo.centralizado, { marginTop: '10%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
                        <Text style={[estilo.textoP16px, estilo.textoCorDisabled]}>MODO OFFLINE - </Text>
                        <AntDesign name="infocirlce" size={20} color="#CFCDCD" />
                    </TouchableOpacity>
                    : null}
                <Text style={[estilo.textoCorLight, estilo.tituloH240px, estilo.centralizado]}>FICHA</Text>

            </SafeAreaView>
            <SafeAreaView style={[estilo.corLightMenos1, style.body]}>
                <View style={[{ marginTop: -80, width: '90%', marginLeft: 'auto' }]}>
                    {ficha ?
                        <Caixinha responsavel={ficha.responsavel} dataFim={ficha.dataFim} dataInicio={ficha.dataInicio} objetivoDoTreino={ficha.objetivoDoTreino} />
                        : null}
                </View>
                <View style={[style.areaDaFicha]}>

                        <View>
                            {ficha ?
                                <>
                                <FichaDeTreino exercicios={ficha.Exercicios}/>
                                    <TouchableOpacity style={[estilo.corPrimaria, style.botaoResponderPSE, estilo.centralizado]} onPress={onPressHandler}>
                                        <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER PSE</Text>
                                    </TouchableOpacity>
                                </>
                                : <>
                                    <View style={[estilo.centralizado, { marginTop: '5%', marginLeft: '20%', marginRight: '20%', marginBottom: '20%' }]}>
                                        <View style={estilo.centralizado}>
                                            <Text style={[estilo.tituloH427px, estilo.textoCorSecundaria, { textAlign: 'center', fontFamily: 'Montserrat', marginTop: 50 }]}>
                                                Ops...
                                            </Text>
                                            <Entypo name="emoji-sad" size={150} color="#182128" />
                                        </View>
                                        <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, { textAlign: 'center', fontFamily: 'Montserrat' }]}>
                                            Parece que você ainda não possui nenhuma ficha de exercícios. Que tal solicitar uma ao seu professor responsável?
                                        </Text>

                                        <TouchableOpacity style={[estilo.corPrimaria, style.botaoResponderPSE, estilo.centralizado]}
                                            onPress={() => {navigation.navigate('Home') }}>
                                            <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>VOLTAR</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>}

                </View>
                                </View>

            </SafeAreaView>

        </ScrollView>
    )
}

const style = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        marginTop: 50
    },
    body: {
        marginTop: '30%',
        width: '100%',
        paddingBottom: '20%'
    },
    areaDaFicha: {
        marginTop: '5%'
    },
    botaoResponderPSE: {
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 15,
        width: '60%',
        marginTop: '20%'
    }
})
