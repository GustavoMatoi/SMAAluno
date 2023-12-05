import React, { useState, useEffect } from "react"
import { Text, View, SafeAreaView, StyleSheet, ScrollView, Alert } from 'react-native'
import estilo from "../estilo"
import FichaDeTreino from "../Ficha/FichaDeTreino"
import Caixinha from "./Caixinha"

export default ({ route }) => {
    const { ficha } = route.params

    return (
        <ScrollView style={[estilo.corPrimaria, style.container]}>
            <SafeAreaView style={[estilo.centralizado, style.header]}>
                <Text style={[estilo.textoCorLight, estilo.tituloH240px, estilo.centralizado]}>FICHA</Text>

            </SafeAreaView>
            <SafeAreaView style={[estilo.corLightMenos1, style.body]}>
                <View style={[{ marginTop: -80, width: '90%', marginLeft: 'auto' }]}>
                    <Caixinha responsavel={ficha.responsavel} dataFim={ficha.dataFim} dataInicio={ficha.dataInicio} objetivoDoTreino={ficha.objetivoDoTreino} />
                </View>
                <View style={[style.areaDaFicha]}>
                    <FichaDeTreino exercicios={ficha.Exercicios}></FichaDeTreino>

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
        paddingBottom: '20%',
        minHeight: 580
    },
    areaDaFicha: {
        marginTop: '15%'
    }
})
