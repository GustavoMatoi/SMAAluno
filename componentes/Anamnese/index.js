import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import RadioBotao from "../RadioBotao";
import estilo from "../estilo";
import { useFonts } from 'expo-font';
import { CheckMultiplos } from "../Checkbox";
import BotaoSelect from "../BotaoSelect";
import { Anamnese } from "../../classes/Anamnese";
import { novoAluno, enderecoNovoAluno } from "../NavegacaoLoginScreen/CadastroScreen";
import { parqDoAluno } from "../Parq";
import { doc, setDoc } from "firebase/firestore";
import { firebase, firebaseBD } from "../configuracoes/firebaseconfig/config";
import NetInfo from '@react-native-community/netinfo';

const anamneseDoAluno = new Anamnese('', '', '', '', '', '', '', '', '', '', '', '', '', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, '');

export default ({ navigation }) => {
  const [selectedSangue, setSelectedSangue] = useState(0);
  const [selected, setSelected] = useState(0);
  const [selected1, setSelected1] = useState(0);
  const [selected2, setSelected2] = useState(0);

  const [tempoQuePraticaMusculacao, setTempoQuePraticaMusculacao] = useState('');
  const [tempoQueParouDePraticarMusculacao, setTempoQueParouDePraticarMusculacao] = useState('');
  const [usoDeMedicamento, setUsoDeMedicamento] = useState('');
  const [alergia, setAlergia] = useState('');
  const [cancer, setCancer] = useState('');
  const [lesao, setLesao] = useState('');
  const [comentarios, setComentarios] = useState('');

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [mostrarOutro, setMostrarOutro] = useState(false);
  const [outraDoenca, setOutraDoenca] = useState('');

  const [conexao, setConexao] = useState(true);
  const [fontsLoaded] = useFonts({ 'Montserrat': require('../../assets/Montserrat-Light.ttf'), });

  // Opcões de checkbox
  const opcaoAtaqueCardiaco = [{ text: 'Um ataque cardíaco?', id: 1 }];
  const opcaoDoencaDasValvulasCardiacas = [{ text: 'Doença das válvulas cardíacas', id: 1 }];
  const opcaoCirurgiaCardiaca = [{ text: 'Cirurgia cardíaca', id: 1 }];
  const opcaoCateterismoCardiaco = [{ text: 'Cateterismo cardíaco', id: 1 }];
  const opcaoAngioplastiaCoronaria = [{ text: 'Angioplastia coronária', id: 1 }];
  const opcaoMarcaPasso = [{ text: 'Marca-passo', id: 1 }];
  const desfibriladorCardiacoImplantavel = [{ text: 'Desfibrilador cardíaco implantável', id: 1 }];
  const disturbioDoRitmoCardiaco = [{ text: 'Distúrbio do ritmo cardíaco', id: 1 }];
  const insuficienciaCardiaca = [{ text: 'Insuficiência cardíaca', id: 1 }];
  const opcaoCardiopatiaCongenita = [{ text: 'Cardiopatia congênita', id: 1 }];
  const opcaoTransplanteDeCoracao = [{ text: 'Transplante de coração', id: 1 }];
  const opcaoDoencaRenal = [{ text: 'Doença renal', id: 1 }];
  const opcaoDiabetes = [{ text: 'Diabetes', id: 1 }];
  const opcaoAsma = [{ text: 'Asma', id: 1 }];
  const opcaoDoencaPulmonar = [{ text: 'Doença pulmonar', id: 1 }];
  const outro = [{ text: 'Outro: ', id: 1 }];

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    anamneseDoAluno.setTipoSanguineo(value);
  };
  const handleSelectChange2 = (value) => setSelectedOption2(value);

  const criarUsuario = () => {
    const auth = firebase.auth();
    const user = auth.currentUser;
    if (!user) return Promise.reject(new Error('Usuário não autenticado'));

    if (novoAluno.getSexo() === 'Masculino') {
      anamneseDoAluno.setGravida(false);
    }
    const data = new Date();
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();

    const alunoRef = doc(firebaseBD, "Academias", novoAluno.getAcademia(), "Alunos", user.email);
    const notifRef = doc(firebaseBD, "Academias", novoAluno.getAcademia(), "Alunos", user.email, "Notificações", `Notificação${dia}|${mes}|${ano}`);

    const dadosAluno = {
      nome: novoAluno.getNome(),
      cpf: novoAluno.getCpf(),
      diaNascimento: novoAluno.getDiaNascimento(),
      mesNascimento: novoAluno.getMesNascimento(),
      anoNascimento: novoAluno.getAnoNascimento(),
      telefone: novoAluno.getTelefone(),
      profissao: novoAluno.getProfissao(),
      email: novoAluno.getEmail(),
      senha: novoAluno.getSenha(),
      sexo: novoAluno.getSexo(),
      Academia: novoAluno.getAcademia(),
      professorResponsavel: novoAluno.getProfessor(),
      tipo: 'aluno',
      turma: novoAluno.getTurma(),
      endereco: {
        cep: enderecoNovoAluno.getCep(),
        rua: enderecoNovoAluno.getRua(),
        bairro: enderecoNovoAluno.getBairro(),
        cidade: enderecoNovoAluno.getCidade(),
        estado: enderecoNovoAluno.getEstado(),
        numero: enderecoNovoAluno.getNumero(),
        complemento: enderecoNovoAluno.getComplemento(),
      },
      PARQ: {
        pergunta1: parqDoAluno.getRespostaDoencaCardiaca(),
        pergunta2: parqDoAluno.getRespostaDorNoPeito(),
        pergunta3: parqDoAluno.getRespostaDorNoPeitoUltimoMes(),
        pergunta4: parqDoAluno.getRespostaPercaEquilibrio(),
        pergunta5: parqDoAluno.getRespostaProblemaOsseo(),
        pergunta6: parqDoAluno.getRespostaMedicamentoPressaoArterial(),
        pergunta7: parqDoAluno.getRespostaUltimaPergunta(),
      },
      Anamnese: {
        tipoSanguineo: anamneseDoAluno.getTipoSanguineo(),
        fatorRH: anamneseDoAluno.getFatorRH(),
        gravida: anamneseDoAluno.getGravida(),
        praticaMusculacaoAtualmente: anamneseDoAluno.getPraticaMusculacao(),
        tempoQuePraticaMusculacao: anamneseDoAluno.getTempoQuePraticaMusculacao(),
        jaPraticouMusculacao: anamneseDoAluno.getJaPraticouMusculacao(),
        tempoQueParouDePraticarMusculacao: anamneseDoAluno.getTempoQueParouDePraticarMusculacao(),
        usoDeMedicamento: anamneseDoAluno.getUsaMedicamento(),
        possuiAlergiaMedicamento: anamneseDoAluno.getPossuiAlergiaMedicamento(),
        historicoDeCancer: anamneseDoAluno.getTipoCancer(),
        lesao: anamneseDoAluno.getLesao(),
        comentariosMedicos: anamneseDoAluno.getComentarios(),
        ataqueCardiaco: anamneseDoAluno.getAtaqueCardiaco(),
        doencaDasValvulasCardiacas: anamneseDoAluno.getDoencaDasValvulasCardiacas(),
        cirurgiaCardiaca: anamneseDoAluno.getCirurgiaCardiaca(),
        cateterismoCardiaco: anamneseDoAluno.getCateterismoCardiaco(),
        angioplastiaCoronaria: anamneseDoAluno.getAngioplastiaCoronaria(),
        marcaPasso: anamneseDoAluno.getMarcaPassos(),
        desfibriladorCardiacoImplantavel: anamneseDoAluno.getDesfibriladorCardiaco(),
        disturbioDoRitmoCardiaco: anamneseDoAluno.getDisturbioDoRitmoCardiaco(),
        insuficienciaCardiaca: anamneseDoAluno.getInsuficienciaCardiaca(),
        cardioPatiaCongenita: anamneseDoAluno.getCardiopatiaCongenita(),
        transplanteDeCoracao: anamneseDoAluno.getTransplanteDeCoracao(),
        doencaRenal: anamneseDoAluno.getDoencaRenal(),
        diabetes: anamneseDoAluno.getDiabetes(),
        asma: anamneseDoAluno.getAsma(),
        doencaPulmonar: anamneseDoAluno.getDoencaPulmonar(),
        objetivo: anamneseDoAluno.getObjetivo(),
        outro: outraDoenca,
      },
    };

    const notificacao = {
      data: `${dia}/${mes}/${ano}`,
      nova: false,
      remetente: 'ShapeMeApp',
      texto: 'É um prazer recebê-lo em nosso aplicativo...',
      tipo: 'sistema',
      titulo: 'Bem-vindo ao ShapeMeApp!',
    };

    return Promise.all([
      setDoc(alunoRef, dadosAluno),
      setDoc(notifRef, notificacao),
    ]);
  };

  const handleResponderAnamnese = () => {
    if (!anamneseDoAluno.getTipoSanguineo() || !anamneseDoAluno.getFatorRH() || !anamneseDoAluno.getObjetivo()) {
      Alert.alert('Campos não preenchidos', 'Há campos não preenchidos ou com formato incorreto. Preencha-os e tente novamente.');
      return;
    }
    criarUsuario()
      .then(() => navigation.navigate('Concluir cadastro'))
      .catch(err => { console.error(err); Alert.alert('Erro', 'Não foi possível salvar seus dados.'); });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => setConexao(state.type === 'wifi' || state.type === 'cellular'));
    return () => unsubscribe();
  }, []);

  const data = new Date();
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  const hora = data.getHours();
  const minuto = data.getMinutes();

  anamneseDoAluno.setData(`${dia}/${mes}/${ano}`);
  anamneseDoAluno.setTipoSanguineo(selectedOption);
  anamneseDoAluno.setTempoQuePraticaMusculacao(tempoQuePraticaMusculacao);
  anamneseDoAluno.setJaPraticouMusculacao(selected2);
  anamneseDoAluno.setTempoQueParouDePraticarMusculacao(tempoQueParouDePraticarMusculacao);
  anamneseDoAluno.setUsaMedicamento(usoDeMedicamento);
  anamneseDoAluno.setPossuiAlergiaMedicamento(alergia);
  anamneseDoAluno.setTipoCancer(cancer);
  anamneseDoAluno.setLesao(lesao);
  anamneseDoAluno.setComentarios(comentarios);
  anamneseDoAluno.setObjetivo(selectedOption2);
  selectedSangue === 0 ? anamneseDoAluno.setFatorRH(' + ') : anamneseDoAluno.setFatorRH(' - ');
  selected === 0 ? anamneseDoAluno.setGravida('Sim') : anamneseDoAluno.setGravida('Não');
  selected1 === 0 ? anamneseDoAluno.setPraticaMusculacao('Sim') : anamneseDoAluno.setPraticaMusculacao('Não');
  selected2 === 0 ? anamneseDoAluno.setJaPraticouMusculacao('Sim') : anamneseDoAluno.setJaPraticouMusculacao('Não');

  return (
    <ScrollView style={[estilo.corLightMenos1]}>
      <SafeAreaView style={style.container}>
        <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat, estilo.centralizado]}>Data e hora de preenchimento</Text>
        <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat, estilo.centralizado, { marginBottom: 10 }]}>{dia}/{mes}/{ano} - {hora}:{minuto}</Text>

        <Text style={[estilo.textoCorSecundaria, estilo.tituloH523px]}>Preencha os campos abaixo:</Text>
        <SafeAreaView style={[style.containerTipoSanguineo]}>
          <View style={[style.campoInput]}>
            <Text style={selectedOption == '' ? [estilo.textoP16px, estilo.textoCorDanger, { marginBottom: 10 }, style.Montserrat] : [estilo.textoP16px, estilo.textoCorSecundaria, { marginBottom: 10 }, style.Montserrat]}>Tipo sanguineo</Text>
            <BotaoSelect selecionado={selectedOption == '' ? false : true} onChange={handleSelectChange} titulo='Tipo Sanguíneo' max={1} options={['A', 'AB', 'B', 'O']} ></BotaoSelect>
          </View>
          <View style={[style.campoRadio]}>
            <Text style={[estilo.textoP16px, { marginBottom: 10 }, style.Montserrat]}>Fator RH</Text>
            <RadioBotao horizontal options={['Positivo(+)', 'Negativo(-)']}
              selected={selectedSangue}
              value={selectedSangue}
              onChangeSelect={(opt, i) => {
                setSelectedSangue(i)
              }}></RadioBotao>
          </View>
        </SafeAreaView>

        <View style={[style.areaRadios, estilo.centralizado]}>
          {novoAluno.getSexo() === 'Masculino' ? 
            null : (
            <>
              <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>
                Está grávida?
              </Text>
              <View style={[style.radiosEspacamento]}>
                <RadioBotao
                  horizontal
                  options={['Sim', 'Não']}
                  selected={selected}
                  onChangeSelect={(opt, i) => {
                    setSelected(i);
                  }}
                />
              </View>
            </>
          )}
          {novoAluno.getSexo() === 'Masculino' ? 
            null : (
            <>
              <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>
                Está grávida?
              </Text>
              <View style={[style.radiosEspacamento]}>
                <RadioBotao
                  horizontal
                  options={['Sim', 'Não']}
                  selected={selected}
                  onChangeSelect={(opt, i) => {
                    setSelected(i);
                  }}
                />
              </View>
            </>
          )}

          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Pratica musculação atualmente?</Text>
          <View style={[style.radiosEspacamento]}>
            <RadioBotao horizontal options={['Sim', 'Não']}
              selected={selected1}
              onChangeSelect={(opt, i) => {
                setSelected1(i)
              }}></RadioBotao>
          </View>
          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Se sim, há quanto tempo (em meses)?</Text>
          <TextInput
            editable={selected1 == 0 ? true : false}
            placeholder={selected1 == 0 ? "Informe o tempo, em meses" : "Desabilitado"}
            value={tempoQuePraticaMusculacao}
            style={selected1 == 0 ? [
              style.inputText,
              estilo.corLight,
              style.Montserrat] :
              [style.inputText,
              estilo.corDisabled,
              style.Montserrat]}
            onChangeText={(text) => setTempoQuePraticaMusculacao(text)}
            keyboardType="numeric"
          />

          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Se não, já praticou?</Text>
          <View style={[style.radiosEspacamento]}>
            <RadioBotao horizontal options={['Sim', 'Não']}
              selected={selected2}
              onChangeSelect={(opt, i) => {
                setSelected2(i)
              }}></RadioBotao>
          </View>

          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Há quanto tempo parou (em meses)?
          </Text>
          <TextInput
            placeholder={selected2 == 0 ? "Informe o tempo, em meses" : "Desabilitado"}
            value={tempoQueParouDePraticarMusculacao}
            style={selected2 == 0 ? [
              style.inputText,
              estilo.corLight,
              style.Montserrat] :
              [style.inputText,
              estilo.corDisabled,
              style.Montserrat]}
            onChangeText={(text) => setTempoQueParouDePraticarMusculacao(text)}
            keyboardType="numeric"
          />

          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Faz uso de algum medicamento regularmente? Qual? </Text>
          <TextInput
            placeholder="Informe o medicamento"
            style={[
              style.inputText,
              estilo.corLight,
              style.Montserrat,
            ]}
            value={usoDeMedicamento}
            onChangeText={(text) => setUsoDeMedicamento(text)}
          />

          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Possui alergia a algum tipo de medicamento? Qual?</Text>
          <TextInput
            placeholder="Informe a alergia"
            style={[
              style.inputText,
              estilo.corLight,
              style.Montserrat,
            ]}
            value={alergia}
            onChangeText={(text) => setAlergia(text)}
          />


          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Histórico de câncer: em caso afirmativo, qual tipo?</Text>
          <TextInput
            placeholder="Informe o tipo de câncer"
            style={[
              style.inputText,
              estilo.corLight,
              style.Montserrat,
            ]}
            value={cancer}
            onChangeText={(text) => setCancer(text)}
          />

          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Alguma lesão muscular, óssea ou articular?</Text>
          <TextInput
            placeholder="Informe o tipo de lesão"
            style={[
              style.inputText,
              estilo.corLight,
              style.Montserrat,
            ]}
            value={lesao}
            onChangeText={(text) => setLesao(text)}
          />

          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Liste quaisquer comentários adicionais sobre seu histórico médico:</Text>
          <TextInput
            placeholder="Comentários adicionais"
            style={[
              style.inputText,
              estilo.corLight,
              style.Montserrat,
            ]}
            value={comentarios}
            onChangeText={(text) => setComentarios(text)}
          />
          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Selecione, caso você teve ou tem atualmente: </Text>
          <View style={[style.selectedObjetivo]}>

            <CheckMultiplos options={opcaoAtaqueCardiaco} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setAtaqueCardiaco('Sim') } else { anamneseDoAluno.setAtaqueCardiaco('Não') } }} multiplo={false} />
            <CheckMultiplos options={opcaoDoencaDasValvulasCardiacas} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setDoencaDasValvulasCardiacas('Sim') } else { anamneseDoAluno.setDoencaDasValvulasCardiacas('Não') }; console.log(isChecked[0]) }} multiplo={false} />
            <CheckMultiplos options={opcaoCirurgiaCardiaca} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setCirurgiaCardiaca('Sim') } else { anamneseDoAluno.setCirurgiaCardiaca('Não') } }} multiplo={false} />
            <CheckMultiplos options={opcaoCateterismoCardiaco} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setCateterismoCardiaco('Sim') } else { anamneseDoAluno.setCateterismoCardiaco('Não') } }} multiplo={false} />
            <CheckMultiplos options={opcaoAngioplastiaCoronaria} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setAngioplastiaCoronaria('Sim') } else { anamneseDoAluno.setAngioplastiaCoronaria('Não') } }} multiplo={false} />
            <CheckMultiplos options={opcaoMarcaPasso} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setMarcaPassos('Sim') } else { anamneseDoAluno.setMarcaPassos('Não') } }} multiplo={false} />
            <CheckMultiplos options={desfibriladorCardiacoImplantavel} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setDesfibriladorCardiaco('Sim') } else { anamneseDoAluno.setDesfibriladorCardiaco('Não') } }} multiplo={false} />
            <CheckMultiplos options={disturbioDoRitmoCardiaco} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setDisturbioDoRitmoCardiaco('Sim') } else { anamneseDoAluno.setDisturbioDoRitmoCardiaco('Não') } }} multiplo={false} />
            <CheckMultiplos options={insuficienciaCardiaca} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setInsuficienciaCardiaca('Sim') } else { anamneseDoAluno.setInsuficienciaCardiaca('Não') } }} multiplo={false} />
            <CheckMultiplos options={opcaoCardiopatiaCongenita} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setCardiopatiaCongenita('Sim') } else { anamneseDoAluno.setCardiopatiaCongenita('Não') } }} multiplo={false} />
            <CheckMultiplos options={opcaoTransplanteDeCoracao} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setTransplanteDeCoracao('Sim') } else { anamneseDoAluno.setTransplanteDeCoracao('Não') } }} multiplo={false} />
            <CheckMultiplos options={opcaoDoencaRenal} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setDoencaRenal('Sim') } else { anamneseDoAluno.setDoencaRenal('Não') } }} multiplo={false} />
            <CheckMultiplos options={opcaoDiabetes} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setDiabetes('Sim') } else { anamneseDoAluno.setDiabetes('Não') } }} multiplo={false} />
            <CheckMultiplos options={opcaoAsma} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setAsma('Sim') } else { anamneseDoAluno.setAsma('Não') } }} multiplo={false} />
            <CheckMultiplos options={opcaoDoencaPulmonar} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setDoencaPulmonar('Sim') } else { anamneseDoAluno.setDoencaPulmonar('Não') } }} multiplo={false} />
            <CheckMultiplos options={outro} onChange={(isChecked) => { if (isChecked[0] == 1) { anamneseDoAluno.setOutro('Sim'); setMostrarOutro(true)} else { anamneseDoAluno.setOutro('Não'); setMostrarOutro(false)} }} multiplo={false} />
            {mostrarOutro ?
              <>
                <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Especifique:</Text>
                <TextInput
                  placeholder="Informe"
                  style={[
                    style.inputText,
                    estilo.corLight,
                    style.Montserrat,
                  ]}
                  value={outraDoenca}
                  onChangeText={(text) => setOutraDoenca(text)}
                />
              </>

              :
              null
            }
          </View>

          <Text style={[estilo.textoCorSecundaria, estilo.textoP16px, style.Montserrat]}>Selecione o objetivo do seu treino:</Text>
          <View style={[style.selectedObjetivo]}>
            <BotaoSelect
              selecionado={selectedOption2 == '' ? false : true}
              onChange={handleSelectChange2}
              titulo='Objetivo do treino' max={1}
              options={['Enrijecimento',
                'Hipertrofia Geral Intensa',
                'Hipertrofia Geral Moderada',
                'Fortalecimento',
                'Definição Muscular',
                'Bem Estar Geral',
                'Relaxamento',
                'Aliviar dores',
                'Flexibilidade',
                'Manter forma física'
              ]} ></BotaoSelect>
          </View>

          <View style={{ marginTop: 30 }}>
            <TouchableOpacity
              style={[estilo.botao, estilo.corPrimaria]}
              onPress={
                  handleResponderAnamnese}>
              <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER ANAMNESE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>

  )
}

export { anamneseDoAluno };

const style = StyleSheet.create({
  container: { width: '100%', marginVertical: '5%' },
  Montserrat: { fontFamily: 'Montserrat' },
  inputText: { width: '100%', padding: 10, height: 50, borderRadius: 10, marginVertical: 25, elevation: 10 },
  containerTipoSanguineo: { width: '100%', height: 100, padding: 15, flexDirection: 'row' },
  campoInput: { width: '37%' },
  campoRadio: { width: '28%' },
  selectedObjetivo: { width: '100%' },
  areaRadios: { width: '90%' },
  radiosEspacamento: { flexDirection: 'row', marginVertical: 20 },
});
