import React from "react"
import {View, StyleSheet, SafeAreaView,ScrollView, TouchableOpacity, Text} from 'react-native'
import estilo from "./estilo"
import BotoesEvolucaoDoTreino from "./BotoesEvolucaoDoTreino"
import { AntDesign } from "@expo/vector-icons";

export default ({navigation, route}) => {
    const {aluno} = route.params
    return (
        <SafeAreaView style={[style.container, estilo.corLightMenos1]}>
                <ScrollView style={style.container2}>
                    <View style={style.constructionContainer}>
                        <AntDesign name="tool" size={60} color={estilo.textoCorDanger} />
                        <Text style={[estilo.tituloH619px, estilo.textoCorLight, style.constructionText]}>
                        Funcionalidade em construção!
                        </Text>
                        <Text style={[estilo.textoP16px, estilo.textoCorLightMenos1, style.constructionSubtitle]}>
                        Nossos desenvolvedores estão trabalhando duro para trazer essa funcionalidade o mais rápido possível.
                        </Text>
                        <Text style={[estilo.textoP14px, estilo.textoCorLightMenos1]}>
                        Aguarde novas atualizações!
                        </Text>
                    </View>
            
            {/*<View style={[style.areaBotoes]}>
                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO CORPORAL', {aluno: aluno})}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO DADOS ANTOPOMÉTRICOS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO DOS TESTES', {aluno: aluno})}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO DOS TESTES</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('SELECIONAR EXERCÍCIO', {aluno: aluno})}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO DOS EXERCÍCIOS</Text>
                </TouchableOpacity>


                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO PSE', {aluno: aluno})}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO PSE</Text>
                </TouchableOpacity>


                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO QTR', {aluno: aluno})}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO QTR</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO CIT', {aluno: aluno})}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO CIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO STRAIN', {aluno: aluno})}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO STRAIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO MONOTONIA', {aluno: aluno})}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO MONOTONIA</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('EVOLUÇÃO PSE DO EXERCÍCIO', {aluno: aluno})}>
                    <Text style={[estilo.tituloH619px, estilo.textoCorLight]}>EVOLUÇÃO PSE DO EXERCÍCIO</Text>
                </TouchableOpacity>

                </View>*/}
            </ScrollView>
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
    container2: {
        flex: 1,
      },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 100,
    },
    constructionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20, 
        backgroundColor: '#0066FF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffeeba',
        marginVertical: 20,
        marginTop: 200, 
      },
      constructionText: {
        marginVertical: 15,
        textAlign: 'center',
      },
      constructionSubtitle: {
        textAlign: 'center',
        marginBottom: 10,
      },

})