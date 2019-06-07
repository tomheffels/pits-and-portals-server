const Game = require('./model')
const Player = require('../Players/model')
const express = require('express')
const generateGame = require('../generateGame')

function routing (dispatch) {
  const router = express.Router()

  router.put('/games/:id/start', (request, response, next) => {
    const {id} = request.params
    Game
      .findByPk(id, { 
        include: [{ model: Player }]
      })
      .then(game => {
        console.log('before update: ', game.dataValues)
        game
          .update({
          gameStart: true,
          currentPlayer: Math.floor(Math.random() * 2)
          })
          .then(game => {
            console.log(game)
            dispatch({ game })}
          )
        console.log('after update: ', game.dataValues)
      })
      
      .catch(err => console.error(err))
  })


  // Roll: Roll dice, update position, check for pits/portals, check for winner
  router.put('/games/:id/roll', (request, response) => {
    const rollDice = () => Math.ceil(Math.random() * 6)
    const dice = rollDice()
    const {id} = request.params
    const {currentId} = request.body
    console.log('REQ BODY', request.body)
    Game
      .findByPk(id, { 
        include: [{ model: Player }]
      })
      .then(game => {
        game
          .update({
            dice: dice
          })
          .then(game => dispatch({ game }))
          .then(
            Player
              .findByPk(currentId)
              .then(player => {
                console.log('original player.position test:', player.position)
                console.log('dice test:', dice)
                const rollPosition = player.position + dice
                console.log('rollPosition test:', rollPosition)
                return player
                  .update({
                    position: rollPosition
                  })
                  .then((player) => {
                    console.log('player.position test:', player.position)
                    const pitCheck = game.pits.filter(pit => pit[0] === player.position)
                    const portalCheck = game.portals.filter(portal => portal[0] === player.position)
                    if (pitCheck.length > 0) {
                      const pitOut = pitCheck[0][1]

                      console.log('pitOut test:', pitOut)
                      return player.update({position: pitOut})
                    } else if (portalCheck.length > 0) {
                      const portalOut = portalCheck[0][1]
                      console.log('portalOut test:', portalOut)
                      return player.update({position: portalOut})
                    }
                  })
                  .then(() => {
                    const {currentPlayer} = game
                    console.log('currentPlayer: ', currentPlayer)
                    if (player.position === 100) { 
                      game.update({
                        gameEnd: true,
                        winner: player.userName
                      })
                      console.log(`GAME OVER! ${game.winner.toUpperCase()} WINS!`)
                      return
                    } else if (player.position > 100) {
                      player.update({
                        position: 100 - (player.position - 100)
                      })
                    }
                  })
                  .then(player => {
                    console.log('dispatching player test:', player)
                    dispatch({
                      user: player
                    })
                  })
                  .then(() => {
                    Game
                      .findByPk(id, { 
                        include: [{ model: Player }]
                      })
                      .then(game => {
                        game
                          .update({currentPlayer: (game.currentPlayer === game.players.length -1 ? 0 : game.currentPlayer + 1)})
                          .then(game => {
                            dispatch({ game })
                            response.send(game)
                          })
                      })
                  })
              })
              
          )
      })
      .catch(err => console.error(err))
  })
  //   const {currentPlayer} = game
  //   const roll = rollDice()
  //   console.log(`${currentPlayer} ROLLED ${roll}`)
  //   game.players[currentPlayer].position = game.players[currentPlayer].position + roll

  //   checkPortals()
  //   checkWinner()
    
  //   currentPlayer === game.players.length - 1
  //     ? game.currentPlayer = 0
  //     : game.currentPlayer++

  //   dispatch({ game: game, roll: roll })
    
  //   response.status(201).send('rolled!')
  // })

  // router.post('/login', (request, response) => {
  //   console.log('login')
  //   response.status(201).send('logging in')
  //   dispatch({board: {}})
  // })

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

  //Create game 
  router.post('/games', (request, response, next) => {
    const { userId } = request.body
    console.log('POST /games endpoint:', userId)
    const game = generateGame()

    Game
      .create(game)
      .then(() => Game.findAll({ 
        include: [{ model: Player }]
      }))
      .then(games => {        
        console.log('games test:', games)
        dispatch({ games })
        response.status(201).send(games)
      })
      .catch(err=> next(err))
  })

  // Join game
  router.put('/games/:id/join', (request, response, next) => {
    const { userId } = request.body
    const {id} = request.params
    Game
      .findByPk(id)
      .then(game => {
        Player
          .findByPk(userId)
          .then(player => {
            player
            .update({ position: 1 })
            .then(player => player
              .setGame(game)
              .then(() => game.addPlayer(player))
              .then(() => Game.findByPk(id, { 
                include: [{ model: Player }]
              }))
              .then(game => {        
                dispatch({ game })
                response.status(201).send(game)
              })
              .then(() => Game.findAll({ 
                include: [{ model: Player }]
              }))
              .then(games => {        
                console.log('games test:', games)
                dispatch({ games })
                response.status(201).send(games)
              }))
          })
      })
  })

  // Get game status
  router.get('/games/:id', (request, response) => {
    const {id} = request.params
    Game
      .findByPk(id, {include: [{ model: Player }]})
      .then(game => {
        console.log('get game info', game)
        dispatch({game})
        response.status(201).send(game)
      })
      .catch(err => console.error(err))
  })

  return router
}

module.exports = routing