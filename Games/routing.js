const Game = require('./model')
const Player = require('../Players/model')
const express = require('express')
const generateGame = require('../generateGame')

function routing (dispatch) {
  const router = express.Router()

  // Roll: Roll dice, update position, check for pits/portals, check for winner
  router.post('/games/:id/roll', (request, response) => {
    const {currentPlayer} = game
    const roll = rollDice()
    console.log(`${currentPlayer} ROLLED ${roll}`)
    game.players[currentPlayer].position = game.players[currentPlayer].position + roll

    checkPortals()
    checkWinner()
    
    currentPlayer === game.players.length - 1
      ? game.currentPlayer = 0
      : game.currentPlayer++

    dispatch({ game: game, roll: roll })
    
    response.status(201).send('rolled!')
  })

  router.post('/login', (request, response) => {
    console.log('login')
    response.status(201).send('logging in')
    dispatch({board: {}})
  })

  // Update Lobby: Get games, Create new game
  router.get('/games', (request, response) => {
    console.log('GET /games endpoint')
    Game
      .findAll()
      .then(games => {
        dispatch({ games })
        response.status(200).send(games)
      })
  })

  router.post('/games', (request, response, next) => {
    const { userId } = request.body
    console.log('POST /games endpoint:', userId)
    const game = generateGame()

    Game
      .create(game)
      .then(game => {
        Player
          .findByPk(userId)
          .then(player => {
            player
              .setGame(game)
              .then(() => game.addPlayer(player))
              .then(() => Game.findAll({ 
                include: [{ model: Player }]
              }))
              .then(games => {        
                console.log('games test:', games)
                dispatch({ games })
                response.status(201).send(games)
              })
          })
      })
      .catch(err=> next(err))
  })

  // Get game status
  router.get('/games/:id', (request, response) => {
    const {id} = request.params
    console.log('get game with id :', id)
    game = games[id-1]
    console.log(games)
    response.status(200).send(game)
    dispatch({game: game})
  })

  return router
}

module.exports = routing