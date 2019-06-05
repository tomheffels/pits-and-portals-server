const Sequelize = require('sequelize')
const sequelize = require('../db')
const Game = require('../Games')

const Board = sequelize.define ('boards', {
  pits: {
    type: Sequelize.ARRAY,
    allowNull: false
  },

  portals: {
    type: Sequelize.ARRAY,
    allowNull: false
  },
  gameId : {
    type: Sequelize.INTEGER,
    field: 'game_id'
  },
},
{
  timestamps: false,
  tableName: 'boards'
})

Board.belongsTo(Game)
module.exports = Board
