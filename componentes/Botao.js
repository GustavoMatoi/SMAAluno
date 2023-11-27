import React from "react"
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native'
import estilo from "./estilo"
export default props => {
    return (
        <TouchableOpacity style={[estilo.corPrimaria, style.botao, estilo.sombra]}
        >
            <Text 
            style={[estilo.tituloH523px, estilo.textoCorLight]}>{props.texto}</Text>
        </TouchableOpacity>

    )
}

const style = StyleSheet.create({
    botao: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        alignItems: 'center',
        width: 300,
        borderRadius: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,  
    },
})
