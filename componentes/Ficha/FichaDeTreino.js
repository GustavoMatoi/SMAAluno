import React, { useState, useEffect } from "react"
import { Text, View, SafeAreaView, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import estilo from "../estilo"
import ExerciciosAlongamento from "./ExerciciosAlongamento"
import ExerciciosCardio from "./ExerciciosCardio"
import ExerciciosForça from "./ExerciciosForça"

export default ({ exercicios }) => {
  const [fichaValida, setFichaValida] = useState(false)
  const [verificando, setVerificando] = useState(true)
  console.log('exercicios', exercicios)
  console.log('typeof exercicios', exercicios)

  const exerciciosNaFicha = [...exercicios]

  console.log('exerciciosNaFicha', exerciciosNaFicha)

  return (
    <ScrollView style={style.container}>
      {
      
      exerciciosNaFicha.length > 0 ?  (
          exerciciosNaFicha.map((item, index) => (
            <View key={index} style={{ width: '100%' }}>
              {item.tipo === 'força' ? (
                <ExerciciosForça
                  nomeDoExercicio={item.Nome.exercicio}
                  series={item.series}
                  repeticoes={item.repeticoes}
                  descanso={item.descanso}
                  cadencia={item.cadencia}
                />
              ) : item.tipo === 'aerobico' ? (
                <ExerciciosCardio
                  nomeDoExercicio={item.Nome.exercicio}
                  velocidadeDoExercicio={item.velocidade}
                  duracaoDoExercicio={item.duracao}
                  seriesDoExercicio={item.series}
                  descansoDoExercicio={item.descanso}
                />
              ) : item.tipo === 'alongamento' ? (
                <ExerciciosAlongamento
                  nomeDoExercicio={item.Nome}
                  series={item.series}
                  descanso={item.descanso}
                  repeticoes={item.repeticoes}
                  imagem={item.imagem}
                />
              ) : null}
            </View>
          ))
        ) : (
          <Text style={[{ marginHorizontal: 15, textAlign: 'justify' }, estilo.textoP16px, estilo.textoCorSecundaria]}>
            A última ficha ainda não foi lançada. Solicite ao professor responsável para lançá-la e tente novamente mais tarde.
          </Text>
        )  }
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    width: '100%',

  }
})