import React, { useState } from "react";
import { Text, View, SafeAreaView, Dimensions, StyleSheet, ScrollView, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import estilo from "../estilo";
import ExerciciosAlongamento from "./ExerciciosAlongamento";
import ExerciciosCardio from "./ExerciciosCardio";
import ExerciciosForça from "./ExerciciosForça";

export default ({ posicaoDoArray = 0, exercicios }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState('');

  const handleObservationPress = (observacao) => {
    setSelectedObservation(observacao);
    setModalVisible(true);
  };

  const fichasUnicas = [...new Set(exercicios.map(item => item.ficha))];

  return (
    <ScrollView style={style.container}>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{selectedObservation}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {fichasUnicas.length > 0 ? (
        fichasUnicas.map((ficha) => (
          <View key={ficha}>
            <Text>Ficha {ficha}</Text>
            {exercicios.map((item, index) =>
              item.ficha === ficha ? (
                <View key={index} style={{ width: '100%' }}>
                  {item.observacao && (
                    <TouchableOpacity 
                      style={styles.observationIcon} 
                      onPress={() => handleObservationPress(item.observacao)}
                    >
                      <Text style={styles.exclamation}>!</Text>
                    </TouchableOpacity>
                  )}
                  
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
              ) : null
            )}
          </View>
        ))
      ) : (
        <Text style={[{ marginHorizontal: 15, textAlign: 'justify' }, estilo.textoP16px, estilo.textoCorSecundaria]}>
          A última ficha ainda não foi lançada. Solicite ao professor responsável para lançá-la e tente novamente mais tarde.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  observationIcon: {
    position: 'absolute',
    right: 20,
    top: 10,
    zIndex: 1,
  },
  exclamation: {
    color: 'red',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});