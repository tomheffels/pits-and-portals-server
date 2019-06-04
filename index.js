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
  players: {
    player1: {
      userName: null,
      clientId: null,
      position: 1,
      active: false,
      avatar: ''
    },
    player2: {
      userName: null,
      clientId: null,
      position: 1,
      active: false,
      avatar: ''
    },
    player3: {
      userName: null,
      clientId: null,
      position: 1,
      active: false,
      avatar: ''
    },
    player4: {
      userName: null,
      clientId: null,
      position: 1,
      active: false,
      avatar: ''
    },
  },
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

  router.post('/game', (request, response) => {
    console.log('hello')
    board = generateGame()
    console.log(board)
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