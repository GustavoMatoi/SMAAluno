import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, SafeAreaView, ActivityIndicator} from 'react-native'
import estilo from '../estilo'
import {firebase, firebaseBD} from '../configuracoes/firebaseconfig/config'
import { getStorage, ref ,uploadBytes, getDownloadURL } from '@firebase/storage';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { alunoLogado } from '../Home';
import { FichaDeExercicios } from '../../classes/FichaDeExercicios';
import { collection,setDoc,doc, getDocs, getDoc,getFirestore, where , query , addDoc, orderBy} from "firebase/firestore";


export default ({responsavel, dataFim, dataInicio, objetivoDoTreino}) => {



  return (
    <View style={[style.container, estilo.corLightMenos1]}>
      <Text style={[style.espacamentoTextos, estilo.textoCorSecundaria, estilo.textoP16px]}>
        <Text style={[estilo.textoCorSecundaria, { fontWeight: "bold" }]}>Responsável: </Text>
        {responsavel || ""}
      </Text>
      <Text style={[style.espacamentoTextos, estilo.textoCorSecundaria, estilo.textoP16px]}>
        <Text style={[{ fontWeight: "bold" }]}>Objetivo: </Text>
        {objetivoDoTreino || ""}
      </Text>
      <Text style={[style.espacamentoTextos, estilo.textoCorSecundaria, estilo.textoP16px]}>
        <Text style={[{ fontWeight: "bold" }]}>Data início: </Text>
        {dataInicio || ""}
      </Text>
      <Text style={[style.espacamentoTextos, estilo.textoCorSecundaria, estilo.textoP16px]}>
        <Text style={[{ fontWeight: "bold" }]}>Data fim: </Text>
        {dataFim || ""}
      </Text>
    </View>
  );
};

const style = StyleSheet.create({
    container: {
        width: '90%',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 10
    },
    espacamentoTextos: {
        marginVertical: 2
    }
})