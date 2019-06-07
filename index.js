const express = require('express')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const cors = require('cors')
let {game, games, board, newGame} = require('./data')
const playersRouter = require('./Players/routes')
const gamesRouting = require('./Games/routing')


const app = express()
const port = 4000
const server = app.listen(port, () => console.log(`listening on port ${port}...`))
const io = socketIo.listen(server)

app
.use(cors())
.use(bodyParser.json())
.use(playersRouter)


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

const router = gamesRouting(dispatch)
app.use(router)

io.on(
  'connection',
  client => {
    console.log('client logged on:', client.id)
    // const user = {
    //   id: null,
    //   userName: null,
    //   clientId: client.id,
    //   position: 1,
    //   active: false,
    //   avatar: ''
    // }
    // client.emit('action', {
    //   type: 'UPDATE_GAME',
    //   payload: {
    //     user: user
    //   }
    // })

    // dispatch({ board: [], roll: rollDice() })

    client.on(
      'disconnect',
      () => console.log('disconnect test:', client.id)
    )
  }
)