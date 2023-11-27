import React, {useState, useEffect} from "react"
import {Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert} from 'react-native'
import BotaoLight from "../BotaoLight"
import estilo from "../estilo"
import Caixa from "./Caixa"
import {useFonts} from "expo-font"

import { getAuth, signOut } from "firebase/auth";
import NetInfo from '@react-native-community/netinfo';
import { AntDesign } from '@expo/vector-icons';


export default ({navigation, route}) => {
    const [imageUrl, setImageUrl] = useState(null);
    const {aluno} = route.params
      const [fontsLoaded] = useFonts({
          'Montserrat': require('../../assets/Montserrat-Light.ttf'),
      })
      const [conexao, setConexao] = useState(true)

      useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
          setConexao(state.type === 'wifi' || state.type === 'cellular')
        })
    
        return () => {
          unsubscribe()
        }
      }, [])
        const handleLogout = () => {
            const auth = getAuth()
            signOut(auth)
              .then(() => {
                console.log("Usuário deslogado com sucesso!");
                alert("Desconectado com sucesso!")
                navigation.navigate('Login')
            })
              .catch((error) => {
                console.error(error.message);
              });
          };

    return (
        <ScrollView>
        <SafeAreaView style={[estilo.centralizado, estilo.corLightMenos1, style.container]}>
        
            <View style={[style.header, estilo.corPrimaria]}>
            <Image source={imageUrl ? { uri: imageUrl } : null} />
                <Text style={[estilo.tituloH333px, estilo.centralizado, estilo.textoCorLight, {marginTop: 20}]}>PERFIL</Text>
                {!conexao ?
        <TouchableOpacity onPress={() => {
          Alert.alert(
            "Modo Offline",
            "Atualmente, o seu dispositivo está sem conexão com a internet. Por motivos de segurança, o aplicativo oferece funcionalidades limitadas nesse estado. Durante o período offline, os dados são armazenados localmente e serão sincronizados com o banco de dados assim que uma conexão estiver disponível."
          );
        }} style={[estilo.centralizado, { marginTop: '10%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
          <Text style={[estilo.textoP16px, estilo.textoCorDisabled]}>MODO OFFLINE - </Text>
          <AntDesign name="infocirlce" size={20} color="#CFCDCD" />
        </TouchableOpacity>
        : null}
        
                <View style={[{marginTop: '25%', width: '100%', alignItems: 'center'}]}>
                </View>                
            </View>
            <View style={[{width: '100%', alignItems: 'center', marginTop: -50}, estilo.centralizado]}>
                <Caixa aluno={aluno}></Caixa>
            </View>
            <View style={[style.informacoes]}>
                <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, {marginVertical: 5}]}>CPF:</Text>
                <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{aluno.cpf}</Text>
                <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, {marginVertical: 5}]}>Telefone:</Text>
                <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{aluno.telefone}</Text>
                <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, {marginVertical: 5}]}>Email:</Text>
                <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{aluno.email}</Text>
                <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, {marginVertical: 5}]}>Profissão</Text>
                <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{aluno.profissao}</Text>
                <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, {marginVertical: 5}]}>Endereço</Text>
                <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{aluno.endereco.rua}, {aluno.endereco.numero} {aluno.endereco.complemento}, {aluno.endereco.bairro}, {aluno.endereco.cidade}, {aluno.endereco.estado}, {aluno.endereco.cep}</Text>

   </View>
         <TouchableOpacity style={[conexao ? estilo.corPrimaria: estilo.corDisabled, estilo.botao, {marginTop: '5%', marginBottom: '5%'}, estilo.sombra]} disabled={!conexao} onPress={()=>navigation.navigate('Editar perfil')}>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorLight, estilo.tituloH523px]}>ALTERAR FOTO</Text>
                    </TouchableOpacity>        
         <TouchableOpacity style={[conexao ? estilo.corPrimaria: estilo.corDisabled, estilo.botao, {marginTop: '5%', marginBottom: '5%'}, estilo.sombra]} disabled={!conexao} onPress={()=>{handleLogout()}}>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorLight, estilo.tituloH523px]}>SAIR</Text>
                    </TouchableOpacity>        
            </SafeAreaView>
        </ScrollView>

    )
}

const style = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%'
    },
    header: {
        width: '100%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'center'
    },
    informacoes: {
        width: '100%',
        marginLeft: '5%',
        marginTop: '10%'
    },
})