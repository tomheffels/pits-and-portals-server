const express = require('express')
const bodyParser = require('body-parser')
const boardRouter = require('./Board/routes')
const socketIo = require('socket.io')



const app = express()

const port = process.env.PORT || 4000
const io = socketIo.listen(port)
app
.use(bodyParser.json())
.use(boardRouter)
.listen(port, () => console.log(`Listening on port ${port}`))

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