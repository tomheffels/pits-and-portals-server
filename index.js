const express = require('express')
const bodyParser = require('body-parser')
const boardRouter = require('./Board/routes')
const socketIo = require('socket.io')



const app = express()

const server = app.listen(4000)
const io = socketIo.listen(server)

app
.use(bodyParser.json())
.use(boardRouter)


io.on(
  'connection',
  client => {
    console.log('client.id test:', client.id)

    dispatch(messages)

    client.on(
      'disconnect',
      () => console.log('disconnect test:', client.id)
    )
  }
)