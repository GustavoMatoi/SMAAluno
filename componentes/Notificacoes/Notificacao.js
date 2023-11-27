import React, {useEffect, useState} from 'react'
import {Text, View, SafeAreaView, StyleSheet, TouchableOpacity,Modal, ScrollView, TextInput} from 'react-native'
import estilo from '../estilo'
import {useFonts} from 'expo-font'

export default ({tipo,remetente, data, texto, titulo, pressando}) => {
    const [fontsLoaded] = useFonts({
        'Montserrat': require('../../assets/Montserrat-Light.ttf'),
    })
    const [modalVisible, setModalVisible] = useState(false)

    if (tipo == 'professor'){
        return (
            <TouchableOpacity style={[style.container, estilo.corPrimariaMenos1]}>
                <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, style.alinhamentoTitulo]}>  
                {data} - {titulo}
                </Text>
                <Text style={[style.alinhamentoTitulo, estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>
                {texto} - {remetente}
                </Text>

            </TouchableOpacity>
)
    } else {
        return (
            <TouchableOpacity style={[style.container, estilo.corDisabled]}>
                <Text style={[estilo.tituloH619px, estilo.textoCorDarkMenos1, style.alinhamentoTitulo]}>  
                  {data} - {titulo}
                </Text>
                <Text style={[style.alinhamentoTitulo, estilo.textoP16px, estilo.textoCorDarkMenos1, style.Montserrat]}>
                    {texto} - {remetente}
                </Text>

            </TouchableOpacity>
)
    }

}

const style = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 100,
        maxHeight: 500,
        marginVertical: 5
    },
    alinhamentoTitulo: {
        paddingHorizontal: 7,
        paddingVertical: 5
    },
    Montserrat: {
        fontFamily: 'Montserrat'
    }
    }
)