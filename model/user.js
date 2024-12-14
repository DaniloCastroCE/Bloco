const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Script = new mongoose.Schema({
    key: {
        type: String,
    },
    script: {
        type: String,
    }
})

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: true,
        trim: true
    },
    config: {
        type: Object,
        scripts: {
            type: [Script],
            defeult: []
        },
        grupos: {
            type: [String],
            default: [],
        }
    }

}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified("senha")) {
        return next();
    }
    this.senha = await bcrypt.hash(this.senha, 10)
    next();
});

userSchema.methods.checkSenha = async function (senha) {
    return await bcrypt.compare(senha, this.senha)
}

module.exports = mongoose.model('usuario', userSchema)