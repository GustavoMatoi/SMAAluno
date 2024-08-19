import React, {useEffect, useState} from 'react'
import {Text, View, SafeAreaView, StyleSheet, TouchableOpacity,Modal, ScrollView, TextInput} from 'react-native'
import estilo from '../estilo'
import {useFonts} from 'expo-font'


export default  ({versao}) => {
    const [fontsLoaded] = useFonts({
        'Montserrat': require('../../assets/Montserrat-Light.ttf'),
    });
    const [modalVisible, setModalVisible] = useState(false);

    return ( 
        <SafeAreaView>
            <TouchableOpacity style={[style.container, estilo.corPrimariaMenos1]}>
                <Text style={[style.alinhamentoTitulo, estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat]}>
                    Versao: {versao}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

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