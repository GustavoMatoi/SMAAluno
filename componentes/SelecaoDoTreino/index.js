import React, { useState, useEffect } from "react"
import { Text, View, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Alert } from 'react-native'
import estilo from "../estilo"
import { Foundation } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { firebase, firebaseBD } from "../configuracoes/firebaseconfig/config"
import { alunoLogado, academiaDoAluno } from "../Home";
import { useFonts } from "expo-font"
import NetInfo from '@react-native-community/netinfo';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
const height = Dimensions.get('window').height
export default ({ navigation, route }) => {
  const { diario, ficha, aluno } = route.params
  console.log("ficha desse bicho", ficha)
  console.log('Diario na seleção do treino ', diario)
  const [fontsLoaded] = useFonts({
    'Montserrat': require('../../assets/Montserrat-Light.ttf'),
  })

  const [conexao, setConexao] = useState(true)
  const [detalhamento, setDetalhamento] = useState({})


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
     setConexao(state.type === 'wifi' || state.type === 'cellular')
    })

    return () => {
      unsubscribe()
    }
  }, [])


  const handleNavegacaoFicha = () => {
    const fichaAExiste = ficha.Exercicios.some(exercicio => exercicio.ficha === "A");

    if (fichaAExiste) {
      diario.maneiraDeTreino = "Ficha"
      navigation.navigate('Escolher Ficha', { diario: diario, ficha, aluno })
    }else{
      diario.maneiraDeTreino = "Ficha"
      navigation.navigate('Ficha', { diario: diario, ficha, aluno })
    }
  }

  const handleNavegacaoDiario = () => {
    const fichaAExiste = ficha.Exercicios.some(exercicio => exercicio.ficha === "A");

    if (!detalhamento.Exercicios) detalhamento.Exercicios = []

    if (fichaAExiste) {
      diario.maneiraDeTreino = "Diario";
      console.log('Aa')
      for (let i = 0; i < ficha.Exercicios.length; i++) {
        detalhamento.Exercicios[i] = {}
        navigation.navigate('Escolher Ficha', { diario: diario, ficha, aluno, detalhamento });
      }
    } else{
      diario.maneiraDeTreino = 'Diario'
      console.log('Aa')
      for (let i = 0; i < ficha.Exercicios.length; i++) {
        detalhamento.Exercicios[i] = {}
        navigation.navigate('Diario', { diario: diario, ficha, aluno, detalhamento });
      }
    }
  }

  return (
    <SafeAreaView style={[estilo.corLightMenos1, style.container]}>
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
        {
          ficha ? 
          <>
                 <View style={style.explicacaoContainer}>
            <View style={style.explicacaoBox}>
              <Ionicons 
                name="information-circle-outline" 
                size={28} 
                color={estilo.corPrimaria} 
                style={style.infoIcon}
              />
              <Text style={[estilo.textoP16px, style.explicacaoText]}>
                <Text style={estilo.textoNegrito}>Diário:</Text> Registro detalhado com todas as séries e repetições realizadas.
                {"\n\n"}
                <Text style={estilo.textoNegrito}>Ficha:</Text> Acompanhamento simplificado do treino.
                {"\n\n"}
<<<<<<< HEAD
                <Text style={estilo.textoNegrito}>Atenção:</Text> Treinar novamente substituirá os dados da ficha atual!
=======
                <Text style={estilo.textoNegrito}>Atenção:</Text> Treinar novamente no mesmo dia substituirá os dados da ficha atual!
>>>>>>> 27bd01c (Fix: correção de bugs no caminho na navegação das telas(variaveis,objetos...), verificação de senha correta no cadastro, modo teste do aplicativo. feat: manter a tela de CSV em manutenção, firebase teste, textos informativos para o usuario.)
              </Text>
            </View>
            
            <Text style={[estilo.textoP16px, style.psaText]}>
              Não esqueça de responder o formulário PSE para registrar sua presença!
            </Text>
          </View>
      <View style={[style.areaBotoes, estilo.centralizado]}>
        <TouchableOpacity style={[estilo.corPrimaria, style.containerBotao]} onPress={() => { handleNavegacaoFicha() }}>
          <View style={{ height: '80%' }}>
            <Foundation name="clipboard-notes" size={100} color='#FFF' />
          </View>
          <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>FICHA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[estilo.corPrimaria, style.containerBotao]} onPress={() => { handleNavegacaoDiario() }}>
          <View style={{ height: '80%' }}>
            <Ionicons name="checkbox-outline" size={100} color="#FFF" />
          </View>
          <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>DIÁRIO</Text>
        </TouchableOpacity>

      </View>
          </>
          :
          <>
                <Text style={[estilo.textoP16px, style.textoEscolha, estilo.centralizado, style.Montserrat]}>Talvez sua ficha nao tenha sido lançada, caso tenha sido recarregue o aplicativo ou converse com o seu professor responsável.</Text>
      <View style={[style.areaBotoes, estilo.centralizado]}>
        <TouchableOpacity style={[estilo.corPrimaria, style.containerBotao]} onPress={() => { navigation.navigate('Home') }}>
          <View style={{ height: '80%' }}>
            <Entypo name="back" size={100} color="#FFF" />
          </View>
          <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>VOLTAR</Text>
        </TouchableOpacity>

      </View>
          
          </>
          
          }
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    height: height,
  },
  textoEscolha: {
    textAlign: 'left',
    marginTop: '30%',
    marginBottom: 10,
    width: '80%'
  },
  areaBotoes: {
    flexDirection: 'row'
  },
  containerBotao: {
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    elevation: 10
  },
  Montserrat: {
    fontFamily: 'Montserrat'
  },explicacaoContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 25,
  },
  explicacaoBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#B6E1FF',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  explicacaoText: {
    flex: 1,
    color: '#2A2A2A',
    lineHeight: 22,
  },
  psaText: {
    marginTop: 15,
    color: estilo.corLightMenos1,
    textAlign: 'center',
    fontStyle: 'italic',
  }
})