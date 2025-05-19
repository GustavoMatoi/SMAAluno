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
const dadosverif = true;


export default ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Montserrat': require('../../assets/Montserrat-Light.ttf'),
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [conexao, setConexao] = useState(true)
  const [alunoData, setAlunoData] = useState()
  const [showPassword, setShowPassword] = useState(false);


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
      checkVersion();
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          navigation.navigate('Principal', { 
            aluno: dadosAluno, 
            academia: academiaObj,
            dadosverif: dadosverif 
          });
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
  useEffect(() => {
    const fetchAndCheckFirebaseVersion = async () => {
        try {
            const db = getFirestore();
            const firebaseRef = doc(db, "Versao", "versao");

            const docSnapshot = await getDoc(firebaseRef);
            if (docSnapshot.exists()) {
                const docData = docSnapshot.data();
                const firebaseVersion = docData.firebase; 
                console.log('Versão do Firebase no Firestore:', firebaseVersion);

                const storedVersion = await AsyncStorage.getItem('firebase');

                if (storedVersion !== String(firebaseVersion)) {
                    console.log(`Mudança detectada: ${storedVersion} => ${firebaseVersion}`);

                    await AsyncStorage.clear();
                    await AsyncStorage.setItem('firebase', String(firebaseVersion));

                    Alert.alert('Aviso', 'Os dados locais foram atualizados devido à mudança de banco de dados.');
                } else {
                    console.log('Versão do banco de dados não mudou.');
                }
            } else {
                console.error('Erro: Documento "versao" não encontrado na coleção "Versao".');
            }
        } catch (error) {
            console.error('Erro ao verificar a versão do banco de dados:', error);
        }
    };

    fetchAndCheckFirebaseVersion();
    getValueFunction();
}, []);
  const saveValueFunction = async () => {
    try {
        const db = getFirestore();
        const firebaseRef = doc(db, "Versao", "versao");
        const docSnapshot = await getDoc(firebaseRef);

        if (docSnapshot.exists()) {
            const docData = docSnapshot.data();
            const firebaseVersion = docData.firebase; 
            if (email) {
                await AsyncStorage.setItem('email', email);
                setEmail(''); 
            }

            if (password) {
                await AsyncStorage.setItem('senha', password);
                setPassword(''); 
            }
            await AsyncStorage.setItem('firebase', String(firebaseVersion));
            console.log('Versão do Firebase salva:', firebaseVersion);
        } else {
            console.error('Erro: Documento "versao" não encontrado na coleção "Versao".');
        }

        await getValueFunction();
    } catch (error) {
        console.error('Erro ao salvar dados no AsyncStorage:', error);
    }
  };
  const checkVersion = async () => {
    try {
        const db = getFirestore();
        console.log("tentei chekar");
        const alunoObj = JSON.parse(alunoLocalTeste)
   
        const firebaseRef = doc(db, "Versao", "versao");
        const firebasedocSnapshot = await getDoc(firebaseRef);
        console.log("checkando:",firebasedocSnapshot);

        const academiaDocRef = doc(db, "Academias", alunoData.Academia.getAcademia());
        const academiadocSnapshot = await getDoc(academiaDocRef);
        console.log("checkando2:",academiadocSnapshot)



        if (firebasedocSnapshot.exists() && academiadocSnapshot.exists()) {
          console.log('existe esses ?')
            const docData = firebasedocSnapshot.data();
            const firebaseVersion = docData.firebase; 
            const storedFirebaseVersion = await AsyncStorage.getItem('firebase');

            const acadedocData = academiadocSnapshot.data();
            const academialogada = acadedocData.nome;
            const storedAcademiaLocal = await AsyncStorage.getItem('academia'); 
            
            console.log('Academia guardada salva:', academialogada);
            console.log('Versão do Firebase salva:', firebaseVersion);

            if (storedAcademiaLocal && storedAcademiaLocal !== academialogada) {
                console.log(`Mudança de academia detectada: ${storedAcademiaLocal} => ${academialogada}`);
                await AsyncStorage.clear();
                await AsyncStorage.setItem('academia', String(academialogada));
                Alert.alert('Aviso', 'Sua academia foi atualizada.');
                dadosverif = false;
                
            }                                
            if (firebaseVersion && firebaseVersion !== storedFirebaseVersion) {
                console.log(`Mudança de firebase detectada: ${firebaseVersion} => ${storedFirebaseVersion}`);
                await AsyncStorage.clear();
                await AsyncStorage.setItem('firebase', String(storedFirebaseVersion));
                Alert.alert('Aviso', 'Sua versao do firebase foi atualizada.');
                dadosverif = false;
                
            }                                

            //await checkVersion(storedFirebaseVersion, firebaseVersion, "firebase");
            //await checkVersion(storedAcademiaLocal, academialogada, "academia");
            await AsyncStorage.setItem('firebase', String(firebaseVersion));
            await AsyncStorage.setItem('academia', String(academialogada));
        } else {
            console.error('Erro: Documento "versao" não encontrado na coleção "Versao" ou academia nao encontrada em Academias.');
        }
    } catch (error) {
        console.error(`Erro ao verificar a versão de ${description}:`, error);
    }
};
  const getValueFunction = async () => {
    console.log("Chegou aqui ")
    const alunoLocalTeste = await AsyncStorage.getItem('alunoLocal')
    const alunoObj = JSON.parse(alunoLocalTeste)
    const academiaObj = await getAcademia(alunoObj.Academia || 'Academia IFRP')
    console.log("Chegou aqui 2")

    console.log('alunoObj', alunoObj)

    console.log("academiaobj",academiaObj)
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
        enderecoAcademia.setBairro(academiaObj.endereco.bairro || 'Lindo Vale')
        enderecoAcademia.setRua(academiaObj.endereco.rua || "Avenida  Dr. José Sebastião da Paixão")
        enderecoAcademia.setCidade(academiaObj.endereco.cidade || 'Rio Pomba')
        enderecoAcademia.setEstado(academiaObj.endereco.estado || 'MG')
        enderecoAcademia.setNumero(academiaObj.endereco.numero || 150)
        const emailAluno = dadosAluno.email
        setEmail(emailAluno || '');

        const senhaAluno = dadosAluno.senha
        setPassword(senhaAluno || '');
        console.log('emailAluno', 'AAAAAAAAAAAAAAAAsenhaAluno')
        if (emailAluno && senhaAluno) {
          console.log('emailAluno', 'senhaAlunAAAAAAAAAo')

            checkVersion();
            navigation.navigate('Principal', { 
              aluno: dadosAluno, 
              academia: academiaObj,
              dadosverif: dadosverif 
            });
            await firebase.auth().signInWithEmailAndPassword(emailAluno, senhaAluno);
          
        }
      } catch (error) {
        console.error('Erro ao obter dados do AsyncStorage ou fazer login:', error);
      }
    }
  };

  const fetchAlunoData = async () => {
    const alunoLocalTeste = await AsyncStorage.getItem('alunoLocal')
    console.log('alunoLocalTeste', alunoLocalTeste)
    const keys = await AsyncStorage.getAllKeys();
    const numberOfKeys = keys.length;

    console.log('numberOfKeys', numberOfKeys, keys)
    if (!keys.includes('ficha')) {
      const firebaseBD = getFirestore()

      try {
        const alunosQuery = query(
          collectionGroup(firebaseBD, 'Alunos'),
          where('email', '==', email)
        );
        const querySnapshot = await getDocs(alunosQuery);
        console.log("VVVVVVVVV")
        let loginValido = false;


        querySnapshot.forEach((doc) => {
          const alunoData = doc.data();
          console.log('Aluno encontrado:', alunoData);
          if(alunoData.senha == password){
            loginValido = true;
            setAlunoData(alunoData);
            alunoLogado.setNome(alunoData.nome);
            const alunoString = JSON.stringify(alunoData);
            AsyncStorage.setItem('alunoLocal', alunoString);
            console.log("alunoData.Academia", alunoData.Academia)
            academiaDoAluno = alunoData.Academia
            console.log("Chamou por aqui")
            console.log("VVVVVVVVV")
          }
          if(alunoData.senha == password){
            loginValido = true;
            setAlunoData(alunoData);
            alunoLogado.setNome(alunoData.nome);
            const alunoString = JSON.stringify(alunoData);
            AsyncStorage.setItem('alunoLocal', alunoString);
            console.log("alunoData.Academia", alunoData.Academia)
            academiaDoAluno = alunoData.Academia
            console.log("Chamou por aqui")
            console.log("VVVVVVVVV")
          }

        });
        if (!loginValido) {
          Alert.alert(
              "Erro de Login",
              "Pode ter ocorrido erro a respeito de E-mail ou senha inválidos. Caso tenha logado ignore esta mensagem."
          );
        } else {
            console.log('Login válido!');
            checkVersion();
            navigation.navigate('Principal', { 
              aluno: dadosAluno, 
              academia: academiaObj,
              dadosverif: dadosverif 
            });
        }
      } catch (error) {
        console.log('Erro ao buscar os dados do aluno:', error);
          Alert.alert(
            "Erro",
            "Pode ter ocorrido um erro ao tentar realizar o login. Caso tenha logado ignore esta mensagem."
        );
      } finally {
        console.log("AAAAAAAAAAAAAAAAAA")

        saveValueFunction()
      }

    } else {
      console.log("Chamou por aqui2")

      saveValueFunction()
    }

  }

  const getAcademia = async (nomeAcademia) => {
    let academiaObj = {}

    try {
      const db = getFirestore()
      const academiaRef = doc(db, 'Academias', nomeAcademia)
      const queryAcademia = await getDoc(academiaRef)
      academiaObj = queryAcademia.data()
    } catch {
      Alert.alert("No momento, não foi possível encontrar sua academia.", "Usando a academia IFRP de padrão")
      return {
        endereco: {
          bairro: 'Lindo Vale',
          rua: 'Avenida  Dr. José Sebastião da Paixão',
          cidade: 'Rio Pomba',
          estado: 'MG',
          numero: 150
        }

      }
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
          <View style={style.passwordContainer}>
                    <TextInput
                        placeholder="Senha"
                        secureTextEntry={true}
                        secureTextEntry={!showPassword}
                        value={password}
                        style={[style.inputText, Estilo.corLight, style.passwordInput]}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={style.showPasswordButton}>
                        <FontAwesome5
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={20}
                        color="#0066FF"
                        style={[{}]}
                        />
                    </TouchableOpacity>
          </View>

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
                    placeholder="Email"
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
export { alunoLogado, enderecoAluno }

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
    width: '80%',
    width: '80%',
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
  },passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
    paddingHorizontal: 0,
    paddingBottom: 20,
},
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }], 
    zIndex: 1,
  },passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
    paddingHorizontal: 0,
    paddingBottom: 20,
},
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }], 
    zIndex: 1,
}
})