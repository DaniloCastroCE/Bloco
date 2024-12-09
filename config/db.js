const mongoose = require('mongoose')

const conectarDB = async (URI) => {
    try {
        await mongoose.connect(URI)
        console.log('DB conectando com sucesso')
    } catch (error) {
        console.error('DB não foi conectado\nError: ', error)
        throw error
    }
}

module.exports = conectarDB