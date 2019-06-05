const express = require('express')
const bodyParser = require('body-parser')
const boardRouter = require('./Board/routes')
const socketIo = require('socket.io')
const generateGame = require('./Game-board/dispatcher')

const app = express()
const port = 4000
const server = app.listen(port, () => console.log(`listening on port ${port}...`))
const io = socketIo.listen(server)

let game = {
  players: [
    {
      userName: 'Player1',
      clientId: 'kfjvncwijn76s8c6dfc',
      position: 1,
      active: true,
      avatar: 'http://avatars.adorable.io/avatars/200/Player1'
    },
    {
      userName: 'Player2',
      clientId: 'whfbkajfbek6574dacs',
      position: 1,
      active: true,
      avatar: 'http://avatars.adorable.io/avatars/200/Player2'
    },
    {
      userName: 'Player3',
      clientId: 'fwjhcvk765a64547acc',
      position: 1,
      active: true,
      avatar: 'http://avatars.adorable.io/avatars/200/Player3'
    },
    {
      userName: 'Player4',
      clientId: 'sfcjzgabdf7865867zsc',
      position: 1,
      active: true,
      avatar: 'http://avatars.adorable.io/avatars/200/Player4'
    },
  ],
  status: {
    gameStart: false,
    gameEnd: false,
    currentPlayer: 1
  }
}

let board = {
    pits: [],
    portals: [],
}

const rollDice = () => Math.ceil(Math.random() * 6)

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

  router.post('/roll', (request, response) => {
    console.log('rolling dice!')
    
    dispatch({ board: [], roll: rollDice() })
    
    response.status(201).send('rolled!')
  })

  router.post('./login', (request, response) => {
    console.log('login')
    response.status(201).send('logging in')
    dispatch({board: {}})
  })
// Start Game: Generate board, send players, change game status
  router.post('/game', (request, response) => {
    console.log('hello')
    board = generateGame()
    game.status.gameStart = true
    game.status.currentPlayer = Math.floor(Math.random() * game.players.length)
    response.status(201).send(board)
    dispatch({ board: board, game: game })
  })

  return router
}

const gameRouter = routing(dispatch, game)

app
.use(bodyParser.json())
.use(boardRouter)
.use(gameRouter)

io.on(
  'connection',
  client => {
    console.log('client.id test:', client.id)

    dispatch({ board: [], roll: rollDice() })

    client.on(
      'disconnect',
      () => console.log('disconnect test:', client.id)
    )
  }
)