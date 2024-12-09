const User = require('../model/user')

const putAtualizarScript = async (req, res) => {
    const { email, valor} = req.body
    let modifica

    modifica = {
        $set: {
            config: { scripts: valor }
        }
    }


    await User.updateOne({ email: email }, modifica);

}

const putAtualizarConfig = async (req, res) => {
    const {email, valor} = req.body

    await User.updateOne({email:email,}, {$set: {config: valor}})
}


module.exports = {
    putAtualizarScript,
    putAtualizarConfig
}