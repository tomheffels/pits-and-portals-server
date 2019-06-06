const { Router } = require('express')
const router = new Router()
const Player = require('./model')

router.post('/players', (req, res, next) => {
  const player = {
    name: req.body.name,
    password:req.body.password
  }
  Player
  .create(req.body)
  .then(player => {
    if(!player) {
      return res.status(404).send({
        message: `Player cannot be created`
   })
  }
  return res.status(201).send(player)
})
.catch(error => next(error))
})

module.exports = router