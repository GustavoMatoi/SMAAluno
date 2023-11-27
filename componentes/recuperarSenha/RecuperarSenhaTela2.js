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
            <Text style={[estilo.tituloH333px, estilo.textoCorSecundaria, style.Montserrat, {textAlign: 'center'}]}>CÓDIGO DE RECUPERAÇÃO</Text>
            <Text style={[estilo.textoCorSecundaria,{textAlign: 'center'}, estilo.textoP16px, style.Montserrat]}>Escolha uma maneira de contato a qual usaremos para enviar o código de recuperação de senha.</Text>
            </View>
            <TouchableOpacity style={[style.botaoEnviarEmail]} onPress={()=>navigation.navigate('Recuperar senha tela 3')}>
                <AntDesign name="mail" size={70} color="#182128" />    
                    <View style={style.textoBotao}>
                    <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, estilo.tituloH619px]}>
                        Via email
                    </Text>
                    <Text  style={[estilo.textoP16px, estilo.textoCorSecundaria, estilo.textoSmall12px]}>
                        seuemail@email.com
                    </Text>
                </View>
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
    },
    botaoEnviarEmail: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#182128'
    },
    textoBotao: {
        flexDirection: 'column',
        marginLeft: 10
    }


})