import React from "react"
import {Text, View, TextInput, StyleSheet} from 'react-native'
import estilo from "./estilo"
export default props=>{
    return (
        <View>
            <TextInput 
            placeholder={props.texto} 
            placeholderTextColor={'#CFCDCD'} 
            style={[estilo.sombra, estilo.corLight, style.inputText]}
            value={props.valor}>
            </TextInput>
        </View>
    )
}

const style = StyleSheet.create({
    inputText: {
        width: '90%',
        height: 50,
        marginTop: 10,
        marginBottom: 30,
        borderRadius: 10,
        elevation: 10,
        paddingHorizontal: 20,
    }
})