import React from "react"
import {Text, View, StyleSheet} from 'react-native'
import Estilo from "./estilo"
export default props => {
    if (props.tamanho == 'grande'){
        return (
            <View>
                <View style={style.logo}>
                    <Text style={[Estilo.tituloH148px, Estilo.textoCorSecundaria]}>ShapeMe</Text>
                    <Text style={[Estilo.tituloH148px, Estilo.textoCorPrimariaMenos1]}>App</Text>
                </View>
                <View style={[Estilo.corPrimariaMais1, style.logoAluno]}>
                        <Text style={[Estilo.tituloH333px, Estilo.textoCorLight]}>ALUNO</Text>
                </View>
            </View>
        )
    } else {
        return (
            <View>
                <View style={style.logo}>
                    <Text style={[Estilo.tituloH427px, Estilo.textoCorSecundaria]}>ShapeMe</Text>
                    <Text style={[Estilo.tituloH427px, Estilo.textoCorPrimariaMenos1]}>App</Text>
                </View>
                <View style={[Estilo.corPrimariaMais1, style.logoAlunoSmall]}>
                        <Text style={[{fontSize:15, fontWeight: 'bold'}, Estilo.textoCorLight]}>ALUNO</Text>
                </View>
            </View>            
        )
    }

}

const style = StyleSheet.create({
    logo: {
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    logoAluno: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 70,
        width: 155,
        heigh: 50,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    logoAlunoSmall: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 25,
        width: 80,
        heigh: 40,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
}   )