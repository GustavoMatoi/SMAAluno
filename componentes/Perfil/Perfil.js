import React, { useState, useEffect } from "react"
import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import BotaoLight from "../BotaoLight"
import estilo from "../estilo"
import Caixa from "./Caixa"
import { useFonts } from "expo-font"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from "firebase/auth";
import NetInfo from '@react-native-community/netinfo';
import { AntDesign } from '@expo/vector-icons';
import {alunoLogado,enderecoAluno} from "../NavegacaoLoginScreen/LoginScreen";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default ({ navigation, route }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const { aluno } = route.params
  const [fontsLoaded] = useFonts({
    'Montserrat': require('../../assets/Montserrat-Light.ttf'),
  })
  const [conexao, setConexao] = useState(true)
  console.log("endereço",enderecoAluno)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular')
    })
    console.log("endereço",enderecoAluno)
    return () => {
      unsubscribe()
    }
  }, [])
  const handleDeleteAccount = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Alert.alert("Erro", "Nenhum usuário autenticado.");
            return;
        }

        const firebaseBD = getFirestore();

        const alunosQuery = query(
            collectionGroup(firebaseBD, 'Alunos'),
            where('email', '==', alunoLogado.getEmail())
        );

        const querySnapshot = await getDocs(alunosQuery);
        querySnapshot.forEach(async (docSnapshot) => {
            const alunoRef = doc(firebaseBD, docSnapshot.ref.path);
            await deleteDoc(alunoRef);
            console.log("Documento do aluno excluído:", alunoRef.path);
        });

        await deleteUser(user);

        await AsyncStorage.clear();

        Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso.");
        navigation.navigate('Login');
    } catch (error) {
        console.error("Erro ao excluir a conta:", error.message);
        Alert.alert("Erro", "Não foi possível excluir a conta. Tente novamente mais tarde.");
    }
};


const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("Usuário deslogado com sucesso!");
      alert("Desconectado com sucesso!");
      
      await AsyncStorage.multiRemove(['email', 'senha', 'alunoLocal']);

      navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],});;
    } catch (error) {
    console.error("Erro ao deslogar: ", error.message);
    }
};
  return (
    <ScrollView>
      <SafeAreaView style={[estilo.centralizado, estilo.corLightMenos1, style.container]}>

        <View style={[style.header, estilo.corPrimaria]}>
          <Image source={imageUrl ? { uri: imageUrl } : null} />
          <Text style={[estilo.tituloH333px, estilo.centralizado, estilo.textoCorLight, { marginTop: 20 }]}>PERFIL</Text>
          <TouchableOpacity
                        style={style.logoutButton}
                        onPress={() =>
                        Alert.alert(
                            "Confirmação",
                            "Tem certeza de que deseja sair?",
                            [
                            { text: "Cancelar", style: "cancel" },
                            {
                                text: "Sair",
                                style: "destructive",
                                onPress: handleLogout,
                            },
                            ]
                        )
                        }
                    >
                <SimpleLineIcons name="logout" size={24} color="#FF6262" />
        </TouchableOpacity>
          <TouchableOpacity
                        style={style.logoutButton}
                        onPress={() =>
                        Alert.alert(
                            "Confirmação",
                            "Tem certeza de que deseja sair?",
                            [
                            { text: "Cancelar", style: "cancel" },
                            {
                                text: "Sair",
                                style: "destructive",
                                onPress: handleLogout,
                            },
                            ]
                        )
                        }
                    >
                <SimpleLineIcons name="logout" size={24} color="#FF6262" />
        </TouchableOpacity>
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

          <View style={[{ marginTop: '25%', width: '100%', alignItems: 'center' }]}>
          </View>
        </View>
        <View style={[{ width: '100%', alignItems: 'center', marginTop: -50 }, estilo.centralizado]}>
          <Caixa aluno={aluno}></Caixa>
        </View>
        <View style={[style.informacoes]}>
          <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, { marginVertical: 5 }]}>Academia:</Text>
          <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{aluno.Academia}</Text>
          <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, { marginVertical: 5 }]}>CPF:</Text>
          <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{aluno.cpf}</Text>
          <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, { marginVertical: 5 }]}>Telefone:</Text>
          <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{aluno.telefone}</Text>
          <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, { marginVertical: 5 }]}>Email:</Text>
          <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{aluno.email}</Text>
          <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, { marginVertical: 5 }]}>Profissão</Text>
          <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{aluno.profissao}</Text>
          <Text style={[estilo.textoCorSecundaria, estilo.tituloH619px, { marginVertical: 5 }]}>Endereço</Text>
          <Text style={[estilo.textoP16px, estilo.textoCorSecundaria]}>{enderecoAluno.rua}, {enderecoAluno.numero} {enderecoAluno.bairro}, {enderecoAluno.cidade}, {enderecoAluno.estado}, {enderecoAluno.cep}</Text>

        </View>
        {/*<TouchableOpacity style={[conexao ? estilo.corPrimaria : estilo.corDisabled, estilo.botao, { marginTop: '5%', marginBottom: '5%' }, estilo.sombra]} disabled={!conexao} onPress={() => navigation.navigate('Editar perfil', { aluno })}>
          <Text style={[estilo.textoSmall12px, estilo.textoCorLight, estilo.tituloH523px]}>ALTERAR FOTO</Text>
        </TouchableOpacity>*/}
        {/*<TouchableOpacity style={[estilo.botao, estilo.corDanger, estilo.sombra, {marginTop: '5%'}]} onPress={() =>
                      Alert.alert(
                        "Confirmação",
                        "Tem certeza de que deseja excluir sua conta? Seus dados serão apagados permanentemente!!",
                        [
                          { text: "Cancelar", style: "cancel" },
                          {
                            text: "Excluir",
                            style: "destructive",
                            onPress: handleDeleteAccount,
                          },
                        ]
                      )
                    }>
          <Text style={[estilo.textoSmall12px, estilo.textoCorLight, estilo.tituloH523px]}>Excluir Conta</Text>
        </TouchableOpacity>*/}
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
  },logoutButton: {
    position: 'absolute',
    top: 85,
    right: 25,
    backgroundColor: '#0066FF',
    padding: 10,
    bordercolor: '#000',
    borderRadius: 30,
    borderWidth: 0.2,
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },logoutButton: {
    position: 'absolute',
    top: 85,
    right: 25,
    backgroundColor: '#0066FF',
    padding: 10,
    bordercolor: '#000',
    borderRadius: 30,
    borderWidth: 0.2,
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  }
})