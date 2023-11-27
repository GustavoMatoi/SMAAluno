import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Linking, // Adicione esta linha
} from "react-native";
import estilo from "../estilo";
import {useFonts} from 'expo-font'


export default ({ navigation }) => {
  const [emailBody, setEmailBody] = useState("");

  const [fontsLoaded] = useFonts({
    'Montserrat': require('../../assets/Montserrat-Light.ttf'),
})

  const handleEmail = () => {
      // Configure o e-mail do destinatário e o assunto do e-mail
      const to = ["guteixeira2001@gmail.com"];
      const subject = "Problema com o treino";
  
       // Abre o aplicativo de e-mail com as informações preenchidas
       Linking.openURL(
        `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
          emailBody
        )}`
      ).catch(console.error);
    };
    return (
        <SafeAreaView style={[style.container, estilo.corLightMenos1]}>
 <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, estilo.centralizado, style.texto, style.Montserrat]}>
                Ocorreu algum problema com a sua ficha de treino, sentiu 
                alguma dor durante a execução de algum exercício? Descreva 
                o problema que você deseja relatar:
            </Text>

          <TextInput
            multiline={true}
            numberOfLines={6}
            placeholder="Detalhe o problema"
            placeholderTextColor={"#CFCDCD"}
            onChangeText={(text) => setEmailBody(text)}
            style={[style.areaDeInput, style.Montserrat]}
          ></TextInput>
          <TouchableOpacity
            style={[estilo.corPrimaria, style.botaoEnviar, estilo.centralizado]}
            onPress={() => {
              handleEmail();
              navigation.navigate("Modal Success Relatar");
            }}
          >
            <Text style={[estilo.textoCorLight, estilo.tituloH523px]}>
              RELATAR PROBLEMA
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    };

const style = StyleSheet.create({
    container: {
        height: '100%',
        padding: 20
    },
    texto: {
        marginTop: '20%'
    },
    areaDeInput: {
        width: '95%',
        marginTop: 40,
        elevation: 4,
        textAlignVertical: 'top',
        padding: 30
    },
    botaoEnviar: {
        padding: 10,
        width: '95%',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: '45%',
    },
    Montserrat : {
        fontFamily: 'Montserrat'
    }
})