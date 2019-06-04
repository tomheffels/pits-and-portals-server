const socketIo = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')

app
  .use(cors)
  .use(bodyParser)

function dispatchBoard () {
const action = {
  type: 'board',
  pits, 
  portals
}
io.emit('action', action)
}

app.put('/game/:id', (req, res, next) => 
Game
.findByPk(req.params.id)
)