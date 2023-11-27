import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, SafeAreaView, Image} from 'react-native'
import estilo from '../estilo'
import { alunoLogado } from '../Home'
import { useFonts } from 'expo-font'
import { getStorage, ref, getDownloadURL } from '@firebase/storage';

export default ({aluno}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true); // adicionando estado para tela de carregamento

  const getStoredImage = async () => {
      const storage = getStorage();
      const storeRef = ref(storage, `foto${aluno.cpf}.jpg`);

      try {
          const url = await getDownloadURL(storeRef);
          setImageUrl(url);
          setLoading(false); // alterando para false assim que a imagem for recuperada com sucesso
      } catch (error) {
            const url  = 'https://firebasestorage.googleapis.com/v0/b/shapemeappbdteste.appspot.com/o/fotopadrao.jpg?alt=media&token=c1f35033-a208-40ce-8d69-52279a798210'
            setImageUrl(url)
            console.log(error);
          setLoading(false); // alterando para false em caso de erro
      }
  };

  const [fontsLoaded] = useFonts({
      'Montserrat': require('../../assets/Montserrat-Light.ttf'),
  })

  useEffect(() => {
      getStoredImage();
  }, []);

  return (
      <View style={[style.container, estilo.corLightMenos1, estilo.sombra]}>
          {/* Adicionando elemento condicional para exibir a tela de carregamento ou a imagem */}
          {loading ? (
              <View  style={[{width: 200, height: 200, borderRadius: 100, marginTop: '-30%'}, estilo.corSecundaria]}>
              </View>
          ) : (
              <Image 
                  style={{width: 200, height: 200, borderRadius: 100, marginTop: '-30%'}}
                  source={imageUrl ? { uri: imageUrl } : "Não achou a imagem"} />
          )}
          <Text style={[estilo.textoP16px, estilo.textoCorSecundaria, estilo.centralizado, estilo.tituloH427px, {marginTop: 15}]}>{aluno.nome}</Text>
      </View>
  )
}

const style = StyleSheet.create({
  container: {
      width: '90%',
      height: 200,
      borderRadius: 20,
      paddingHorizontal: 20,
      elevation: 10,
      justifyContent: 'center',
      alignItems: 'center',
  },
  foto: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginTop: '-25%'
  },
  Montserrat: {
  //    fontFamily: 'Montserrat'
  }
})