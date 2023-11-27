import React, {useState} from "react"
import { TouchableOpacity, View, SafeAreaView, StyleSheet, Text } from "react-native"
import estilo from "../estilo"
import { Entypo } from '@expo/vector-icons'; 
import FichaDeTreino from "../Ficha/FichaDeTreino";

export default ({onPress}) => {
    const [clicado, setClicado] = useState(false);
    
    const handleClick = () => {
      onPress();
      setClicado(true);
    };
  
    return (
      <View style={style.container}>
        <Text style={[estilo.textoSmall12px, {marginTop: '-22%'}]}>Detalhes do exercício</Text>
        <TouchableOpacity 
          style={clicado ? [estilo.corSuccess, style.botao] : [estilo.corPrimaria, style.botao]} 
          onPress={handleClick}
          disabled={clicado? true : false}
        >
          <Entypo name="list" size={60} color="white" />
        </TouchableOpacity>
      </View>
    );
  };


const style = StyleSheet.create({
    container: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botao: {
        height: 60,
        width: 60,
        borderRadius: 5,
        alignItems: 'center',
    }
})