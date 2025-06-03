import React, { useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity
} from 'react-native'
import estilo from '../estilo'
import AntDesign from '@expo/vector-icons/AntDesign'

export default props => {
  const {
    nomeDoExercicio,imagem,
    velocidadeDoExercicio,
    seriesDoExercicio,
    duracaoDoExercicio,
    descansoDoExercicio,
    observacao
  } = props

  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <View style={[styles.container, { marginTop: 12 }]}>
        <View style={[styles.left, estilo.corLightMais1]}>
          {imagem ? (
                      <Image source={{ uri: imagem }} style={styles.image} />
                    ) : (
                      <View style={styles.placeholder} />
                    )}
          <Text
            style={[estilo.textoSmall12px, styles.name]}
            numberOfLines={2}
          >
            {nomeDoExercicio || "Exercício cardio"}
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.observationIcon}
          >
            <AntDesign
              name="questioncircle"
              size={20}
              color="#0066FF"
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.param, estilo.corLight]}>
          <Text style={styles.paramLabel}>Velocidade</Text>
          <Text style={styles.paramValue}>
            {velocidadeDoExercicio ?? '—'}
          </Text>
        </View>

        <View style={[styles.param, estilo.corLight]}>
          <Text style={styles.paramLabel}>Séries</Text>
          <Text style={styles.paramValue}>
            {seriesDoExercicio ?? '—'}
          </Text>
        </View>

        <View style={[styles.param, estilo.corLight]}>
          <Text style={styles.paramLabel}>Duração</Text>
          <Text style={styles.paramValue}>
            {duracaoDoExercicio ?? '—'}
          </Text>
        </View>

        <View style={[styles.param, estilo.corLight]}>
          <Text style={styles.paramLabel}>Repouso</Text>
          <Text style={styles.paramValue}>
            {descansoDoExercicio ?? '—'}
          </Text>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[estilo.tituloH427px, styles.modalTitle]}>
              Informações gerais do exercício
            </Text>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Nome do Exercício:</Text>
              <Text style={styles.modalText}>{nomeDoExercicio}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Observações:</Text>
              <Text style={styles.modalText}>
                {observacao || 'Nenhuma observação.'}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',flexWrap: 'wrap',
    backgroundColor: estilo.corLightMais1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',minHeight: 70,
  },
  name: {
    flex: 1,
    fontSize: 13,
    lineHeight: 16,
    color: estilo.corPrimaria,
    flexWrap: 'wrap',
  },
  observationIcon: {
    marginLeft: 8,
    marginTop: 5,
    Top: 20,
    paddingTop: 0,
    paddingRight: 3,
  },
  param: {
    flex: 0.29,
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 17,
    marginLeft: 0
  },
  paramLabel: {
    fontSize: 10,
    color: estilo.corSecundaria,
    marginBottom: 4,
    textAlign: 'center'
  },
  paramValue: {
    fontSize: 12,
    color: estilo.corTexto,
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%'
  },
  modalTitle: {
    color: estilo.corPrimaria,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalSection: {
    marginBottom: 15
  },
  modalLabel: {
    ...estilo.textoNegado,
    color: estilo.corSecundaria,
    fontSize: 14,
    marginBottom: 5
  },
  modalText: {
    ...estilo.textoP16px,
    color: estilo.corTexto,
    lineHeight: 22
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 15
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    backgroundColor: estilo.corPrimaria,
    borderRadius: 6,
    alignItems: 'center'
  },
  closeButtonText: {
    ...estilo.textoCorLight,
    fontSize: 14
  },image: {
    width: 46,
    height: 46,
    borderRadius: 20,
    backgroundColor: '#ddd'
  },
  placeholder: {
    width: 46,
    height: 46,
    borderRadius: 20,
    backgroundColor: '#eee'
  },
})
