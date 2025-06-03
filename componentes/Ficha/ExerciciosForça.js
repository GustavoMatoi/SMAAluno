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
    conjugado,
    imagem,
    nomeDoExercicio,
    series,
    repeticoes,
    descanso,
    cadencia,
    observacao
  } = props

  const [modalVisible, setModalVisible] = useState(false)
   const tituloSimples = nomeDoExercicio
    ? nomeDoExercicio.split('|')[0].trim()
    : 'Exercício Força'

  return (
    <>
      <View style={[styles.container, conjugado && styles.containerConjugado]}>
        <View style={styles.left}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.image} />
          ) : (
            <View style={styles.placeholder} />
          )}
          <Text numberOfLines={6} style={[estilo.textoSmall12px, styles.name]}>
              {tituloSimples}
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

        <View style={styles.param}>
          <Text style={styles.paramLabel}>Séries</Text>
          <Text style={styles.paramValue}>{series ?? '—'}</Text>
        </View>

        <View style={styles.param}>
          <Text style={styles.paramLabel}>Reps</Text>
          <Text style={styles.paramValue}>{repeticoes ?? '—'}</Text>
        </View>

        <View style={styles.param}>
          <Text style={styles.paramLabel}>Descanso</Text>
          <Text style={styles.paramValue}>{descanso ?? '—'}</Text>
        </View>

        <View style={styles.param}>
          <Text style={styles.paramLabel}>Cadência</Text>
          <Text style={styles.paramValue}>{cadencia ?? '—'}</Text>
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
            <Text style={[estilo.tituloH427px, styles.modalTitle]}>Informações gerais do exercicio</Text>
            
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
    alignItems: 'center',
    backgroundColor: estilo.corLightMais1,
    borderRadius: 6,
    paddingVertical: 0,
    paddingHorizontal: 12
  },
  containerConjugado: {
    backgroundColor: estilo.corLight
  },
    left: {
    flex: 3,               
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...estilo.corLightMais1,
    paddingVertical: 10,
    paddingHorizontal: 10,     
  },
  name: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 16,
    color: estilo.corPrimaria,
    flexShrink: 1         
  },
  image: {
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
  name: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 16,
    color: estilo.corPrimaria
  },
  observationIcon: {
    left: 7,
  },
  param: {
    flex: 1,
    alignItems: 'center',
    ...estilo.corLight,
    borderRadius: 6,
    paddingVertical: 17,
  },
  paramLabel: {
    fontSize: 10,
    color: estilo.corSecundaria,
    marginBottom: 4
  },
  paramValue: {
    fontSize: 12,
    color: estilo.corTexto
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20
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
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%'
  },
  buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 20,
  ...estilo.corPrimaria,borderRadius: 15
},
  modalText: {
    ...estilo.textoP16px,
    color: estilo.corTexto,
    lineHeight: 22
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
