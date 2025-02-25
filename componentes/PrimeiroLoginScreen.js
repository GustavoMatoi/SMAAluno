import React from "react"
import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native"
import Logo from './Logo'
import estilo from "./estilo"
import Botao from "./Botao"
import { novoAluno } from "./NavegacaoLoginScreen/CadastroScreen"

export default ({navigation}) => {
    return (
        <SafeAreaView 
        style={style.container}>
            <Logo/>
            <Text 
            style= {[estilo.tituloH427px, estilo.textoCorSecundaria, style.tituloAlinhado]}>Boas vindas, {novoAluno.getNome()} !</Text>
            <Text 
            style={[estilo.textoCorDanger, estilo.textoP16px, style.textoAlinhado]}
             numberOfLines={5}
             onPress={() => navigation.navigate('PARQ')}
             >Para montarmos o seu treino personalizado, precisamos de algumas informações.
              {'\n'}{'\n'}Clique no botão abaixo para preencher o PAR-Q e a Anamnese.</Text>
            <TouchableOpacity style={[style.botaoPARQANAMNESE, estilo.corSecundaria]} onPress={() => navigation.navigate('PARQ')} >
                <Text style={[estilo.textoCorLightMais1, estilo.tituloH619px]}>PAR-Q E ANAMNESE</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        marginVertical: '5%'
    },
    tituloAlinhado: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '5%'
    },
    textoAlinhado: {
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: '15%',
        textDecorationLine: 'underline',
    },

    botaoPARQANAMNESE: {
        width: '90%',
        height: 60,
        marginTop: '15%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }

})