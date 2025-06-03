import React, { useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity
} from 'react-native'
import estilo from '../estilo'
import AntDesign from '@expo/vector-icons/AntDesign'

export default props => {
  const {
    imagem,
    nomeDoExercicio,
    series,
    repeticoes,
    descanso,
    observacao
  } = props

  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <View style={[style.container, { marginTop: 12 }]}>
        <View style={[estilo.corLightMais1, style.nomeDoExercicio, { flexDirection: 'row', alignItems:'flex-start',flexWrap: 'wrap' }]}>
          <Image
            style={{ width: 50, height: 50 }}
            source={{ uri: imagem || '' }}
          />
          <Text style={[estilo.textoSmall12px, { width: 90 }]}>
            {nomeDoExercicio || "Exercício Alongamento"}
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={style.observationIcon}
          >
            <AntDesign
              name="questioncircle"
              size={20}
              color="#0066FF"
            />
          </TouchableOpacity>
        </View>

        <View style={[style.parametroGrande, estilo.corLight]}>
          <Text style={[style.tituloParametro]}>Séries</Text>
          <Text style={[estilo.textoSmall12px, style.textoParametro, { alignItems: 'center', marginTop: '40%' }]}>
            {series || "Ser."}
          </Text>
        </View>

        <View style={[style.parametroGrande, estilo.corLight]}>
          <Text style={[style.tituloParametro]}>Duração</Text>
          <Text style={[estilo.textoSmall12px, style.textoParametro, { alignItems: 'center', marginTop: '40%' }]}>
            {repeticoes || "Reps."}
          </Text>
        </View>

        <View style={[style.parametroGrande, estilo.corLight]}>
          <Text style={[style.tituloParametro]}>Intervalo</Text>
          <Text style={[estilo.textoSmall12px, style.textoParametro, { alignItems: 'center', marginTop: '40%' }]}>
            {descanso || "Desc."}
          </Text>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={style.modalContainer}>
          <View style={style.modalContent}>
            <Text style={[estilo.tituloH427px, style.modalTitle]}>Informações gerais do exercício</Text>

            <View style={style.modalSection}>
              <Text style={style.modalLabel}>Nome do Exercício:</Text>
              <Text style={style.modalText}>{nomeDoExercicio}</Text>
            </View>

            <View style={style.modalSection}>
              <Text style={style.modalLabel}>Observações:</Text>
              <Text style={style.modalText}>
                {observacao || 'Nenhuma observação.'}
              </Text>
            </View>

            <View style={style.buttonContainer}>
              <TouchableOpacity
                style={style.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={style.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignItems: 'flex-start',
    backgroundColor: estilo.corLightMais1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginTop: 12
  },
  nomeDoExercicio: {
    flex: 1,
    width: '50%',
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  parametroGrande: {
    flex: 0, alignItems: 'center',
    width: '16%',
    height: '100%'
  },
  tituloParametro: {
    top: 10,
    fontSize: 9
  },
  textoParametro: {
    textAlign: 'center',
    width: '100%',
    marginTop: 10
  },
  observationIcon: {
    position: 'absolute',
    right: 5,
    top: 18
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
  }
})