import React, { useState, useEffect } from 'react'
import { Text, SafeAreaView, StyleSheet, View, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native'
import Estilo from "../estilo"
import Botao from '../Botao'
import InputTexto from '../InputTexto'
import Logo from '../Logo'
import { useFonts } from 'expo-font';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CadastroScreen from './CadastroScreen'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebase } from '../configuracoes/firebaseconfig/config'
import NetInfo from '@react-native-community/netinfo';
import ModalSemConexao from '../ModalSemConexao'
import Modal from 'react-native-modal'
import { FontAwesome5 } from '@expo/vector-icons';
import { collection, collectionGroup, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Aluno } from '../../classes/Aluno'
import { Endereco } from '../../classes/Endereco'




const alunoLogado = new Aluno()
const enderecoAluno = new Endereco()
const enderecoAcademia = new Endereco()



export default ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Montserrat': require('../../assets/Montserrat-Light.ttf'),
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [conexao, setConexao] = useState(true)
  const [alunoData, setAlunoData] = useState()


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular')
    })

    return () => {
      unsubscribe()
    }
  }, [])


  const handleCadastro = () => {
    if (!conexao) {
      navigation.navigate('Modal sem conexão');
    } else {
      navigation.navigate('Cadastro');
    }
  }


  const handleLogin = () => {
    if (!conexao) {
      navigation.navigate('Modal sem conexão');
    } else {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          navigation.navigate('Principal');
        })
        .catch((error) => {
          let mensagemDeErro = ''
          switch (error.code) {
            case 'auth/invalid-email':
              mensagemDeErro = 'Email inválido. Tente novamente.'
              break;
            case 'auth/wrong-password':
              mensagemDeErro = 'Senha incorreta.'
              break;
            case 'auth/user-not-found':
              mensagemDeErro = 'Usuário não encontrado. Tente novamente.'
              break;
            default:
              mensagemDeErro = "Erro desconhecido. Tente novamente mais tarde."
          }
          alert(mensagemDeErro)
        });
    }
  };
  const [emailRecuperacao, setEmailRecuperacao] = useState('')

  const mudarSenha = (email) => {
    if (email === '') {
      Alert.alert("Email não informado", "Informe o email antes de prosseguir.")
    } else {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        Alert.alert("Email enviado", "Foi enviado um email para recuperação de senha.")
        setModalVisible(false)
      }
      ).catch((error) => {
        Alert.alert("Erro:", error)
        setModalVisible(false)
      })
    }

  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConexao(state.type === 'wifi' || state.type === 'cellular')
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();

        for (const key of keys) {
          const value = await AsyncStorage.getItem(key);
          console.log(`Chave: ${key}, Valor: ${value}`);
        }
      } catch (error) {
        console.error('Erro ao obter dados do AsyncStorage:', error);
      }
    };

    fetchData();
  }, [])

  const checkWifiConnection = () => {
    NetInfo.fetch().then((state) => {
      if (state.type === 'wifi' || state.type === 'cellular') {
        console.log('Conectado ao Wi-Fi');
        setConexao(true)
      } else {
        console.log('Não conectado ao Wi-Fi');
        setConexao(false)
      }
    });
  };
  useEffect(() => {
    checkWifiConnection();
  }, []);

  const saveValueFunction = async () => {
    try {
      if (email) {
        await AsyncStorage.setItem('email', email);
        setEmail('');
      }

      if (password) {
        await AsyncStorage.setItem('senha', password);
        setPassword('');
      }
    } catch (error) {
      console.error('Erro ao salvar dados no AsyncStorage:', error);
    } finally {
      getValueFunction()
    }
  };
  const getValueFunction = async () => {
    const alunoLocalTeste = await AsyncStorage.getItem('alunoLocal')
    const academiaLocal = await AsyncStorage.getItem('academia')
    const alunoObj = JSON.parse(alunoLocalTeste)
    const academiaObj = await getAcademia(alunoObj.Academia)
    console.log('alunoObj', alunoObj)
    console.log('academiaObj ', academiaObj)
    if (alunoObj !== null) {
      try {
        const storedEmail = await AsyncStorage.getItem('alunoLocal');

        const dadosAluno = JSON.parse(storedEmail)
        
        
        console.log('dadosAluno', dadosAluno)

        console.log("dadosAluno.endereco", dadosAluno.endereco)
        alunoLogado.setNome(dadosAluno.nome);
        alunoLogado.setEmail(dadosAluno.email);
        alunoLogado.setSenha(dadosAluno.senha)
        alunoLogado.setDiaNascimento(dadosAluno.diaNascimento);
        alunoLogado.setMesNascimento(dadosAluno.mesNascimento);
        alunoLogado.setAnoNascimento(dadosAluno.anoNascimento);
        alunoLogado.setSexo(dadosAluno.sexo);
        alunoLogado.setProfissao(dadosAluno.profissao);
        alunoLogado.setCpf(dadosAluno.cpf);
        alunoLogado.setProfessor(dadosAluno.professorResponsavel)
        alunoLogado.setTelefone(dadosAluno.telefone);
        enderecoAluno.setBairro(dadosAluno.endereco.bairro)
        enderecoAluno.setCep(dadosAluno.endereco.cep)
        enderecoAluno.setCidade(dadosAluno.endereco.cidade)
        enderecoAluno.setEstado(dadosAluno.endereco.estado)
        enderecoAluno.setRua(dadosAluno.endereco.rua)
        enderecoAluno.setNumero(dadosAluno.endereco.numero)
        alunoLogado.setAcademia(dadosAluno.academia)


        console.log("ACademiaOjb", academiaObj)

        enderecoAcademia.setBairro(academiaObj.endereco.bairro)
        enderecoAcademia.setRua(academiaObj.endereco.rua)
        enderecoAcademia.setCidade(academiaObj.endereco.cidade)
        enderecoAcademia.setEstado(academiaObj.endereco.estado)
        enderecoAcademia.setNumero(academiaObj.endereco.numero)
        const emailAluno = dadosAluno.email
        setEmail(emailAluno || '');

        const senhaAluno = dadosAluno.senha
        setPassword(senhaAluno || '');

        if (emailAluno && senhaAluno) {
          if (conexao) {
            await firebase.auth().signInWithEmailAndPassword(emailAluno, senhaAluno);
          }
         navigation.navigate('Principal', { aluno: dadosAluno, academia: academiaObj });
        }
      } catch (error) {
        console.error('Erro ao obter dados do AsyncStorage ou fazer login:', error);
      }
    }
  };

  const fetchAlunoData = async () => {
    const firebaseBD = getFirestore()
   
  try {
    const alunosQuery = query(
      collectionGroup(firebaseBD, 'Alunos'),
      where('email', '==', email) 
    );

    const querySnapshot = await getDocs(alunosQuery);
    querySnapshot.forEach((doc) => {
      const alunoData = doc.data();
      console.log('Aluno encontrado:', alunoData);
      
      setAlunoData(alunoData);
      alunoLogado.setNome(alunoData.nome);
      const alunoString = JSON.stringify(alunoData);
      AsyncStorage.setItem('alunoLocal', alunoString);
      academiaDoAluno = alunoData.Academia
      
    });
  } catch (error) {
    console.log('Erro ao buscar os dados do aluno:', error);
  } finally {
    saveValueFunction()
  }
}

const getAcademia = async (nomeAcademia) => {
  const db = getFirestore()
  let academiaObj = {}
  try { 
    const academiaRef = doc(db, 'Academias', nomeAcademia)
    const queryAcademia = await getDoc(academiaRef)

    academiaObj = queryAcademia.data()

  } catch (error){
    Alert.alert("Academia não encontrada", "Ocorreu um erro ao buscar pela academia. Tente novamente mais tarde.")
    console.log(error)
  }
  return academiaObj
}
  
  return (
    <SafeAreaView style={[Estilo.corLightMenos1]}>
      <View style={style.container}>
        <View style={style.areaLogo}>
          <Logo tamanho="grande" style={[Estilo.tituloH619px]}></Logo>
          
        </View>
        <View style={style.areaLogin}>
          <Text style={[Estilo.tituloH619px]}> Email: </Text>
          <TextInput
            placeholder="Email"
            value={email}
            style={[style.inputText, Estilo.corLight, style.Montserrat]}
            onChangeText={(text) => setEmail(text)}
          >
          </TextInput>
          <Text style={[Estilo.tituloH619px]}> Senha: </Text>
          <TextInput
            placeholder="Senha"
            secureTextEntry={true}
            value={password}
            style={[style.inputText, Estilo.corLight, style.Montserrat]}
            onChangeText={(text) => setPassword(text)}
          >
          </TextInput>

          <TouchableOpacity onPress={() => fetchAlunoData()}
            style={[Estilo.corPrimaria, style.botao, Estilo.sombra, Estilo.botao]}>
            <Text
              style={[Estilo.tituloH523px, Estilo.textoCorLight]}>ENTRAR</Text>
          </TouchableOpacity>
          <View style={[style.textoLink, style.ultimoLink]}>
            <Text
              style={[
                Estilo.textoCorPrimaria,
                Estilo.textoSmall12px,
                { fontFamily: 'Montserrat' },
              ]}
              onPress={() => { handleCadastro() }}
            >
              Não possui conta? Cadastre-se agora gratuitamente
            </Text>
          </View>
          <View style={[{ marginTop: '10%' }, Estilo.centralizado]}>
            <Text
              style={[
                Estilo.textoCorPrimaria,
                Estilo.textoSmall12px,
              ]}
              onPress={() => //{ mudarSenha()}}
                setModalVisible(true)
              }
            >
              Esqueceu sua senha? Aperte aqui.

              <Modal isVisible={modalVisible}  >
                <View style={[{ height: '60%', justifyContent: 'space-around', alignItems: 'center' },]}>
                  <Text style={[Estilo.tituloH619px, Estilo.textoCorLight, { textAlign: 'center' }]}>Digite seu email abaixo. Enviaremos um email para recuperação de senha.</Text>
                  <FontAwesome5 name="user-lock" size={90} color="#0066FF" />
                  <TextInput
                    placeholder="Senha"
                    value={emailRecuperacao}
                    style={[style.inputText, Estilo.corLight]}
                    onChangeText={(text) => setEmailRecuperacao(text)}
                  >
                  </TextInput>
                  <TouchableOpacity style={[Estilo.botao, Estilo.corPrimaria]} onPress={() => mudarSenha(emailRecuperacao)}>
                    <Text style={[Estilo.textoCorLight, Estilo.tituloH619px]}>ENVIAR EMAIL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[Estilo.botao, { borderWidth: 5, borderColor: '#0066FF' }]} onPress={() => setModalVisible(false)}>
                    <Text style={[Estilo.textoCorLight, Estilo.tituloH619px]}>CANCELAR</Text>
                  </TouchableOpacity>
                </View>


              </Modal>
            </Text>
          </View>
        </View>
      </View>

    </SafeAreaView>
  )
}
export {alunoLogado, enderecoAluno}

const style = StyleSheet.create({
  container: {
    marginBottom: '5%',
    height: '100%'
  },
  areaLogo: {
    marginTop: '5%'
  },
  areaLogin: {
    marginTop: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%',
  },

  textoLink: {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderBottomWidth: 1,
    marginTop: '5%',
    borderBottomColor: '#0066FF'
  },
  botaoLogin: {
    width: 170,
    paddingVertical: 11,
    paddingHorizontal: 45,
    borderRadius: 100,
    marginTop: '15%',

  },
  inputText: {
    width: '100%',
    padding: 10,
    height: 50,
    borderRadius: 10,
    marginVertical: 15,
    elevation: 10
  },
  ultimoLink: {
    top: 10
  }

})