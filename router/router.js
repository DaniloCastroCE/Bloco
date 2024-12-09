const express = require('express')
const router = express.Router()
const path = require('path')
const {routerTest, getInit, getCadastro, logout, bloco, getUser} = require('../controllers/getRouterControl')
const {postCadastrar, postLogin} = require('../controllers/postRouterControl')
const {putAtualizarScript, putAtualizarConfig} = require('../controllers/putRouter.Control')

const checkAutenticacao = (req, res, next) => {
    if (req.session.userId) {
        return next()
      }
      res.render('init', {mensagem: ['É necessário se logar para acessar o bloco']})
}

router.get('/test', routerTest)
router.get('/', getInit)
router.get('/cadastro', getCadastro)
router.get('/logout', logout)
router.get('/bloco', checkAutenticacao, bloco)
router.get('/getUser', checkAutenticacao, getUser)

router.post('/cadastro', postCadastrar)
router.post('/login', postLogin)

router.put('/attScripts', checkAutenticacao, putAtualizarScript)
router.put('/attConfig', putAtualizarConfig)


module.exports = router