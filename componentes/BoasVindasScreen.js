import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'; 
import {Text, View, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native'
import estilo from './estilo'
import {useFonts} from 'expo-font'

export default ({navigation}) => {

    const [fontsLoaded] = useFonts({
        'Montserrat': require('../assets/Montserrat.ttf'),
    })

    return (
       <SafeAreaView style={[estilo.corLightMenos1, style.container]}>
        <View style={[estilo.centralizado, { width: '90%'}]}>
            <FontAwesome5 name="smile-wink" size={150} color="#182128" style={estilo.centralizado}/>
            <Text style={[estilo.tituloH523px, estilo.textoCorSecundaria, estilo.centralizado, {marginTop: '10%'}]}>CADASTRO CONCLUÍDO!</Text>
            <Text style={[estilo.textoCorSecundaria, estilo.textoP16px,style.Montserrat, {marginVertical: '10%', textAlign: 'center'}]}>
                Notificamos o professor escolhido por você sobre a sua solicitação de avaliação. 
                Após o professor visualizar sua solicitação, ele marcará uma avaliação física e você 
                será notificado pelo app. Lembre-se de vir com roupas mais leves para a avaliação! </Text>
            <TouchableOpacity style={[estilo.botao, estilo.corSuccess]} onPress={()=>{navigation.navigate('Login')}}>
                <Text style={[estilo.textoCorLight, estilo.tituloH523px]}>CONCLUIR</Text>
            </TouchableOpacity>
        </View>


        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center'
    },
    Montserrat: {
        fontFamily: 'Montserrat'
    }
})