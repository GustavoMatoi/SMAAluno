import React from "react"
import {Text, View, StyleSheet} from 'react-native'
import Estilo from "./estilo"
import Globais from "../classes/Globais"
export default props => {
    const variavelGlobal = new Globais('2.0.0');
    
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
                <Text style={[Estilo.textoP16px, Estilo.textoCorDark, style.version ]}>Versão 2.0.0</Text>
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
                <Text style={[Estilo.textoSmall12px, Estilo.textoCorDark, style.version ]}>Versão 2.0.0</Text>

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
    },version: {
        textAlign: 'center', 
        marginTop: 10,
    },
}   )