const path = require('path')
const User = require('../model/user')

const routerTest = (req, res) => {
    const data = {
        msg: 'Isto é apanes um teste'
    }
    res.render('test', data)
}

const getInit = (req, res) => {
    res.render('init', { mensagem: null })
}

const getCadastro = (req, res) => {
    res.render('cadastro', { mensagem: null })
}

const logout = (req, res) => {
    const nome = req.session.username
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erro ao fazer logout.")
        }
        if (nome !== undefined) {
            res.render('init', { mensagem: [`Usuario ${nome} deslogado`] })
        } else {
            res.render('init', { mensagem: null })
        }
    })
}

const bloco = (req, res) => {
    res.sendFile(path.join(__dirname, '../src/views', 'bloco.html'))
}

const getUser = async (req, res) => {
    const id = req.session.userId
    try {
        const { nome, email, config } = await User.findOne({ _id: id })
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Fortaleza',
            dateStyle: 'full',
            timeStyle: 'medium', 
        }).format(now);
        await User.updateOne({ email: email }, { $set: { ultAcesso: {data: formattedDate, ip: clientIp} } })
        res.json({ nome: nome, email: email, ultAcesso: {data: formattedDate, ip: clientIp}, config: config })
    } catch (err) {
        res.json({ error: err })
    }

}

module.exports = {
    routerTest,
    getInit,
    getCadastro,
    logout,
    bloco,
    getUser
}
