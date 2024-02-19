import { Pessoa } from "./Pessoa"

class Aluno extends Pessoa {
    constructor (nome, academia, endereco, cpf, diaNascimento, mesNascimento, anoNascimento, telefone, sexo, email, senha, tipoSanguineo, profissao){
        super(nome, academia ,endereco, cpf, diaNascimento, mesNascimento, anoNascimento, telefone, sexo, email, senha)
        this.tipoSanguineo = tipoSanguineo
        this.profissao = profissao
        this.diarios = []
        this.fichaDeExercicios =[]
        this.parq = null
        this.anamnese = null
        this.fichaDeExercicios = []
        this.avaliacoes = []
        this.professor = null
    }
    setAnamnese = (anamnese) => {this.anamnese = anamnese}
    getAnamnese = () => {return this.anamnese}

    setTipoSanguineo = (tipoSanguineo) => this.tipoSanguineo = tipoSanguineo



    getTipoSanguineo = () => {return this.tipoSanguineo}

    getTurma = () => {return this.turma}
    setTurma = (turma) => this.turma = turma
    setProfissao = (profissao) => this.profissao = profissao

    getInativo = () => {return this.inativo}
    setInativo = (inativo) => {this.inativo = inativo}
    getProfissao = () => {return this.profissao} 

    setParq = (parq) => { this.parq = parq}

    getParq = () => {return this.parq}

    addFichaDeExercicios = (fichaDeExercicios) => {this.fichaDeExercicios.push(fichaDeExercicios)}
    getFichaDeExercicios = () => {return this.fichaDeExercicios}

    addDiarios = (diario) => {this.diarios.push(diario)}
    getDiarios = () => {return this.diarios}


    addAvaliacoes = (avaliacao) => {this.avaliacoes.push(avaliacao)}
    getAvaliacoes = () => {return this.avaliacoes}

    setProfessor = (professor) => {this.professor = professor}
    getProfessor = () => {return this.professor}
}

export {Aluno}