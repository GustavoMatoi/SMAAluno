import React, { useState } from "react";
import { Text, View, SafeAreaView, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from "react-native"
import estilo from "./estilo";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from "./Logo";
import { useFonts } from "expo-font"

export default ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    'Montserrat': require('../assets/Montserrat.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);

  const calculatePreciseDistance = async () => {
    const location = await getLocation();
    await geoCode();

    if (geocodingComplete) {
      var pdis = getDistance(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        { latitude: locationAcademia[0].latitude, longitude: locationAcademia[0].longitude }
      )
      alert(`Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
      alert(pdis)
      setDistanciaDaAcademia(pdis)
      console.log(distanciaDaAcademia)
      setIsLoading(false); // Define isLoading como false quando a distância da academia é calculada
    }
  };

  return (
    <View style={[estilo.corLightMenos1, style.container]}>
      <Logo tamanho='pequeno'></Logo>

      <View style={[{ marginTop: '50%' }, estilo.centralizado]}>
        <MaterialCommunityIcons name="office-building-marker" size={150} color="#182128" />
      </View>

      <Text style={[estilo.textoCorSecundaria, estilo.tituloH333px, estilo.centralizado]}>Localização inválida</Text>
      <TouchableOpacity style={[estilo.botao, estilo.corPrimaria, { marginTop: '20%' }]} onPress={() => navigation.goBack()}>
        <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>FECHAR</Text>
      </TouchableOpacity>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
        flex: 1
    }, 
    Montserrat: {
        fontFamily: 'Montserrat'
    }

})