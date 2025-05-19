import React, { useEffect, useState } from 'react'
import {View, Text, StyleSheet, SafeAreaView} from 'react-native'
import estilo from '../estilo'
import { AntDesign } from '@expo/vector-icons'; 
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { alunoLogado } from '../Home';

export default props => {
    const data = new Date();
    const dia = data.getDate()
    const mes = data.getMonth() + 1 
    const ano = data.getFullYear()


    return (
        <View style={[style.container, estilo.corLightMenos1, estilo.sombra]}>
            <Text style={[style.espacamentoTextos, estilo.textoCorSecundaria, estilo.textoP16px]}> 
            <Text style={[estilo.textoCorSecundaria,{fontWeight: 'bold'}]}>Data:</Text> {dia}/{mes}/{ano}
            </Text>
            <Text style={[estilo.textoCorSecundaria, estilo.textoP16px]}>Não se esqueça de responder o detalhamento do exercício. <AntDesign name="smileo" size={16 } color="black" />
            
            </Text>
            <Text style={[estilo.textoCorSecundaria,estilo.textoP16px]}>Obs: caso o botão para detalhes nao estiver visivel arraste para a direita.</Text>
    
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        width: '80%',
        height: 120,
        justifyContent: 'center',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 10,
        marginTop: '-10%'
    },
    espacamentoTextos: {
        marginVertical: 2
    }
})