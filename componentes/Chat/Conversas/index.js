import React, {useState, useEffect} from "react";
import {Text, View, SafeAreaView, ScrollView, Image, StyleSheet, TouchableOpacity} from 'react-native'
import estilo from "../../estilo";
import Foto from "./Foto";
export default ({professor, navigation, backgroundColor, aluno}) => {
    console.log( professor.professor.nome)
    console.log("ALUNO conversas", aluno)
    return (
        <TouchableOpacity style={[style.chat, estilo.corLight, {backgroundColor: backgroundColor}]} onPress={() =>navigation.navigate('Mensagens', {professor: professor, aluno: aluno})}> 
        <View>
        <Foto cpf={professor.professor.cpf}/>

        </View>
        <View style={[style.informacoes]}>
            <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px]}>{professor.professor.nome}</Text>
            <Text style={[estilo.textoCorSecundariaMenos1, estilo.textoSmall12px]}>{professor.professor.email} </Text>
        </View>

        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    chat: {
        width: '100%',
        height: 80, 
        borderWidth: 1,
        borderColor: '#F2EDED',
        marginBottom: 5,
        flexDirection: 'row',
        padding: 5,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    informacoes: {
        flexDirection: 'column',
        marginLeft: 10,
        marginTop: 10
    },

})