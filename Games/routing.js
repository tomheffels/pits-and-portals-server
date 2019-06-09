const Game = require('./model')
const Player = require('../Players/model')
const express = require('express')
const generateGame = require('../generateGame')

function routing (dispatch) {
  const router = express.Router()
  
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
  
  // Create game 
  router.post('/games', (request, response, next) => {
    const { userName } = request.body
    console.log('POST /games endpoint:', userName)
    const game = generateGame(userName)

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
            .then(() => 
              player
                .setGame(game)
                .then(() => game.addPlayer(player))
                .then(() => Game.findByPk(id, { 
                  include: [{ model: Player }]
                }))
                .then(game => {        
                  dispatch({
                    game,
                    gameLog: {
                      message: `${player.name} joined the game.`,
                      time: Date.now()
                    } 
                  })
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

  // Start Game
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
            dispatch({
              game,
              gameLog: {
                message: `${game.createdBy}'s game has started! ${game.players[game.currentPlayer].name} gets to roll the dice first.`,
                time: Date.now()
              }
            })}
          )
        console.log('after update: ', game.dataValues)
      })
      
      .catch(err => console.error(err))
  })

  // Roll: Roll dice, update position, check for pits/portals, check for winner
  router.put('/games/:id/roll', (request, response) => {
    // const rollDice = () => Math.ceil(Math.random() * 6)
    // const dice = rollDice()
    const {id} = request.params
    const {currentId, dice} = request.body
    console.log('REQ BODY', request.body)
    Game
      .findByPk(id, { 
        include: [{ model: Player }]
      })
      .then(game => {
        game
          .update({ dice: dice })
          .then(() => {
            dispatch({ game })
          })
          .then(
            Player
              .findByPk(currentId)
              .then(player => {
                console.log('original player.position test:', player.position)
                console.log('dice test:', dice)
                const rollPosition = player.position + dice
                console.log('rollPosition test:', rollPosition)
                const overFinish = rollPosition - 100
                const newPosition = rollPosition < 100 ? rollPosition : 100 - overFinish
                const positionLog = rollPosition < 100 
                  ? `${player.name} rolled ${dice} and moved to square ${rollPosition}.`
                  : `${player.name} rolled ${dice}, ${overFinish} steps over 100, they will go back to square ${newPosition}.`
                console.log('positionLog: ', positionLog)
                player
                  .update({ position: newPosition})
                  .then(() => dispatch({ 
                      game,
                      gameLog: {
                        message: positionLog,
                        time: Date.now()
                      }
                  }))
                  .then(() => {
                    console.log('player.position test:', player.position)
                    const pitCheck = game.pits.filter(pit => pit[0] === player.position)
                    const portalCheck = game.portals.filter(portal => portal[0] === player.position)
                    if (pitCheck.length > 0) {
                      const pitOut = pitCheck[0][1]
                      console.log('pitOut test:', pitOut)
                      return player
                        .update({
                          position: pitOut,
                        })
                        .then(() => {
                          dispatch({
                            game,
                            user: player,
                            gameLog: {
                              message: `Oh no! ${player.name} fell down a pit and came out on square ${pitOut}.`,
                              time: Date.now()
                            }
                          })
                        })
                    } else if (portalCheck.length > 0) {
                      const portalOut = portalCheck[0][1]
                      console.log('portalOut test:', portalOut)
                      return player
                        .update({ position: portalOut })
                        .then(() => {
                          dispatch({
                            game,
                            user: player,
                            gameLog: {
                              message: `Heck yeah! ${player.name} was beamed up through a portal and came out on square ${portalOut}.`,
                              time: Date.now()
                            }
                          })
                        })
                    }
                  })
                  .then(() => {
                    const {currentPlayer} = game
                    console.log('currentPlayer: ', currentPlayer)
                    if (player.position === 100) { 
                      game
                        .update({
                          gameEnd: true,
                          winner: player
                        })
                        .then(() => {
                          dispatch({
                            game,
                            gameLog: {
                              message: `${player.name} won the game! To play again go back to the lobby and create a new game.`,
                              time: Date.now()
                            }
                          })
                        })
                      console.log(`GAME OVER! ${game.winner.toUpperCase()} WINS!`)
                      return
                    } 
                  })
                  .then(() => {
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
                          .update({currentPlayer: (game.currentPlayer === 0 ? 1 : 0 )})
                          .then(() => {
                            dispatch({ 
                              game,
                              gameLog: {
                                message: `Now it's ${game.players[game.currentPlayer].name}'s turn, roll the dice!`,
                                time: Date.now()
                              } 
                            })
                            response.send(game)
                          })
                      })
                  })

              })
                
          )
            
      
      })
      .catch(err => console.error(err))
  })
  
  return router
}

module.exports = routing