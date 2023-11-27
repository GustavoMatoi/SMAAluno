class Notificacoes{
    constructor(_titulo, _data, _texto, _remetente){
        this.titulo = _titulo;
        this.data = _data
        this.texto = _texto 
        this.remetente = _remetente
    }

    getTitulo = () => {return this.titulo}
    setTitulo = (titulo) => {this.titulo = titulo}

    getData = () => {return this.data}
    setData = (data) => { this.data = data}

    getTexto = () => {return this.texto}
    setTexto = (texto) => {this.texto = texto}

    getRemetente = () => {return this.remetente}
    setRemetente = (remetente) => {this.remetente = remetente}
}

export {Notificacoes}