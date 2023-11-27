import React, {useState, useEffect} from "react"
import {Text, View, SafeAreaView, BackHandler, ScrollView, StyleSheet, TouchableOpacity} from 'react-native'
import estilo from "../estilo"
import RadioBotao from "../RadioBotao"
import QTR from '../../classes/QTR'
import { collection, doc, getDocs, getFirestore, where, deleteDoc, query, addDoc, setDoc } from "firebase/firestore";
import {firebase, firebaseBD} from '../configuracoes/firebaseconfig/config'
import { alunoLogado, academiaDoAluno } from "../Home"
import {Diario} from "../../classes/Diario"

const data = new Date()


const horaInicio = data.getHours()
const minutoInicio = data.getMinutes()


export {horaInicio, minutoInicio}




let qtrDoDia = new QTR('', '')
let diarioDoDia = new Diario('', '','', '', '', '')
export default ({ options = ['6. Em nada recuperado', 
'7. Extremamente mal recuperado',
'8. ',
'9. Muito mal recuperado',
'10. ',
'11. Mal recuperado',
'12. ',
'13. Razoavelmente recuperado',
'14. ',
'15. Bem recuperado',
'16. ',
'17. Muito bem recuperado',
'18. ',
'19. Extremamente bem recuperado',
'20. Totalmente bem recuperado'], navigation, route }) => {
  const [selected, setSelected] = useState(0);
  const {ficha, aluno} = route.params
  console.log('ficha no qtr', ficha)
  let dia = data.getDate();
  let mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  if (dia < 10) {
    dia = `0${dia}`;
  }
  if (mes < 10) {
    mes = `0${mes}`;
  }

  const [diarioInicial, setDiarioInicial] = useState({
    QTR: {
      resposta: qtrDoDia.getResposta(),
      valor: qtrDoDia.getValor(),
    },
    PSE: {
      valor: "0. Repouso",
      valor: 0,
    },
    dia: dia,
    mes: mes,
    ano: ano,
    inicio: `${horaInicio}: ${minutoInicio}`,
  });

  if (diarioInicial.QTR.resposta === "") {
    setDiarioInicial((prevDiario) => ({
      ...prevDiario,
      QTR: {
        resposta: "6. Em nada recuperado",
        valor: 6,
      },
    }));
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  function handleBackPress() {
    return true;
  }

  return (
    <ScrollView style={[style.container, estilo.corLightMenos1]}>
      <SafeAreaView style={[style.conteudo, estilo.centralizado]}>
        <Text style={[estilo.tituloH333px, estilo.textoCorSecundaria]}>Quão recuperado você se sente?</Text>
        <RadioBotao
          options={options}
          selected={selected}
          onChangeSelect={(opt, i) => {
            setSelected(i);
            setDiarioInicial((prevDiario) => ({
              ...prevDiario,
              QTR: {
                resposta: opt,
                valor: i + 6,
              },
            }));
          }}
        ></RadioBotao>
        <View style={{ paddingTop: 20 }}>
          <TouchableOpacity
            style={[estilo.botao, estilo.corPrimaria]}
            onPress={() => {
              navigation.navigate('Seleção do Treino', { diario: diarioInicial, ficha, aluno });
            }}
          >
            <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER QTR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[estilo.botao, estilo.corLight, { borderWidth: 3, borderColor: '#FF6262', marginTop: '5%' }]}
            onPress={() => {
              navigation.navigate('Home');
            }}
          >
            <Text style={[estilo.textoCorDanger, estilo.tituloH619px]}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
          }


const style = StyleSheet.create({
    container: {
        width: '100%',
    },
    conteudo: {
        width: '90%',
        margin: 20,
    }
})