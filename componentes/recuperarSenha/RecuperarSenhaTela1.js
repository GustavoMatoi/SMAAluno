import React, {useState} from "react"
import {Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Alert} from 'react-native'
import estilo from "../estilo"
import { AntDesign } from '@expo/vector-icons'; 
import InputTexto from "../InputTexto";
import {useFonts} from 'expo-font'
import { doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore"; 
import { firebase, firebaseBD } from "../configuracoes/firebaseconfig/config"


export default ({navigation}) => {
    const [email, setEmail] = useState("");

    const [fontsLoaded] = useFonts({
        'Montserrat': require('../../assets/Montserrat-Light.ttf'),
    })


    const handlePasswordReset = async () => {
        if (email.trim() === "") {
          Alert.alert("Erro", "Por favor, insira um e-mail válido.");
          return;
        }
      
        try {
          await firebase.auth().sendPasswordResetEmail(email);
          Alert.alert(
            "Sucesso",
            "Um e-mail foi enviado para você com as instruções de redefinição de senha."
          );
        } catch (error) {
          console.log(error);
          Alert.alert("Erro", error.message);
        }
      };

    return (
        <SafeAreaView style={[style.container, estilo.textoCorLightMenos1]}>
            <View style={[style.conteudos]}>
            <AntDesign name="lock1" size={200} color="#182128" />
            <Text style={[estilo.tituloH333px, estilo.textoCorSecundaria, style.Montserrat]}>RECUPERAR SENHA</Text>
            <Text style={[estilo.textoCorSecundaria,{textAlign: 'center'}, estilo.textoP16px, style.Montserrat]}>Informe o email associado a sua conta para redefinir sua senha.</Text>
            </View>
            <View>
                <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Seu email:</Text>
                <InputTexto texto='Informe seu email'></InputTexto>
            </View>
            <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]}  onChangeText={(text) => setEmail(text)} onPress={handlePasswordReset}>
                <Text style={[estilo.tituloH523px, estilo.textoCorLight]}>ENVIAR EMAIL </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: '5%'
    },
    conteudos: {
        marginTop: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: '15%'
    },
    Montserrat: {
        fontFamily: 'Montserrat'
    }

})