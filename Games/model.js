const Sequelize = require('sequelize')
const sequelize = require('../db')

const Game = sequelize.define ('games', {
  createdBy: {
    type: Sequelize.STRING,
    field: 'created_by'
  },
  gameStart: {
    type: Sequelize.BOOLEAN,
    field: 'game_start'
  },
  currentPlayer: {
    type: Sequelize.INTEGER,
    field: 'current_player'
  },
  dice: {
    type: Sequelize.INTEGER,
  },
  gameEnd : {
    type: Sequelize.BOOLEAN,
    field: 'game_end'
  },
  winner: {
    type: Sequelize.STRING
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