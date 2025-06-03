import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import estilo from "../estilo";
import RadioBotao from "../RadioBotao";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default ({ navigation, route }) => {
    const { diario, ficha, aluno } = route.params;
    const exercicios = ficha.Exercicios || [];
    const fichasUnicas = [...new Set(exercicios.map(item => item.ficha))];
    const [fichaSelecionada, setFichaSelecionada] = useState('')
    const [selecionado, setSelecionado] = useState(-1)
    const detalhamentoInicial = {
    Exercicios: Array(ficha.Exercicios.length).fill({})
    };

    const handleSelecaoFicha = (fichaSelecionada) => {
        const fichaFiltrada = { ...ficha, Exercicios: exercicios.filter(item => item.ficha === fichaSelecionada) };
        if(selecionado == -1){
         return Alert.alert("Selecione uma ficha", "É necessário selecionar uma ficha antes de prosseguir.")  
        }
        if (diario.maneiraDeTreino === "Ficha") {
            navigation.navigate('Ficha', { diario, ficha: fichaFiltrada, aluno });
        } else {
            navigation.navigate('Diario', { detalhamento: detalhamentoInicial, diario, ficha: fichaFiltrada, aluno, detalhamento: {} });
        }
    };

    return (
        <ScrollView style={style.container}>
            <SafeAreaView style={[estilo.centralizado, style.header]}>
                <View style={style.headerContent}>
                    <MaterialCommunityIcons name="newspaper-variant-multiple-outline" size={24} color="black" />
                    <Text style={[estilo.textoCorDark, estilo.tituloH240px, style.titulo]}>Escolha sua Ficha</Text>
                </View>
            </SafeAreaView>
            <SafeAreaView style={[estilo.corLightMenos1, style.body]}>
                {fichasUnicas.length > 0 ?
                    <View style={[style.radioContainer]}>
                        <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>Fichas disponíveis:</Text>
                        <RadioBotao
                            options={fichasUnicas}
                            horizontal={false}
                            selected={selecionado}
                            onChangeSelect={(opt, i) => { setFichaSelecionada(opt); setSelecionado(i); console.log(opt, i) }}
                            style={style.botaoFicha}
                        />

                        <TouchableOpacity style={[estilo.botao, estilo.corPrimaria, {flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '20%'}]} onPress={() => handleSelecaoFicha(fichaSelecionada)}>
                            <MaterialCommunityIcons name="weight-lifter" size={25} color="white" />
                            <Text style={[estilo.tituloH523px, estilo.textoCorLight]}>Treinar!</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    (
                        diario.maneiraDeTreino === "Ficha"
                            ? navigation.navigate('Ficha', { diario, ficha, aluno })
                            : navigation.navigate('Diario', { diario, ficha, aluno, detalhamento: {} })
                    )
                }
            </SafeAreaView>
        </ScrollView>
    );
};



const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFF',
    },
    header: {
        marginTop: 50,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginLeft: 10,
    },
    body: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 20,
    },
    radioContainer: {
        justifyContent: 'center',
        marginBottom: 30
    },
    botaoFicha: {
        backgroundColor: '#0066FF',
        padding: 15,
        marginVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    textoAviso: {
        color: '#FF6F61',
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
});