import React from "react"
import {Text, View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native'
import estilo from "../estilo"
import { AntDesign } from '@expo/vector-icons'; 
import InputTexto from "../InputTexto";
import Botao from "../Botao";
import {useFonts} from 'expo-font'

export default ({navigation}) => {
    const [fontsLoaded] = useFonts({
        'Montserrat': require('../../assets/Montserrat-Light.ttf'),
    })
    return (
        <SafeAreaView style={[style.container, estilo.textoCorLightMenos1]}>
            <View style={[style.conteudos]}>
            <AntDesign name="unlock" size={200} color="#182128" />
            <Text style={[estilo.tituloH333px, estilo.textoCorSecundaria, style.Montserrat]}>NOVA SENHA</Text>
            <Text style={[estilo.textoCorSecundaria,{textAlign: 'center'}, estilo.textoP16px, style.Montserrat]}>Informe sua nova senha.</Text>
            </View>
            <View>
                <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Nova senha:</Text>
                <InputTexto texto='Senha'></InputTexto>
            </View>
            <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>navigation.navigate('Modal Success Senha')}>
                <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>ALTERAR SENHA</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: '5%'
    },
    conteudos: {
        marginTop: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: '15%'
    },
    Montserrat: {
        fontFamily: 'Montserrat'
    }

})