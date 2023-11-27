import React, {Component, useState, useEffect} from "react"
import { Text, View, StyleSheet,ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert} from "react-native"
import estilo from "../estilo"
import { collection,setDoc,doc, getDocs, getFirestore, where , query, addDoc, querySnapshot, QueryStartAtConstraint} from "firebase/firestore";
import {firebase, firebaseBD} from '../configuracoes/firebaseconfig/config'
import { FontAwesome } from "@expo/vector-icons"
import InputTexto from "../InputTexto"
import RadioBotao from "../RadioBotao"
import { useFonts } from 'expo-font';
import BotaoSelect from "../BotaoSelect"
import { Pessoa } from "../../classes/Pessoa"
import { Aluno } from "../../classes/Aluno"
import { Endereco } from "../../classes/Endereco"
import { TextInputMask } from 'react-native-masked-text';
import NetInfo from '@react-native-community/netinfo';

let novoAluno = new Aluno('', '', '', '', '', '', '', '', '', '')
let enderecoNovoAluno = new Endereco('', '', '', '', '', '')


export default ({navigation}) => {
    const [nome, setNome] = useState('')
    const [nomeInvalido, setNomeInvalido] = useState(false);

    const [cpf, setCpf] = useState('')
    const [cpfInvalido, setCpfInvalido] = useState(false);



    const [diaNascimento, setDiaNascimento] = useState('')
    const [mesNascimento, setMesNascimento] = useState('')
    const [anoNascimento, setAnoNascimento] = useState('')

    const [academiasCadastradas, setAcademiasCadastradas] = useState([])
    const [professoresDaAcademia, setProfessoresDaAcademia] = useState([])
    const [carregouProf, setCarregouProf] = useState(false)

    const [telefone, setTelefone] = useState('')
    const [telefoneValido, setTelefoneValido] = useState(true);


    const [profissao, setProfissao] = useState('')
    const [profissaoInvalida, setProfissaoInvalida] = useState(false)

    const [cep, setCep] = useState('')
    const [cepInvalido, setCepInvalido] = useState(false)

    const [sexo, setSexo] = useState('')
    const [academia, setAcademia] = useState('')

    const [estado, setEstado] = useState('')
    const [estadoInvalido, setEstadoInvalido] = useState(false)

    const [cidade, setCidade] = useState('')
    const [cidadeInvalida, setCidadeInvalida] = useState(false);

    const [bairro, setBairro] = useState('')
    const [bairroInvalido, setBairroInvalido] = useState(false)

    const [rua, setRua] = useState('')
    const [ruaInvalida, setRuaInvalida] = useState(false)

    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    
    const [email, setEmail] = useState('')
    const [emailInvalido, setEmailInvalido] = useState(false)

    const [senha, setSenha] = useState('')
    const [senhaInvalida, setSenhaInvalida] = useState(false)

    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOptionProfessor, setSelectedOptionProfessor] = useState('');


    const [fontsLoaded] = useFonts({
        'Montserrat': require('../../assets/Montserrat-Regular.ttf'),
    })
    const [selected, setSelected] = useState(0)

    const [conexao, setConexao] = useState(true);

    const handleSelectChange = (value) => {
      console.log(value)
        setSelectedOption(value);
      }
    const handleSelectChangeProfessor = (value) => {
      console.log(value)
        setSelectedOptionProfessor(value);
      }
      
    novoAluno.setNome(nome)
    novoAluno.setCpf(cpf)
    novoAluno.setSexo(sexo)
    novoAluno.setAcademia(selectedOption)
    novoAluno.setProfessor(selectedOptionProfessor)
    novoAluno.setProfissao(profissao)
    novoAluno.setDiaNascimento(parseInt(diaNascimento))
    novoAluno.setMesNascimento(parseInt(mesNascimento))
    novoAluno.setAnoNascimento(parseInt(anoNascimento))
    novoAluno.setTelefone(telefone)
    novoAluno.setEndereco(enderecoNovoAluno)
    novoAluno.setEmail(email)
    novoAluno.setSenha(senha)
    enderecoNovoAluno.setRua(rua)
    enderecoNovoAluno.setCep(cep)
    enderecoNovoAluno.setBairro(bairro)
    enderecoNovoAluno.setCidade(cidade)
    enderecoNovoAluno.setEstado(estado)
    enderecoNovoAluno.setNumero(numero)
    enderecoNovoAluno.setComplemento(complemento)
    selected == 0 ? novoAluno.setSexo('Feminino') : novoAluno.setSexo('Masculino')
    

    //Aplicação da correção dos dados 
    //Validação do nome
    const validaNome = (text) => {
      const nomeValido = /^[\p{L}\s]*$/u;
      if (nomeValido.test(text)) {
        setNomeInvalido(false);
      } else {
        setNomeInvalido(true);
      }
      setNome(text);
    };
    
    //Validação do CPF
    const validarCpf = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g,'');
        if(cpf == '') return false;
        // Elimina CPFs invalidos conhecidos
        if (cpf.length != 11 ||
          cpf == "00000000000" ||
          cpf == "11111111111" ||
          cpf == "22222222222" ||
          cpf == "33333333333" ||
          cpf == "44444444444" ||
          cpf == "55555555555" ||
          cpf == "66666666666" ||
          cpf == "77777777777" ||
          cpf == "88888888888" ||
          cpf == "99999999999")
            return false;
        // Valida 1o digito
        let add = 0;
        for (let i=0; i < 9; i ++)
          add += parseInt(cpf.charAt(i)) * (10 - i);
          let rev = 11 - (add % 11);
          if (rev == 10 || rev == 11)
            rev = 0;
          if (rev != parseInt(cpf.charAt(9)))
            return false;
        // Valida 2o digito
        add = 0;
        for (let i = 0; i < 10; i ++)
          add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
          rev = 0;
        if (rev != parseInt(cpf.charAt(10)))
          return false;
        return true;
    }


    const validaECorrigeCPF = (text) => {
        setCpf(text);
        setCpfInvalido(!validarCpf(text));
      };


    //Validação do dia
    const limitarDiaNascimento = (dia) => {
        const diaMaximo = 31;
        const diaDigitado = parseInt(dia);
        if (!diaDigitado) { // verifica se a entrada é vazia ou não numérica
          return '';
        }
        if (diaDigitado > diaMaximo) {
          return diaMaximo.toString();
        }
        return diaDigitado.toString();
      }
    //Validação do mes
    const limitarMesNascimento = (mes) => {
        const mesMaximo = 12;
        const mesDigitado = parseInt(mes);
        if (!mesDigitado) { // verifica se a entrada é vazia ou não numérica
          return '';
        }
        if (mesDigitado > mesMaximo) {
          return mesMaximo.toString();
        }
        return mesDigitado.toString();
      }

    //Validação do ano
    const limitarAnoNascimento = (ano) => {
        const data = new Date();
        const anoMaximo = data.getFullYear();
        const anoDigitado = parseInt(ano);
        if (anoDigitado > anoMaximo) {
          return anoMaximo.toString();
        }
        return ano;
      }

      //Validação da profissão 
      const validaProfissao = (text) => {
        const profissaoValida = /^[a-zA-Z\s]*$/;
        if (profissaoValida.test(text)) {
          setProfissaoInvalida(false);
        } else {
          setProfissaoInvalida(true);
        }
        setProfissao(text);
      };
    //Validação do estado
    const estadosBrasileiros = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
        'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ];

  const validaEstado = (text) => {
    const estadoUpper = text.toUpperCase();
    if (estadosBrasileiros.includes(estadoUpper)) {
      setEstadoInvalido(false);
    } else {
      setEstadoInvalido(true);
    }
    setEstado(estadoUpper);
  };
  //Validação do CEP
  const validaCep = (text) => {
    const cepRegex = /^\d{5}-\d{3}$/;
    if (cepRegex.test(text)) {
      setCepInvalido(false);
    } else {
      setCepInvalido(true);
    }
    setCep(text);
  };

  //Validação do numero de telefone
  const validaTelefone = (text) => {
    const telefoneNumeros = text.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    setTelefoneValido(telefoneNumeros.length >= 10);
    setTelefone(text);
  };

  //Validação da cidade
  const validaCidade = (text) => {
    // Apenas um exemplo simples de validação: a cidade deve ter pelo menos 2 caracteres
    const cidadeValida = text.length >= 3;
  
    // Atualize o estado da cidade e o estado de validação
    setCidade(text);
    setCidadeInvalida(!cidadeValida);
  };

  //Validação do bairro
  const validaBairro = (text) => {
    const bairroValido = text.length >= 5;

    setBairro(text)
    setBairroInvalido(!bairroValido)
  }

  //Validação da rua
  const validaRua = (text) => {
    const ruaValida = text.length >= 5;

    setRua(text)
    setRuaInvalida(!ruaValida)
  }

  //Validação do numero

  //Validação do complemento

   //Validação do Email
   const validaEmail = (text) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(text)) {
      setEmailInvalido(false);
    } else {
      setEmailInvalido(true);
    }
    setEmail(text);
  };

  //Validação da senha
  const validaSenha = (text) => {
    if (text.length >= 6) {
      setSenhaInvalida(false);
    } else {
      setSenhaInvalida(true);
    }
    setSenha(text);
  };

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

  const handleNavegacao = () => {
    if (!conexao) {
      navigation.navigate('Modal sem conexão');
    } else {
      navigation.navigate('Primeiro Login')
    }
  }

  useEffect(() => {
    const carregarAcademias = async () => {
      try {
        const db = getFirestore();
        const academiasRef = collection(db, "Academias");
        const querySnapshot = await getDocs(academiasRef);
    
        const academias = [];
        querySnapshot.forEach((doc) => {
          const nome = doc.data().nome;
          academias.push(nome);
        });
    
        setAcademiasCadastradas(academias);
      } catch (error) {
        console.log(error);
      }
    };
  
    const carregarProfessores = async () => {
      await carregarAcademias()
      try {
        const db = getFirestore();
        const academiasRef = collection(db, "Academias");
        const academiaQuery = query(academiasRef, where("nome", "==", selectedOption));
        const academiaSnapshot = await getDocs(academiaQuery);
    
        if (!academiaSnapshot.empty) {
          const academiaDoc = academiaSnapshot.docs[0];
          const professoresRef = collection(academiaDoc.ref, "Professores");
          const querySnapshot = await getDocs(professoresRef);
    
          const professores = [];
          querySnapshot.forEach((doc) => {
            const nome = doc.data().nome;
            professores.push(nome);
            console.log(nome);
          });
          setProfessoresDaAcademia(professores);
          setCarregouProf(true)
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    carregarAcademias();
    carregarProfessores();
  }, [selectedOption])
    return (
                <ScrollView alwaysBounceVertical={true} style={estilo.corLightMenos1}>
                    <SafeAreaView style={style.container}>      

                    <Text style={[estilo.textoP16px, estilo.textoCorSecundaria,  style.titulos, style.Montserrat]}>Primeiramente, identifique-se</Text>
                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]} numberOfLines={1}>NOME COMPLETO:</Text>
                        <View>
                        <TextInput 
                        placeholder={'Informe seu nome completo'} 
                        placeholderTextColor={'#CFCDCD'} 
                        style={[
                            estilo.sombra, 
                            estilo.corLight, 
                            style.inputText,
                            nomeInvalido ? { borderColor: '#FF6262', borderWidth: 1 } : {}
                        ]}
                        keyboardType={'default'}
                        value={nome}
                        onChangeText={(text) => validaNome(text)}
                        >
                        </TextInput>
                        </View>                        
                    </View>
    
                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>CPF:</Text>
                        <TextInputMask 
                                type={'cpf'}
                                placeholder={'Informe seu cpf'} 
                                placeholderTextColor={'#CFCDCD'} 
                                style={[
                                estilo.sombra, 
                                estilo.corLight, 
                                style.inputText,
                                cpfInvalido ? { borderColor: '#FF6262', borderWidth: 1 } : {}
                                ]}
                                value={cpf}
                                onChangeText={(text) => validaECorrigeCPF(text)}   
                            >
                            </TextInputMask>

                            </View>
    
                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>DATA DE NASCIMENTO:</Text>
                            <View style={[style.areaInputDataNascimento]}>
                                <TextInput 
                                style={[style.botaoInputDataNascimento, estilo.sombra]} placeholder="dia"
                                value={diaNascimento}
                                onChangeText={(text) => setDiaNascimento(limitarDiaNascimento(text))}
                                maxLength={2}
                                keyboardType='numeric'
                                ></TextInput>

                                <TextInput 
                                style={style.botaoInputDataNascimento} placeholder="mês"
                                value={mesNascimento}
                                onChangeText={(text) => setMesNascimento(limitarMesNascimento(text))}
                                maxLength={2}
                                keyboardType='numeric'
                                ></TextInput>
                                <TextInput 
                                style={style.botaoInputDataNascimento} 
                                placeholder="ano"
                                value={anoNascimento}
                                onChangeText={(text) => setAnoNascimento(limitarAnoNascimento(text))}
                                maxLength={4}
                                keyboardType='numeric'
                                />
                            </View>
                    </View>

                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>NÚMERO DE TELEFONE:</Text>
                        <TextInputMask
                        style={[
                          style.inputText,
                          estilo.sombra,
                          estilo.corLight,
                          !telefoneValido ? { borderColor: '#F51B01', borderWidth: 1 } : {},
                        ]}
                        placeholder="(00)000000000"
                        value={telefone}
                        onChangeText={(text) => validaTelefone(text)}
                        type={'cel-phone'}
                        options={{
                          maskType: 'BRL',
                          withDDD: true,
                          dddMask: '(99) ',
                        }}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>OCUPAÇÃO:</Text>
                        <TextInput 
                        style={[
                        style.inputText, 
                        estilo.sombra, 
                        estilo.corLight,
                        profissaoInvalida ? { borderColor: '#FF6262', borderWidth: 1 } : {}
                        ]}
                        placeholder="ex: Professor"
                        value={profissao}
                        onChangeText={(text) => validaProfissao(text)}
                    ></TextInput>
                    </View>

                    <View style={style.inputArea}>
                    <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria,{marginBottom:10}]}>SEXO:</Text>
                    <RadioBotao horizontal options={['Feminino',  'Masculino']}  
                    selected={selected}
                    onChangeSelect={(opt, i) => {
                    setSelected(i)}}
                    value={selected}
                    ></RadioBotao>
                    </View>
                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>ACADEMIA:</Text>
                        <BotaoSelect     selecionado={selectedOption == '' ? false : true}  onChange={handleSelectChange} titulo='Academias cadastradas' max={1} options={academiasCadastradas}>
                        </BotaoSelect>

                    </View>
                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>PROFESSOR:</Text>
                        {carregouProf?                         
                        <BotaoSelect     selecionado={selectedOptionProfessor == '' ? false : true}  onChange={handleSelectChangeProfessor} titulo={`Professores da ${selectedOption}`} max={1} options={professoresDaAcademia}>
                        <Text>
                          {console.log(selectedOptionProfessor)}
                        </Text>
                        </BotaoSelect> :
                        <Text style={[estilo.textoP16px, style.Montserrat]}>Selecione um professor</Text>
                        }
                    </View>

                    <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.titulos, style.Montserrat]}>Agora, informe sua residência</Text>

                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>INFORME SEU CEP:</Text>
                        <TextInputMask 
                            style={[
                            style.inputText, 
                            estilo.sombra, 
                            estilo.corLight,
                            cepInvalido ? { borderColor: 'red', borderWidth: 1 } : {}
                            ]}
                            placeholder="ex: 36180-000"
                            value={cep}
                            type={'zip-code'}
                            onChangeText={(text) => validaCep(text)}
                            keyboardType='numeric'
                        ></TextInputMask>
                    </View>


                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>ESTADO:</Text>
                        <TextInput 
                            style={[
                                style.inputText, 
                                estilo.sombra, 
                                estilo.corLight,
                                estadoInvalido ? { borderColor: '#FF6262', borderWidth: 1 } : {}
                            ]}
                            placeholder="ex: MG"
                            value={estado}
                            onChangeText={(text) => validaEstado(text)}
                            maxLength={2}
                            ></TextInput>
                        </View>


                    <View style={style.inputArea}>
                    <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]} numberOfLines={1}>CIDADE:</Text>
                      <TextInput
                        style={[
                          style.inputText,
                          estilo.sombra,
                          estilo.corLight,
                          cidadeInvalida ? { borderColor: 'red', borderWidth: 1 } : {}
                        ]}
                        placeholder="Informe sua cidade"
                        value={cidade}
                        onChangeText={(text) => validaCidade(text)}
                      />
                    </View>


                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]} numberOfLines={1}>BAIRRO:</Text>
                        <TextInput
                        style={[
                          style.inputText,
                          estilo.sombra,
                          estilo.corLight,
                          bairroInvalido ? { borderColor: 'red', borderWidth: 1 } : {}
                        ]}
                        placeholder="Informe seu bairro"
                        value={bairro}
                        onChangeText={(text) => validaBairro(text)}
                      />
                    </View>


                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]} numberOfLines={1}>RUA:</Text>
                        <TextInput
                        style={[
                          style.inputText,
                          estilo.sombra,
                          estilo.corLight,
                          ruaInvalida ? { borderColor: 'red', borderWidth: 1 } : {}
                        ]}
                        placeholder="Informe sua rua"
                        value={rua}
                        onChangeText={(text) => validaRua(text)}
                      />
                    </View>

                    <View style={style.alinhamentoBotoesPequenos}>
                        <View style={[style.inputArea, style.campoPequeno]}>
                            <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]} numberOfLines={1}>NÚMERO:</Text>
                            <TextInput 
                                style={[style.inputText, estilo.sombra, estilo.corLight]} placeholder="Número da sua residência"
                                value={numero}
                                keyboardType='numeric'
                                onChangeText={(text) => setNumero(text)}
                                
                                ></TextInput>
                        </View>
                        <View style={[style.inputArea, style.campoPequeno]}>
                            <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]} numberOfLines={1}>COMPLEMENTO:</Text>
                            <TextInput 
                                style={[style.inputText, estilo.sombra, estilo.corLight]} placeholder="complemento"
                                value={complemento}
                                onChangeText={(text) => setComplemento(text)}
                                ></TextInput>
                        </View> 
                    </View>
                    <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat , style.titulos]}>Por fim, seus dados de login:</Text>
                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]} numberOfLines={1}>EMAIL:</Text>
                        <TextInput 
                        style={[
                            style.inputText, 
                            estilo.sombra, 
                            estilo.corLight,
                            emailInvalido ? { borderColor: 'red', borderWidth: 1 } : {}
                        ]}
                        placeholder="Informe seu e-mail"
                        value={email}
                        onChangeText={(text) => validaEmail(text)}
                        ></TextInput>
                    </View>

                    <View style={style.inputArea}>
                        <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]} numberOfLines={1}>SENHA:</Text>
                        <TextInput 
                        secureTextEntry={true}
                        style={[
                            style.inputText, 
                            estilo.sombra, 
                            estilo.corLight,
                            senhaInvalida ? { borderColor: 'red', borderWidth: 1 } : {}
                        ]}
                        placeholder="Informe sua senha"
                        value={senha}
                        onChangeText={(text) => validaSenha(text)}
                        ></TextInput>
                    </View>
                    <TouchableOpacity onPress={() => {
                        {
                            if ( nome == '' || cpf == '' || diaNascimento == '' || mesNascimento == '' || anoNascimento == '' || telefone == '' || profissao == '' ||  cep == '' || estado == '' || cidade == '' || bairro == '' || rua == '' || numero == '' || email == '' || senha == ''){
                              Alert.alert("Campos não preenchidos",`Há campos não preenchidos ou que foram preenchidos de maneira incorreta. Preencha-os e tente novamente.`)

                                if (nome == ''){
                                  setNomeInvalido(true)
                                }
                                if (cpf == ''){
                                  setCpfInvalido(true)
                                }              
                                if (telefone == ''){
                                  setTelefoneValido(false)
                                }
                                if (profissao == ''){
                                  setProfissaoInvalida(true)
                                }
                                if (cep == ''){
                                  setCepInvalido(true)
                                }
                                if (estado == ''){
                                  setEstadoInvalido(true)
                                }
                                if (cidade == ''){
                                  setCidadeInvalida(true)
                                }
                                if (bairro == ''){
                                  setBairroInvalido(true)
                                }
                                if (rua == ''){
                                  setRuaInvalida(true)
                                }
                                if (email == ''){
                                  setEmailInvalido(true)
                                }
                                if (senha == ''){
                                  setSenhaInvalida(true)
                                }
                                if(selectedOption == ''){
                                  Alert.alert("Academia inválida.", "Selecione alguma academia para concluir seu cadastro.")
                                }
                                if(selectedOptionProfessor == ''){
                                  Alert.alert("Professor inválido.", "Selecione algum professor para concluir seu cadastro.")
                                }
                              } else {
                                  handleNavegacao()
                                }
                        }
                    }} 
                    style={[estilo.corPrimaria, style.botao, estilo.sombra, estilo.botao]}>
                        <Text 
                    style={[estilo.tituloH523px, estilo.textoCorLight]}>CADASTRAR-SE</Text>
                    </TouchableOpacity>
                    </SafeAreaView>

                </ScrollView>
        )
}

export {novoAluno, enderecoNovoAluno}

const style = StyleSheet.create({
    container:{
        marginVertical: '2%',
    },
    Montserrat: {
        fontFamily: 'Montserrat'
    },
    inputArea: {
        marginLeft: '10%',
        marginVertical: 10
    },
    titulos: {
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 5,
    },
    inputText: {
        width: '90%',
        height: 50,
        marginTop: 10,
        marginBottom: 30,
        borderRadius: 10,
        elevation: 10,
        paddingHorizontal: 20,
    },
    areaInputDataNascimento: {
        width: '90%',
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },

    botaoInputDataNascimento: {
        width:'30%',
        padding: 10,
        backgroundColor: 'white',
        elevation: 10,
        borderRadius: 10,

    },

    campoPequeno: {
        width: '40%'
    },
    alinhamentoBotoesPequenos: {
        flexDirection: 'row',
        width: '100%'
    }
})