const User = require('../model/user')
const validator = require('validator')

const postLogin = async (req, res) => {
    const { email, senha } = req.body
    let checkUsuario = []
    try {
        const usuario = await User.findOne({ email })
        if (usuario) {
            if (await usuario.checkSenha(senha)) {
                req.session.userId = usuario._id
                req.session.username = usuario.nome
                res.redirect('/bloco')
            } else {
                checkUsuario.push('Senha invalida')
                res.render('init', { mensagem: checkUsuario })
            }
        } else {
            checkUsuario.push(`Email "${email}" inexistente`)
            res.render('init', { mensagem: checkUsuario })
        }

    } catch (err) {
        console.error(err)
    }
}

const postCadastrar = async (req, res) => {
    const { nome, email, senha } = req.body

    try {

        let checkUsuario = []

        if (nome.length < 4) {
            checkUsuario.push(`O nome "${nome}" tem menos de 4 caracteres`)
        }
        if(nome.length > 40) {
            checkUsuario.push(`O nome "${nome}" tem ${nome.length} caracteres, o maximo é 40`)
        }

        if (senha.length < 4) {
            checkUsuario.push(`A senha tem menos de 4 caracteres`)
        }

        if (!validator.isEmail(email)) {
            checkUsuario.push(`Email "${email}" invalido`)
        } else {
            if (await User.findOne({ email }) !== null) {
                checkUsuario.push(`Email "${email}" em uso`)
            }
        }

        if (checkUsuario.length === 0) {
            const novoUsuario = new User(
                {
                    nome: nome.toLowerCase(),
                    email: email.toLowerCase(),
                    senha: senha,
                    config: {
                        scripts: []
                    }
                })
            await novoUsuario.save()
            res.render('init', { mensagem: [`Úsuario "${nome}" foi cadastrado com sucesso`] })

        } else {
            res.render('cadastro', { mensagem: checkUsuario })
        }

    } catch (err) {
        console.error('Errou ao cadastrar usuario\nError: ', err)
    }
}

module.exports = {
    postCadastrar,
    postLogin
}