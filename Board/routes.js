const { Router } = require('express')
const Board = require('./model')

const router = new Router()

router.get('/games', (req, res, next) => {
  Board
  .findAll()
  .then(board => {
    res.json({ board:board })
  })
})

module.exports = router