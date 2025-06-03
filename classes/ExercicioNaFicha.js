class ExercicioNaFicha {
    constructor(exercicio, fichaDeExercicios, conjugado){
        this.exercicio = exercicio 
        this.fichaDeExercicios = fichaDeExercicios
        this.repeticoes = null
        this.series = null 
        this.descanso = null
        this.velocidade = null
        this.duracao = null
        this.conjugado = false
        this.intensidade = null 
        this.imagem = null
        this.intensidadeDoRepouso = null
        this.peso = null
        this.cadencia = null
        this.observacao = null
    }

    setExercicio = (exercicio) => {this.exercicio = exercicio}
    getExercicio = () => {return this.exercicio}

    setCadencia = (cadencia) => {this.cadencia = cadencia}
    getCadencia = () => {return this.cadencia}
    setFichaDeExercicio = (fichaDeExercicio) => {this.fichaDeExercicio = fichaDeExercicio}
    getFichaDeExercicios = () => {return this.fichaDeExercicio}

    setRepeticoes = (repeticoes) => {this.repeticoes = repeticoes}
    getRepeticoes = () => {return this.repeticoes}

    setSeries = (series) => {this.series = series}
    getSeries = () => {return this.series}

    setDescanso = (descanso) => {this.descanso = descanso}
    getDescanso = ()=> { return this.descanso}

    setVelocidade = (velocidade) => {this.velocidade = velocidade}
    getVelocidade = () => {return this.velocidade}

    setDuracao = (duracao) => {this.duracao = duracao}
    getDuracao = () => {return this.duracao}

    setConjugado = (exercicioConjugado) => {this.conjugado = exercicioConjugado}
    getConjugado = () => {return this.conjugado}

    setObservacao = (observacao) => {this.observacao = observacao}
    getObservacao = () => {return this.observacao}

    setIntensidade = (intensidade) => {this.intensidade = intensidade}
    getIntensidade = () => {return this.intensidade}

    setIntensidadeDoRepouso = (intensidadeDoRepouso) => {this.intensidadeDoRepouso = intensidadeDoRepouso}
    getIntensidadeDoRepouso = () => {return this.intensidadeDoRepouso}

    setImagem = (imagem) => {this.imagem = imagem}
    getImagem = () => {return this.imagem}
    setPeso = (peso) => {this.peso = peso}
    getPeso = () => {return this.peso}
}


export {ExercicioNaFicha}