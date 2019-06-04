


function dispatchBoard () {
const action = {
  type: 'board',
  payload: board
}
io.emit('action', action)
}

app.put('/game/:id', (req, res, next) => {
const {board} = req.body
Game
.findByPk(req.params.id)
)