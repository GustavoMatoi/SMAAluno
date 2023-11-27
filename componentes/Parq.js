import React, {useState, useEffect} from "react"
import {Text, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity} from "react-native"
import estilo from "./estilo"
import RadioBotao from "./RadioBotao"
import Botao from "./Botao"
import {useFonts} from 'expo-font'
import { novoAluno } from "./NavegacaoLoginScreen/CadastroScreen"
import { Parq } from "../classes/Parq"


const parqDoAluno = new Parq('0', '0', '0', '0', '0', '0', '0')

export default ({navigation}) => {
    const [selected1, setSelected1] = useState(0)
    const [selected2, setSelected2] = useState(0)
    const [selected3, setSelected3] = useState(0)
    const [selected4, setSelected4] = useState(0)
    const [selected5, setSelected5] = useState(0)
    const [selected6, setSelected6] = useState(0)
    const [selected7, setSelected7] = useState(0)
    const [selected8, setSelected8] = useState(0)

    const [fontsLoaded] = useFonts({
        'Montserrat': require('../assets/Montserrat.ttf'),
    })


    const textoConfirma =
     <View style={{width: '100%', marginTop: 20}}>
     <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat]}>Eu li, entendi e preenchi este questionário.</Text> 
     <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat]}>Quaisquer perguntas que eu tive foram</Text>
     <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat]}>respondidas a minha plena satisfação.</Text>
    </View>

    parqDoAluno.setRespostaDoencaCardiaca(selected1)
    parqDoAluno.setRespostaDorNoPeito(selected2)
    parqDoAluno.setRespostaDorNoPeitoUltimoMes(selected3)
    parqDoAluno.setRespostaPercaEquilibrio(selected4)
    parqDoAluno.setRespostaProblemaOsseo(selected5)
    parqDoAluno.setRespostaMedicamentoPressaoArterial(selected6)
    parqDoAluno.setRespostaUltimaPergunta(selected7)

    novoAluno.setParq(parqDoAluno)
    return (
        <SafeAreaView style={[style.container]}>
            <ScrollView alwaysBounceVertical={true}>
                <View style={[style.blocoTitulo, estilo.corLightMenos1]}>
                    <Text style={[estilo.tituloH240px, estilo.textoCorSecundaria, estilo.centralizado]}>PARQ & VOCÊ</Text>
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, style.Montserrat]}>
                        Questionário de Prontidão para Atividade Física (Revisado em 1994). 
                        Para pessoas com idade entre 15 e 69 anos
                    </Text>                    
                </View>

                <View style={[style.blocoTexto, estilo.corLightMais1]}>
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, style.textosPARQ , estilo.centralizado]}>
                        A atividade física regular é divertida e saudável e cada vez mais pessoas 
                        estão começando a se tornar mais ativas todos os dias. Ser ativo é muito seguro
                        para a maioria das pessoas. No entando, algumas pessoas devem consultar um médico
                        antes de começar a se tornar muito mais fisicamente ativo.
                    </Text>
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, style.textosPARQ , estilo.centralizado]}>
                        Se você está planejando tornar-se muito mais fisicamente ativo do que você é agora,
                        comece respondendo as sete perguntas do quadro abaixo. Se tiver entre 15 e 69 anos 
                        de idade, o PAR-Q informará se você deve consultar o seu médico antes de começar.
                        Se você tem mais de 69 anos de idade, e você não está acostumado a ser muito ativo,
                        consulte seu médico.
                    </Text>
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, style.textosPARQ, , estilo.centralizado]}>
                    O bom senso é seu melhor guia ao responder a estas perguntas. Por favor, leia as perguntas 
                    cuidadosamente e responda a cada uma honestamente marcando com SIM ou NÃO.
                    </Text>
                </View>

                <View style={[style.perguntas,estilo.corLightMenos1]}>
                    <View style={[style.areaPerguntas, estilo.centralizado]}>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, {marginBottom: 15}]}>
                        1. Seu médico já disse que você possui doença cardíaca e  recomendou 
                        atividades físicas apenas sob supervisão médica?
                        </Text>           
                        <RadioBotao
                        options={['Sim', 'Não']}
                        horizontal={true}
                        selected={selected1}
                        onChangeSelect={(opt, i) => { setSelected1(i)}}
                       >
                        </RadioBotao>
                        {selected1 == 0 ? parqDoAluno.setRespostaDoencaCardiaca('Sim') : parqDoAluno.setRespostaDoencaCardiaca('Não')}
                    </View>
                </View>

                <View style={[style.perguntas,estilo.corLightMenos1]}>
                    <View style={[style.areaPerguntas, estilo.centralizado]}>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, {marginBottom: 15}]}>
                        2. Você apresenta dor no peito ao realizar atividade física?
                        </Text>           
                        <RadioBotao
                        options={['Sim', 'Não']}
                        horizontal={true}
                        selected={selected2}
                        onChangeSelect={(opt, i) => { setSelected2(i)}}
                       >
                        </RadioBotao>
                        {selected2 == 0 ? parqDoAluno.setRespostaDorNoPeito('Sim') : parqDoAluno.setRespostaDorNoPeito('Não')}

                    </View>
                </View>

                <View style={[style.perguntas,estilo.corLightMenos1]}>
                    <View style={[style.areaPerguntas, estilo.centralizado]}>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, {marginBottom: 15}]}>
                        3. No último mês você sentiu dor no peito quando não estava praticando atividade física?
                        </Text>           
                        <RadioBotao
                        options={['Sim', 'Não']}
                        horizontal={true}
                        selected={selected3}
                        onChangeSelect={(opt, i) => { setSelected3(i)}}
                       >
                        </RadioBotao>
                        {selected3 == 0 ? parqDoAluno.setRespostaDorNoPeitoUltimoMes('Sim') : parqDoAluno.setRespostaDorNoPeitoUltimoMes('Não')}

                    </View>
                </View>

                <View style={[style.perguntas,estilo.corLightMenos1]}>
                    <View style={[style.areaPerguntas, estilo.centralizado]}>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, {marginBottom: 15}]}>
                        4. Você perde o equilíbrio em virtude de tonturas ou já perdeu a consciência alguma vez?
                        </Text>           
                        <RadioBotao
                        options={['Sim', 'Não']}
                        horizontal={true}
                        selected={selected4}
                        onChangeSelect={(opt, i) => { setSelected4(i)}}
                       >
                        </RadioBotao>
                        {selected4 == 0 ? parqDoAluno.setRespostaPercaEquilibrio('Sim') : parqDoAluno.setRespostaPercaEquilibrio('Não')}

                    </View>
                </View>

                <View style={[style.perguntas,estilo.corLightMenos1]}>
                    <View style={[style.areaPerguntas, estilo.centralizado]}>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, {marginBottom: 15}]}>
                        5. Você tem algum problema ósseo ou articular que poderia ser agravado por uma mudança em sua atividade?
                        </Text>           
                        <RadioBotao
                        options={['Sim', 'Não']}
                        horizontal={true}
                        selected={selected5}
                        onChangeSelect={(opt, i) => { setSelected5(i)}}
                       >
                        </RadioBotao>
                        {selected5 == 0 ? parqDoAluno.setRespostaProblemaOsseo('Sim') : parqDoAluno.setRespostaProblemaOsseo('Não')}

                    </View>
                </View>


                <View style={[style.perguntas,estilo.corLightMenos1]}>
                    <View style={[style.areaPerguntas, estilo.centralizado]}>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, {marginBottom: 15}]}>
                        6. Atualmente seu médico está prescrevendo medicamentos (ex. diuréticos) para sua pressão arterial ou doença cardíaca?
                        </Text>           
                        <RadioBotao
                        options={['Sim', 'Não']}
                        horizontal={true}
                        selected={selected6}
                        onChangeSelect={(opt, i) => { setSelected6(i)}}
                       >
                        </RadioBotao>
                        {selected6 == 0 ? parqDoAluno.setRespostaMedicamentoPressaoArterial('Sim') : parqDoAluno.setRespostaMedicamentoPressaoArterial('Não')}
                    </View>
                </View>

                <View style={[style.perguntas,estilo.corLightMenos1]}>
                    <View style={[style.areaPerguntas, estilo.centralizado]}>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, {marginBottom: 15}]}>
                        7. Você tem conhecimento de qualquer outra razão pela qual não deveria realizar atividade física?
                        </Text>           
                        <RadioBotao
                        options={['Sim', 'Não']}
                        horizontal={true}
                        selected={selected7}
                        onChangeSelect={(opt, i) => { setSelected7(i)}}
                       >
                        </RadioBotao>
                        {selected6 == 0 ? parqDoAluno.setRespostaUltimaPergunta('Sim') : parqDoAluno.setRespostaUltimaPergunta('Não')}

                    </View>
                </View>

                <View style={[style.blocoTexto, estilo.corLightMais1]}>
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, style.textosPARQ]}>
                    Se você respondeu <Text style={{fontWeight: 'bold'}}>"SIM"</Text> a <Text style={estilo.textoCorDanger}>uma ou mais perguntas</Text>                     
                    </Text>
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, style.textosPARQ , estilo.centralizado]}>
                    Converse com seu médico por telefone ou pessoalmente <Text style={{fontWeight: 'bold'}}>ANTES</Text> de começar a se tornar muito mais fisicamente ativo ou  <Text style={{fontWeight: 'bold'}}>ANTES</Text> de ter uma avaliação de aptidão. 
                    Informe o seu médico sobre o PAR-Q e quais as perguntas que você respondeu SIM.
                    </Text>

                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.Montserrat, style.textosPARQ , estilo.centralizado]}>
                    Você pode ser capaz de fazer qualquer atividade que você quer - desde que você comece devagar e acumular gradualmente. Ou, você pode precisar restringir suas atividades para aqueles que são seguros para você. Converse com seu médico 
                    sobre os tipos de atividades que você deseja participar e siga o seu conselho.
                    </Text>
                </View>

                <View style={[estilo.corLightMenos1, {paddingBottom: '10%'}]}>
                    <View style={[estilo.centralizado, style.blocoTexto]}>
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.textosPARQ,  style.Montserrat]}>
                    Se você respondeu “NÃO” para todas as perguntas
                    </Text>
                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.textosPARQ , estilo.centralizado, style.Montserrat]}>
                    Se você respondeu HONESTAMENTE a todas as perguntas do PAR-Q, esteja razoavelmente certo de que pode:
                    </Text>

                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.textosPARQ , estilo.centralizado,  style.Montserrat]}>
                    1. Aumentar o nível de atividade física - comece lentamente e progrida de forma gradual. Este é o caminho mais fácil e seguro.
                    </Text>

                    <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.textosPARQ , estilo.centralizado, style.Montserrat]}>
                    2. Participar de uma avaliação de condicionamento físico - esta é uma excelente maneira de determinar seu condicionamento básico para que você possa planejar a melhor maneira para ter uma vida fisicamente ativa.                    
                    </Text>

                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.textosPARQ , estilo.centralizado, style.Montserrat]}>
                        Espere um pouco antes de aumentar o nível de atividade física:
                        </Text>

                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.textosPARQ, style.Montserrat]}>
                        1. Se você não se sentir bem por causa de uma doença temporária, como um resfriado ou uma febre - espere até se sentir melhor; ou                    
                        </Text>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.textosPARQ,  style.Montserrat]}>
                        2.Se estiver grávida - fale com o seu médico antes de começar a ficar mais ativa.                    
                        </Text>

                        <Text style={[estilo.textoCorDanger, estilo.textoP16px, style.textosPARQ]}>ATENÇÃO</Text>
                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.textosPARQ , estilo.centralizado,  style.Montserrat]}>
                        Se a sua saúde for alterada de forma a responder SIM a qualquer uma das perguntas acima, informe o seu condicionador ou profissional de saúde. Pergunte se deve mudar seu plano de atividade física.
                        </Text>

                        <Text style={[estilo.textoSmall12px, estilo.textoCorSecundaria, style.textosPARQ , estilo.centralizado, style.Montserrat]}>
                        Uso informado do PAR-Q: A Canadian Society for Exercise Physiology, a Health Canade e seus agentes não assumem qualquer responsabilidade por pessoas que praticam atividade física e, em caso de dúvida após preencher este questionáro, consulte o seu médico antes da atividade física.                        </Text>
                    
                        <RadioBotao
                        options={[textoConfirma]}
                        horizontal={false}
                        selected={selected8}
                        onChangeSelect={(opt, i) => { setSelected8(i)}}
                       >
                        </RadioBotao>
                    </View>
                    <TouchableOpacity style={[estilo.botao, estilo.corPrimaria]} onPress={()=>{navigation.navigate('Anamnese'); console.log(parqDoAluno)}}>
                        <Text style={[estilo.textoCorLight, estilo.tituloH619px]}>RESPONDER PARQ</Text>
                    </TouchableOpacity>
                    <Text>
                    
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    blocoTitulo:{
        textAlign: 'center',
        padding: 25,
    },
    container: {
        width: '100%'
    },
    blocoTexto: {
        textAlign: 'left',
        width: '100%',
        padding: 10,
    },
    textosPARQ: {
        marginTop: 10
    },
    perguntas: {
        width: '100%',
        paddingVertical: 20
    },
    areaPerguntas: {
        width: '95%',
    },
    Montserrat: {
        fontFamily: 'Montserrat'
    }
})

export {parqDoAluno}