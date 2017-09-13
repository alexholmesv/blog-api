const crypto = require('crypto')
const express = require('express')
const bodyParser = require('body-parser')
const Users = require('./users.model')
const app = express()
var mongoose = require('mongoose');
mongoose.connect('mongodb://alexholmesv:seph01web@ds133964.mlab.com:33964/blog-api');

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


app.post('/registro', function(req, res) {
  const {email, password} = req.body
  crypto.randomBytes(16, (err, salt) => {
    const newSalt = salt.toString('base64')
    crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (err, key)=> {
      const encryptedPassword = key.toString('base64')
      Users.findOne({email}).exec()
        .then(user => {
          if(user) return res.send('Usuario ya existe')
          Users.create({
            email,
            password: encryptedPassword,
            salt: newSalt,
          }).then(()=> {
            res.send('Usuario creado con éxito')
          })
        })
    })
  })
  
})

app.post('/login', function (req, res) {
  const { email, password } = req.body
  Users.findOne({email}).exec()
    .then( user => {
      if(!user) return res.send('usuario no existe')
      crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (err, key) => {
        const encryptedPassword = key.toString('base64')
        if(user.password === encryptedPassword) {
          return res.send('bingo!')
        }
        res.send('oops!')
      })
    })
})

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})