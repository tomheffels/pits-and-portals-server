const Sequelize = require('sequelize')
const sequelize = require('../db')

const Game = sequelize.define ('games', {
  gameStart: {
    type: Sequelize.BOOLEAN
  },
  gameEnd : {
    type: Sequelize.BOOLEAN
  },
  winner: {
    type: Sequelize.STRING
  },
  currentPlayer: {
    type: Sequelize.INTEGER,
    field: 'current_player'
  },
  dice: {
    type: Sequelize.INTEGER,
  },
  pits: {
    type: Sequelize.JSON,
  },
  portals: {
    type: Sequelize.JSON
  }
},
{
  timestamps: false,
  tableName: 'games'
})

module.exports = Game 