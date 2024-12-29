const path = require('path')
const User = require('../model/user')

const routerTest = (req, res)  => {
    const data = {
        msg: 'Isto é apanes um teste'
    }
    res.render('test', data)
}

const getInit = (req,res) => {
    res.render('init', {mensagem: null})
}

const getCadastro = (req, res) => {
    res.render('cadastro', {mensagem: null})
}

const logout = (req, res) => {
    const nome = req.session.username
    req.session.destroy((err) => {
        if (err) {
          return res.status(500).send("Erro ao fazer logout.")
        }
        if(nome !== undefined){
            res.render('init', {mensagem: [`Usuario ${nome} deslogado`]})
        }else {
            res.render('init', {mensagem: null})
        }
      })
}

const bloco = (req, res) => {
    res.sendFile(path.join(__dirname, '../src/views', 'bloco.html'))
}

const getUser = async (req, res) => {
    const id = req.session.userId
    try{
        const {nome, email, config} = await User.findOne({_id: id})

        try {
            /*const data = new Date()
            const formato = new Intl.DateTimeFormat('pt-BR', {
              timeZone: 'UTC', 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit'
            });*/
            const ultAcesso = "teste"
            await User.updateOne({email:email}, {$set: {ultAcesso: ultAcesso}})
        }catch (err){
            console.error(err)
        }
        
        res.json({nome: nome, email: email, config: config})
    }catch(err) {
        res.json({error: err})
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
