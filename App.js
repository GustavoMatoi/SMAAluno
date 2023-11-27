import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Pressable, Button } from 'react-native';
import {useFonts} from 'expo-font'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { firebase } from './componentes/configuracoes/firebaseconfig/config';
import Home from './componentes/Home';
import Routes from './componentes/routes';
import LoginScreen from './componentes/NavegacaoLoginScreen/LoginScreen'
import CadastroScreen from './componentes/NavegacaoLoginScreen/CadastroScreen';
import RecuperarSenhaTela1 from './componentes/recuperarSenha/RecuperarSenhaTela1';
import PrimeiroLoginScreen from "./componentes/PrimeiroLoginScreen"
import PARQ from './componentes/Parq'
import Anamnese from './componentes/Anamnese'
import SelecaoDoTreino from './componentes/SelecaoDoTreino';
import EvolucaoDoTreino from './componentes/EvolucaoDoTreino';
import RecuperarSenhaTela2 from './componentes/recuperarSenha/RecuperarSenhaTela2'
import RecuperarSenhaTela3 from './componentes/recuperarSenha/RecuperarSenhaTela3';
import RecuperarSenhaTela4 from './componentes/recuperarSenha/RecuperarSenhaTela4'
import ModalSuccessSenha from './componentes/ModalSuccess/ModalSuccessRecuperarSenha';
import RelatarProblema from './componentes/RelatarProblema'
import TelaAnaliseDoProgramaDeTreino from './componentes/TelaAnaliseDoProgramaDeTreino'
import TelaFichaDeTreino from './componentes/TelaFichaDeTreino/FichaDeTreino'
import Diario from './componentes/Diario'
import PSE from './componentes/PSE'
import QTR from './componentes/Qtr'
import ModalSuccessRelatar from './componentes/ModalSuccess/ModalSuccessRelatar';
import ModalSuccessNotificacao from './componentes/ModalSuccess/ModalSuccessNotificacao';
import Avaliacoes from './componentes/Avaliacoes';
import EvolucaoCorporal from './componentes/TelasDeEvolucao/EvolucaoCorporal';
import EvolucaoDosTestes from './componentes/TelasDeEvolucao/EvolucaoDosTestes';
import EvolucaoDoExercicioSelecao from './componentes/TelasDeEvolucao/EvolucaoDoExercicioSelecao'
import Detalhamento from './componentes/Detalhamento';
import BoasVindasScreen from './componentes/BoasVindasScreen';
import EditarPerfil from './componentes/Perfil/EditarPerfil';
import PSEBorg from './componentes/PSE/PSEBorg';
import PSEOMNI from './componentes/PSE/PSEOMNI';
import Perflex from './componentes/PSE/Perflex';
import EvolucaoPSE from './componentes/TelasDeEvolucao/EvolucaoPSE';
import EvolucaoQTR from './componentes/TelasDeEvolucao/EvolucaoQTR';
import EvolucaoDoExercicio from './componentes/TelasDeEvolucao/EvolucaoDoExercicio';
import ModalForaDaAcademia from './componentes/ModalForaDaAcademia'
import ModalSemConexao from './componentes/ModalSemConexao';
import ModalSemConexaoDiario from './componentes/ModalSemConexaoDiario';
import Chat from './componentes/Chat';
import Mensagens from './componentes/Chat/Mensagens';
import EvolucaoCIT from './componentes/TelasDeEvolucao/EvolucaoCIT';
import EvolucaoStrain from './componentes/TelasDeEvolucao/EvolucaoStrain';
import EvolucaoMonotonia from './componentes/TelasDeEvolucao/EvolucaoMonotonia';
import EvolucaoPSEDoExercicio from './componentes/TelasDeEvolucao/EvolucaoPSEDoExercicio';
import EvolucaoPSEEx from './componentes/TelasDeEvolucao/EvolucaoPSEEx';
import Qtr from './componentes/Qtr';

const Stack = createNativeStackNavigator();


export default function App() {
  const [fontsLoaded] = useFonts({
    'Montserrat': require('./assets/Montserrat-Light.ttf'),
})
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()

  function onAuthStateChanged(user){
    setUser(user)
    if(initializing){
      setInitializing(false)
    }

    useEffect(() => {
      const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged)
      return subscriber
    }, [])

    if(initializing){
      return null
    }

  }

{/*

*/}
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name="Primeiro Login" component={PrimeiroLoginScreen}  options={{headerShown: false}}/>
      <Stack.Screen name="Principal" component={Routes}  options={{headerShown: false}}/>
      <Stack.Screen name="Cadastro" component={CadastroScreen}/>
      <Stack.Screen name="Concluir cadastro" component={BoasVindasScreen}/>


      <Stack.Screen name="Recuperar" component={RecuperarSenhaTela1}/>
      <Stack.Screen name="Recuperar senha tela 2" component={RecuperarSenhaTela2}/>
      <Stack.Screen name="Recuperar senha tela 3" component={RecuperarSenhaTela3}/>
      <Stack.Screen name="Recuperar senha tela 4" component={RecuperarSenhaTela4}/>
      <Stack.Screen name="Modal Success Senha" component={ModalSuccessSenha} options={{headerShown: false}}/>
    <Stack.Screen name="Fora da academia" component={ModalForaDaAcademia} options={{headerShown: false}}/>

      <Stack.Screen name="PARQ" component={PARQ}/>
      <Stack.Screen name="Anamnese" component={Anamnese}/>


      <Stack.Screen name="Seleção do Treino" component={SelecaoDoTreino}/>
      <Stack.Screen name="Evolução do treino" component={EvolucaoDoTreino}/>
      <Stack.Screen name="EVOLUÇÃO CORPORAL" component={EvolucaoCorporal}/>
      <Stack.Screen name="EVOLUÇÃO DOS TESTES" component={EvolucaoDosTestes}/>
      <Stack.Screen name="EVOLUÇÃO PSE" component={EvolucaoPSE} />
      <Stack.Screen name="EVOLUÇÃO QTR" component={EvolucaoQTR}  />
      <Stack.Screen name="EVOLUÇÃO CIT" component={EvolucaoCIT}  />
      <Stack.Screen name="EVOLUÇÃO STRAIN" component={EvolucaoStrain}  />
      <Stack.Screen name="EVOLUÇÃO MONOTONIA" component={EvolucaoMonotonia}  />
      <Stack.Screen name="EVOLUÇÃO PSE DO EXERCÍCIO" component={EvolucaoPSEDoExercicio}  />
      <Stack.Screen name="Evolução PSE do Exercício" component={EvolucaoPSEEx}  />
      
      <Stack.Screen name="EVOLUÇÃO DO EXERCÍCIO">      
      {(props) => <EvolucaoDoExercicio {...props} />}
</Stack.Screen>

      <Stack.Screen name="SELECIONAR EXERCÍCIO" component={EvolucaoDoExercicioSelecao} />


      <Stack.Screen name="Analise do Programa de Treino">
      {(props) => <TelaAnaliseDoProgramaDeTreino {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Relatar problema" component={RelatarProblema}/>
      <Stack.Screen name="Editar perfil" component={EditarPerfil} />

      <Stack.Screen name="Avaliações" component={Avaliacoes}/>


      <Stack.Screen name="Modal Success Notificacao">{props => 
      <ModalSuccessNotificacao
      navigation= {props.navigation}
      />}</Stack.Screen>





      <Stack.Screen name="Modal Success Relatar" component={ModalSuccessRelatar} options={{headerShown: false}}/>
      <Stack.Screen name="Modal sem conexão" component={ModalSemConexao} options={{headerShown: false}}/>
      <Stack.Screen name="Modal sem conexão diario" component={ModalSemConexaoDiario} options={{headerShown: false}}/>

      <Stack.Screen name="Ficha" component={TelaFichaDeTreino}  options={{headerShown: false}}/>
      <Stack.Screen name="Diario" component={Diario}  options={{headerShown: false}}/>
      <Stack.Screen name="Detalhamento" component={Detalhamento} options={{headerShown: false}}/>



      <Stack.Screen name="QTR" options={{headerShown: false}} component={Qtr}/>

      <Stack.Screen name="PSE">{props => 
      <PSE tipoPSE='PSE' 
      navigation= {props.navigation}
      options={[
      '0. Repouso', 
      '1. Muito, muito fácil',
      '2. Fácil',
      '3. Moderado',
      '4. Um pouco difícil',
      '5. Difícil',
      '6. ',
      '7. Muito difícil',
      '8. ',
      '9.',
      '10. Máximo'
    ]}
    route={props.route}
      />}
      </Stack.Screen>
      <Stack.Screen name="PSE Borg">{props => 
      <PSEBorg tipoPSE='PSE Borg' 
      route = {props.route}
      navigation= {props.navigation}      
      options={[
      '6. Nenhum esforço', 
      '7. Extremamente leve',
      '8.',
      '9. Muito leve',
      '10.',
      '11. Leve',
      '12.',
      '13. Um pouco difícil',
      '14.',
      '15. Difícil (pesado)',
      '16.',
      '17. Muito difícil',
      '18.',
      '19. Extremamente difícil',
      '20. Esforço máximo'
    ]}
    
      />}</Stack.Screen>
      <Stack.Screen name="PSE Omni">{props => 
      <PSEOMNI tipoPSE='PSE Omni' 
      route = {props.route}
      navigation= {props.navigation}
      options={[
        '0. Extremamente fácil',
        '1. ', 
        '2. Fácil',
        '3. ',
        '4. Pouco fácil', 
        '5. ',
        '6. Um pouco difícil', 
        '7. ',
        '8. Difícil', 
        '9. ',
        '10. Extremamente difícil'
    ]}
      />}</Stack.Screen>
      <Stack.Screen name="Perflex">{props => 
      <Perflex tipoPSE='Perflex' 
      route = {props.route}
      navigation= {props.navigation}
      options={[
        '0 - 30. Normalidade',
        '31 - 60. Forçamento',
        '61 - 80. Desconforto',
        '81 - 90. Dor suportável',
        '91 - 110. Dor forte' 
    ]}
      />}</Stack.Screen>
      <Stack.Screen name='Chat - Professores' component={Chat}/>
      <Stack.Screen name='Mensagens' component={Mensagens} options={{headerShown: false}}/>

    </Stack.Navigator>

  </NavigationContainer>
    )
}
