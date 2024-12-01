import React, { Component, useState, useEffect } from "react"
import { Text, View, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert, Button } from "react-native";
import { Picker } from '@react-native-picker/picker';
import estilo from "../estilo"
import { collection, setDoc, doc, getDocs, getFirestore, where, query, addDoc, querySnapshot, QueryStartAtConstraint } from "firebase/firestore";
import { firebase, firebaseBD } from '../configuracoes/firebaseconfig/config'
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
import axios from 'axios';
import cep from 'cep-promise';


let novoAluno = new Aluno('', '', '', '', '', '', '', '', '', '')
let enderecoNovoAluno = new Endereco('', '', '', '', '', '')


export default ({ navigation }) => {
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

  const [cepEndereco, setCepEndereco] = useState('')
  const [cepInvalido, setCepInvalido] = useState(false)

  const [sexo, setSexo] = useState('')
  const [academia, setAcademia] = useState('')

  const [estado, setEstado] = useState('')
  const [estadoInvalido, setEstadoInvalido] = useState(false)

  const [cidade, setCidade] = useState('')
  const [cidadeInvalida, setCidadeInvalida] = useState(false);
  const [cidades, setCidades] = useState([]);

  const [bairro, setBairro] = useState('')
  const [bairroInvalido, setBairroInvalido] = useState(false)

  const [loading, setLoading] = useState(false);

  const [rua, setRua] = useState('')
  const [ruaInvalida, setRuaInvalida] = useState(false)

  const [numero, setNumero] = useState('')
  const [numeroInvalido, setNumeroInvalido] = useState(false)

  const [complemento, setComplemento] = useState('')
  const [complementoInvalido, setComplementoInvalido] = useState(false)

  const [email, setEmail] = useState('')
  const [emailInvalido, setEmailInvalido] = useState(false)

  const [senha, setSenha] = useState('')
  const [senhaInvalida, setSenhaInvalida] = useState(false)

  const [selectedOption, setSelectedOption] = useState('');
  const [academiaValida, setAcademiaValida] = useState(false)
  const [selectedOptionProfessor, setSelectedOptionProfessor] = useState('');
  const [professorValido, setProfessorValido] = useState(false)
  const [selectedOptionTurma, setSelectedOptionTurma] = useState('')

  const [fontsLoaded] = useFonts({
    'Montserrat': require('../../assets/Montserrat-Regular.ttf'),
  })
  const [selected, setSelected] = useState(0)

  const [conexao, setConexao] = useState(true);
  const [turmas, setTurmas] = useState([])
  const handleSelectChange = (value) => {
    setSelectedOption(value);
    setAcademiaValida(true)
    console.log('value', value)
  }
  const handleSelectChangeProfessor = (value) => {
    setSelectedOptionProfessor(value);
    setProfessorValido(true)
  }

  const handleSelectChangeTurma = (value) => {
    setSelectedOptionTurma(value);
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
  novoAluno.setTurma(selectedOptionTurma)
  novoAluno.setTelefone(telefone)
  novoAluno.setEndereco(enderecoNovoAluno)
  novoAluno.setEmail(email)
  novoAluno.setSenha(senha)
  enderecoNovoAluno.setRua(rua)
  enderecoNovoAluno.setCep(cepEndereco)
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
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
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
    for (let i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;
    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++)
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
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' },
  ];



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

  const encontrarEndereco = async () => {
    console.log('chegou aqui', cepEndereco)
    try {

      const response = await cep(cepEndereco);
      console.log('response', response)
      setCidade(response.city || '');
      setEstado(response.state || '');
      console.log('Dados recebidos:', response.data);
      setCepInvalido(false);
    } catch (error) {
      console.error('Erro na busca do CEP:', error);
      Alert.alert('Erro', 'CEP não encontrado.');
      setCepInvalido(true);
    }
  };

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
            const data = doc.data();
            if (data && data.nome) {
              professores.push(data.nome);
              console.log(data.nome);
            }
          });

          const turmasRef = collection(academiaDoc.ref, "Turmas");
          const turmas = [];

          const turmasSnapshot = await getDocs(turmasRef);

          turmasSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data && data.nome) {
              turmas.push(data.nome);
              console.log(data.nome);
            }

          })


          setProfessoresDaAcademia(professores);
          setTurmas(turmas)
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

        <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.titulos, style.Montserrat]}>Primeiramente, identifique-se</Text>
        <View style={style.inputArea}>
          <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]} numberOfLines={1}>NOME COMPLETO ( * ) :</Text>
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
          <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria, { marginBottom: 10 }]}>SEXO:</Text>
          <RadioBotao horizontal options={['Feminino', 'Masculino']}
            selected={selected}
            onChangeSelect={(opt, i) => {
              setSelected(i)
            }}
            value={selected}
          ></RadioBotao>
        </View>
        <View style={style.inputArea}>
          <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>ACADEMIA:</Text>
          <BotaoSelect selecionado={academiaValida} onChange={handleSelectChange} titulo='Academias cadastradas' max={1} options={academiasCadastradas}>
          </BotaoSelect>

        </View>
        <View style={style.inputArea}>
          <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>PROFESSOR:</Text>
          {carregouProf ?
            <BotaoSelect selecionado={professorValido} onChange={handleSelectChangeProfessor} titulo={`Professores da ${selectedOption}`} max={1} options={professoresDaAcademia}>
            </BotaoSelect> :
            <Text style={[estilo.textoP16px, style.Montserrat]}>Selecione um professor</Text>
          }
        </View>

        <View style={style.inputArea}>
          <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>Turmas:</Text>
          {carregouProf ?
            <BotaoSelect selecionado={true} onChange={handleSelectChangeTurma} titulo={`Turmas da ${selectedOption}`} max={1} options={turmas}>
            </BotaoSelect> :
            <Text style={[estilo.textoP16px, style.Montserrat]}>Selecione uma turma</Text>
          }
        </View>

        <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.titulos, style.Montserrat]}>
          Agora, informe sua residência
        </Text>

        <View style={style.inputArea}>
          <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>
            INFORME SEU CEP:
          </Text>
          <TextInput
            style={[
              style.inputText,
              estilo.sombra,
              estilo.corLight,
              cepInvalido ? { borderColor: 'red', borderWidth: 1 } : {},
            ]}
            placeholder="exemplo: 36180000"
            type="zip-code"
            onChangeText={(text) => setCepEndereco(text)}
            keyboardType="numeric"
          />
          <TouchableOpacity style={[style.botao, estilo.corPrimaria, estilo.sombra, estilo.centralizado]} onPress={() => encontrarEndereco()} >
            <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>Buscar</Text>
          </TouchableOpacity>
        </View>
        <View style={style.inputArea}>
          <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>
            ESTADO: {estado}
          </Text>
        </View>

        <View style={style.inputArea}>
          <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>
            CIDADE: {cidade}
          </Text>
        </View>

        <View style={style.inputArea}>
          <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>
            BAIRRO:
          </Text>
          <TextInput
            style={[style.inputText, estilo.sombra, estilo.corLight, numeroInvalido ? { borderWidth: 1, borderColor: 'red' } : {}]}
            placeholder="Informe seu bairro"
            onChangeText={(text) => setBairro(text)}
          />
        </View>
        <View style={style.inputArea}>
          <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>
            RUA:
          </Text>
          <TextInput
            style={[style.inputText, estilo.sombra, estilo.corLight, numeroInvalido ? { borderWidth: 1, borderColor: 'red' } : {}]}
            placeholder="Informe sua rua"
            onChangeText={(text) => setRua(text)}
          />
        </View>


        <View style={style.alinhamentoBotoesPequenos}>
          <View style={[style.inputArea, style.campoPequeno]}>
            <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>
              NÚMERO:
            </Text>
            <TextInput
              style={[style.inputText, estilo.sombra, estilo.corLight, numeroInvalido ? { borderWidth: 1, borderColor: 'red' } : {}]}
              placeholder="Número da sua residência"
              value={numero}
              keyboardType="numeric"
              onChangeText={(text) => setNumero(text)}
            />
          </View>

          <View style={[style.inputArea, style.campoPequeno]}>
            <Text style={[estilo.textoSmall12px, style.Montserrat, estilo.textoCorSecundaria]}>
              COMPLEMENTO:
            </Text>
            <TextInput
              style={[style.inputText, estilo.sombra, estilo.corLight, complementoInvalido ? { borderWidth: 1, borderColor: 'red' } : {}]}
              placeholder="complemento"
              value={complemento}
              onChangeText={(text) => setComplemento(text)}
            />
          </View>
        </View>
        <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, style.Montserrat, style.titulos]}>Por fim, seus dados de login:</Text>
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
            if (nome == '' || cpf == '' || diaNascimento == '' || mesNascimento == '' || anoNascimento == '' || telefone == '' || profissao == '' || cepp == '' || estado == '' || cidade == '' || bairro == '' || rua == '' || numero == '' || email == '' || senha == '' || !academiaValida || !professorValido) {
              Alert.alert("Campos não preenchidos", `Há campos não preenchidos ou que foram preenchidos de maneira incorreta. Preencha-os e tente novamente.`)

              if (nome == '') {
                setNomeInvalido(true)
              }
              if (cpf == '') {
                setCpfInvalido(true)
              }
              if (numero == '') {
                setNumeroInvalido(true)
              }
              if (complemento == '') {
                setComplementoInvalido(true)
              }
              if (telefone == '') {
                setTelefoneValido(false)
              }
              if (profissao == '') {
                setProfissaoInvalida(true)
              }
              if (cepEndereco == '') {
                setCepInvalido(true)
              }
              if (estado == '') {
                setEstadoInvalido(true)
              }
              if (cidade == '') {
                setCidadeInvalida(true)
              }
              if (bairro == '') {
                setBairroInvalido(true)
              }
              if (rua == '') {
                setRuaInvalida(true)
              }
              if (email == '') {
                setEmailInvalido(true)
              }
              if (senha == '') {
                setSenhaInvalida(true)
              }
              if (!academiaValida) {
                Alert.alert("Academia inválida.", "Selecione alguma academia para concluir seu cadastro.")
              }
              if (!professorValido) {
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

export { novoAluno, enderecoNovoAluno }

const style = StyleSheet.create({
  container: {
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
    width: '30%',
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
  }, picker: {
    marginBottom: 7,
    padding: 7,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 10,
  }
})