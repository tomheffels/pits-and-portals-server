const { Router } = require('express')
const router = new Router()
const { toJWT, toData } = require('./jwt')
const Player = require('../Players/model')


router.post('/login', (req, res, next) => {
  const { name, password } = req.body
  if (!name|| !password) {
    res.status(400).send({
      message: 'Please supply a valid username and password'
    })
  } else{
     Player
  .findOne({
    where: {
      name: req.body.name
    }
  })
  .then(player => {
    if (!player) {
      res.status(400).send({
        message: 'Player with that username does not exist'
      })
    }
    if (req.body.password === Player.password){

      res.send({
        jwt: toJWT({ playerId: Player.id })
      })
    }
    else {
      res.status(400).send({
        message: 'Password was incorrect'
      })
    }
  })
  .catch(err => {
    console.error(err)
    res.status(500).send({
      message: 'Something went wrong'
    })
  })
}})

 

module.exports = router