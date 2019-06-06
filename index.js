const express = require('express')
const bodyParser = require('body-parser')
const boardRouter = require('./Board/routes')
const socketIo = require('socket.io')
const generateGame = require('./Game-board/dispatcher')
const cors = require('cors')
let {game, games, board, newGame} = require('./data')

const app = express()
const port = 4000
const server = app.listen(port, () => console.log(`listening on port ${port}...`))
const io = socketIo.listen(server)


const rollDice = () => Math.ceil(Math.random() * 6)

const checkPortals = () => {
  const {currentPlayer} = game
  const {pits, portals} = board
  const pitCheck = pits.filter(pit => pit[0] === game.players[currentPlayer].position)
  const portalCheck = portals.filter(portal => portal[0] === game.players[currentPlayer].position)
  console.log('PIT CHECK: ', pitCheck.length > 0 ? 'PIT!' : 'nope')
  console.log('PORTAL CHECK: ', portalCheck.length > 0 ? 'PORTAL!' : 'nope')
  if (pitCheck.length > 0) {
    game.players[currentPlayer].position = pitCheck[0][1]
  } else if (portalCheck.length > 0) {
    game.players[currentPlayer].position = portalCheck[0][1]
  }
}

const checkWinner = () => {
  const {currentPlayer} = game
  const {position} = game.players[currentPlayer]
  if (position === 100) {
    game.gameEnd = true
    game.winner = game.players[currentPlayer].userName
    console.log(`GAME OVER! ${game.winner.toUpperCase()} WINS!`)
    return
  } else if (position > 100) {
    game.players[currentPlayer].position = 100 - (position - 100)
  }
}

function dispatcher (io) {
  return function dispatch (payload) {
    const action = {
      type: 'UPDATE_GAME',
      payload
    }

    io.emit('action', action)
  }
}

const dispatch = dispatcher(io)
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
    currentPlayer === game.players.length - 1? game.currentPlayer = 0 : game.currentPlayer++
    dispatch({ game: game, roll: roll })
    
    response.status(201).send('rolled!')
  })

  router.post('/login', (request, response) => {
    console.log('login')
    response.status(201).send('logging in')
    dispatch({board: {}})
  })
// Start Game: Generate board, send players, change game status
  // router.post('/game', (request, response) => {
  //   console.log("POST '/game' endpoint")
  //   // board = generateGame()
  //   game.gameStart = true
  //   game.currentPlayer = Math.floor(Math.random() * game.players.length)
  //   response.status(201).send(board)
  //   dispatch({ board: board, game: game })
  // })

// Update Lobby: Get games, Create new game
  router.get('/games', (request, response) => {
    console.log('GET /games endpoint')
    dispatch({games: games})
    response.status(200).send(games)
  })

  router.post('/games', (request, response) => {
    console.log('POST /games endpoint')
    let newGame = { 
      id: 0,
      gameStart: false,
      currentPlayer: null,
      gameEnd: false,
      winner: null,
      players: [],
      board: {
        pits: [],
        portals: []
      }
    }
    newGame.board = generateGame()
    newGame.id = games.length + 1
    games.push(newGame)
    console.log(games)
    response.status(201).send(newGame)
    dispatch({games: games})
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

const gameRouter = routing(dispatch, game)

app
.use(cors())
.use(bodyParser.json())
.use(boardRouter)
.use(gameRouter)

io.on(
  'connection',
  client => {
    console.log('client logged on:', client.id)
    const user = {
      id: null,
      userName: null,
      clientId: client.id,
      position: 1,
      active: false,
      avatar: ''
    }
    client.emit('action', {
      type: 'UPDATE_GAME',
      payload: {
        user: user
      }
    })

    // dispatch({ board: [], roll: rollDice() })

    client.on(
      'disconnect',
      () => console.log('disconnect test:', client.id)
    )
  }
)