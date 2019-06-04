


function dispatchBoard () {
const action = {
  type: 'board',
  payload: board
}
io.emit('action', action)
}

app.put('/game/:id', (req, res, next) => 
Game
.findByPk(req.params.id)
)