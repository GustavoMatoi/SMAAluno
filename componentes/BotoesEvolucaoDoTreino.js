import React from "react"
import {View, Text, StyleSheet, SafeAreaView,TouchableOpacity} from 'react-native'
import estilo from "./estilo"

export default props => {
    return (
        <View>
            <TouchableOpacity style={[style.botao, estilo.corPrimaria, estilo.sombra, estilo.centralizado]}>
                <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>{props.titulo}</Text>
            </TouchableOpacity>
        </View>
    )
}

const style= StyleSheet.create({
    botao: {
        width: '100%',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        marginVertical: 10
    }
})