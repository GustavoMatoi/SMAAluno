import React, {useState, useEffect, useRef} from "react"
import {Text, View, BackHandler, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'
import { collection, doc, getDocs, getFirestore, where, deleteDoc, query, addDoc } from "firebase/firestore";
import { alunoLogado, academiaDoAluno} from "../Home";
import estilo from "../estilo"
import FichaDeTreino from "../Ficha/FichaDeTreino"
import Caixinha from "./Caixinha"
import NetInfo from '@react-native-community/netinfo';
import { Entypo } from '@expo/vector-icons'; 
import { Exercicio } from "../../classes/Exercicio";
import { ExercicioNaFicha } from "../../classes/ExercicioNaFicha";
import { horaInicio, minutoInicio} from "../Qtr";
import { useNavigation } from '@react-navigation/native';

export default ({navigation, route}) => {
    const [conexao, setConexao] = useState(true)
    const backButtonRef = useRef(0)
    const [ultimaFicha, setUltimaFicha] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const {diario, ficha, aluno} = route.params
    console.log("ALUNOOOOOOOOOOOOOOOOOOOOOOOOOOOO ", aluno)
    console.log('diario na ficha', ficha)
    
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConexao(state.type === 'wifi')
        })

        BackHandler.addEventListener('hardwareBackPress', handleBackPress)

        return () => {
            unsubscribe()
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
        }
    }, [])
    const onPressHandler = () => {
      navigation.navigate('PSE', { diario, aluno });
      console.log("DIARIO ANTES DE NAVEGAR PRO PSE", diario);
    };



   
    const handleBackPress = () => {
        backButtonRef.current += 1
        if (backButtonRef.current === 2) {
            navigation.goBack()
            backButtonRef.current = 0
            return true
        } else {
            alert('Caso deseja trocar a maneira de treino, pressione novamente para voltar')
            return true
        }
    }


      console.log("ULTIMA FICHAAAA" + ultimaFicha)
    

    return (
        <ScrollView style={[estilo.corPrimaria, style.container]}>
            <SafeAreaView style={[estilo.centralizado, style.header]}>
                <Text style={[estilo.textoCorLight, estilo.tituloH240px, estilo.centralizado]}>FICHA</Text>

            </SafeAreaView>
            <SafeAreaView style={[estilo.corLightMenos1, style.body]}>
                <View style={[{marginTop: -80, width: '90%', marginLeft: 'auto'}]}>
                <Caixinha responsavel={ficha.responsavel} dataFim={ficha.dataFim} dataInicio={ficha.dataInicio} objetivoDoTreino={ficha.objetivoDoTreino}/>
                </View>
                <View style={[style.areaDaFicha]}>
                    {ultimaFicha?
                
                     <View>
                        <FichaDeTreino exercicios={ficha.Exercicios}></FichaDeTreino>
                        <TouchableOpacity style={[estilo.corPrimaria, style.botaoResponderPSE, estilo.centralizado]} onPress={onPressHandler}>
                            <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER PSE</Text>
                        </TouchableOpacity>
                    </View>  : 
                                 <View style={[estilo.centralizado, {marginTop: '5%',marginLeft: '20%', marginRight: '20%', marginBottom: '20%'}]}>
                                 <View style={estilo.centralizado}>
                                   <Text style={[estilo.tituloH427px, estilo.textoCorSecundaria, {textAlign: 'center', fontFamily: 'Montserrat'}]}>
                                   Ops...
                                   </Text>
                                   <Entypo name="emoji-sad" size={150} color="#182128" />
                                 </View>
                                 <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, {textAlign: 'center', fontFamily: 'Montserrat'}]}>
                                     Parece que você ainda não possui nenhuma ficha de exercícios. Que tal solicitar uma ao seu professor responsável?
                                 </Text>
               
                                 <TouchableOpacity style={[estilo.corPrimaria, style.botaoResponderPSE, estilo.centralizado]}
                                               onPress={()=>{excluirDiario();navigation.navigate('Home')}}>
                                                   <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>VOLTAR</Text>
                                 </TouchableOpacity>
                               </View> }
                    
                </View>
                

            </SafeAreaView>

        </ScrollView>
    )
}

const style = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        marginTop: 50
    },
    body: {
        marginTop: '30%',
        width: '100%',
        paddingBottom: '20%'
    },
    areaDaFicha: {
        marginTop: '5%'
    },
    botaoResponderPSE: {
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius:15,
        width: '60%',
        marginTop: '20%'
    }
})