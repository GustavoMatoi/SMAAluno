import React from "react"
import {View, StyleSheet, SafeAreaView, TouchableOpacity, Text} from 'react-native'
import estilo from "./estilo"
import BotoesEvolucaoDoTreino from "./BotoesEvolucaoDoTreino"

export default ({navigation}) => {
    return (
        <SafeAreaView style={[style.container, estilo.corLightMenos1]}>
            <View style={[style.areaBotoes]}>
                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO CORPORAL')}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO DADOS ANTOPOMÉTRICOS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO DOS TESTES')}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO DOS TESTES</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('SELECIONAR EXERCÍCIO')}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO DOS EXERCÍCIOS</Text>
                </TouchableOpacity>


                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO PSE')}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO PSE</Text>
                </TouchableOpacity>


                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO QTR')}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO QTR</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO CIT')}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO CIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO STRAIN')}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO STRAIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO MONOTONIA')}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO MONOTONIA</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO PSE DO EXERCÍCIO')}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO PSE DO EXERCÍCIO</Text>
                </TouchableOpacity>

                </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    areaBotoes: {
        width: '90%',

    },

})