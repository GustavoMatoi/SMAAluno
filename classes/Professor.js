import {Pessoa} from './Pessoa'
class Professor  extends Pessoa{
    constructor(nome, cpf, dataNascimento, telefone, sexo, email, senha){
    super(nome, cpf, dataNascimento, telefone, sexo, email, senha)
    this.alunos = []
    }

    addAluno = (aluno) => {
        this.alunos.push(aluno)
    }
}
export {Professor}