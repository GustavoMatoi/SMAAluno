import React from 'react'
import {View, Text} from 'react-native'
import estilo from './estilo'

export default props => {
    return (
        <View style={estilo.centralizado}>
            <Text style={[estilo.tituloH619px, estilo.textoCorSecundaria, {textAlign: 'center', padding: 10}]}>{props.texto}</Text>
        </View>
    )
}
