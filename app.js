require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const router = require('./router/router')
const conectarDB = require('./config/db')
const session = require("express-session");
const MongoStore = require("connect-mongo");
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './src/views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.URI}),
      cookie: { maxAge: 1000 * 60 * 60 * 12 },
    })
  )
app.use("/", router)

conectarDB(process.env.URI).then( () => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log('Servidor ONLINE na porta: ', PORT)
    });
} ).catch( (err) => {
    console.error('Banco não conectou')
} )
