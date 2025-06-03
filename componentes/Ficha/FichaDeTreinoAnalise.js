import React, { useState } from "react";
import { Text, View, SafeAreaView, Dimensions, StyleSheet, ScrollView, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import estilo from "../estilo";
import ExerciciosAlongamento from "./ExerciciosAlongamento";
import ExerciciosCardio from "./ExerciciosCardio";
import ExerciciosForça from "./ExerciciosForça";
import AntDesign from '@expo/vector-icons/AntDesign';

export default ({ posicaoDoArray = 0, exercicios }) => {
  const [selectedFicha, setSelectedFicha] = useState(null);
  const fichasUnicas = [...new Set(exercicios.map(item => item.ficha))];

  const toggleFicha = (ficha) => {
    setSelectedFicha(prev => prev === ficha ? null : ficha);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {fichasUnicas.length > 0 ? (
        fichasUnicas.map((ficha) => (
          <View key={ficha} style={styles.fichaContainer}>
            <TouchableOpacity
              style={[
                estilo.botao,
                estilo.corLightMenos1,
                styles.fichaHeader,
                { borderBottomLeftRadius: selectedFicha === ficha ? 0 : 8,
                  borderBottomRightRadius: selectedFicha === ficha ? 0 : 8 }
              ]}
              onPress={() => toggleFicha(ficha)}
            >
              <View style={styles.headerContent}>
                <AntDesign name="filetext1" size={24} color={estilo.corPrimaria} />
                <Text style={styles.tituloFicha}>Ficha {ficha}</Text>
                <AntDesign
                  name={selectedFicha === ficha ? "up" : "down"}
                  size={16}
                  color={estilo.corPrimaria}
                />
              </View>
            </TouchableOpacity>

            {selectedFicha === ficha && (
              <View style={styles.exercisesContainer}>
                {exercicios.map((item, index) =>
                  item.ficha === ficha && (
                    <View key={index} style={styles.exerciseContainer}>
                      {item.tipo === 'força' ? (
                        <ExerciciosForça
                          nomeDoExercicio={item.Nome.exercicio}
                          series={item.series}
                          repeticoes={item.repeticoes}
                          descanso={item.descanso}
                          cadencia={item.cadencia}
                          observacao={item.observacao}
                        />
                      ) : item.tipo === 'aerobico' ? (
                        <ExerciciosCardio
                          nomeDoExercicio={item.Nome.exercicio}
                          velocidadeDoExercicio={item.velocidade}
                          duracaoDoExercicio={item.duracao}
                          seriesDoExercicio={item.series}
                          descansoDoExercicio={item.descanso}
                          observacao={item.observacao}
                        />
                      ) : item.tipo === 'alongamento' ? (
                        <ExerciciosAlongamento
                          nomeDoExercicio={item.Nome}
                          series={item.series}
                          descanso={item.descanso}
                          repeticoes={item.repeticoes}
                          imagem={item.imagem}
                          observacao={item.observacao}
                        />
                      ) : null}
                    </View>
                  )
                )}
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.mensagemVazia}>
          A última ficha ainda não foi lançada. Solicite ao professor responsável para lançá-la e tente novamente mais tarde.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: estilo.corLight
  },
  contentContainer: {
    padding: 5
  },
  fichaContainer: {
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: estilo.corLightMenos1,
    elevation: 0,
  },
  fichaHeader: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: estilo.corLightMais1,
    borderWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 5,
    paddingVertical: 2,
  },
  tituloFicha: {
    ...estilo.tituloH523px,
    color: estilo.corPrimaria,
  },
  exercisesContainer: {
    padding: 15,
    backgroundColor: estilo.corLight,
    borderTopWidth: 1,
    borderTopColor: estilo.corLightMais1,
  },
  exerciseContainer: {
    marginVertical: 10,
  },
  mensagemVazia: {
    ...estilo.textoP16px,
    ...estilo.textoCorSecundaria,
    marginHorizontal: 15,
    textAlign: 'justify'
  },
});