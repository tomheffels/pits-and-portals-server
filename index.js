const express = require('express')
const bodyParser = require('body-parser')
const boardRouter = require('./Board/routes')
const socketIo = require('socket.io')


const app = express()
const port = 4000
const server = app.listen(port, () => console.log(`listening on port ${port}...`))
const io = socketIo.listen(server)

app
.use(bodyParser.json())
.use(boardRouter)

io.on(
  'connection',
  client => {
    console.log('client.id test:', client.id)

    client.on(
      'disconnect',
      () => console.log('disconnect test:', client.id)
    )
  }
)