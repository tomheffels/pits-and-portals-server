const Sequelize = require('sequelize')
const sequelize = require('../db')
const validator = require('validator')

const Game = sequelize.define('games',
{
  gameStarted: {
    type: Sequelize.BOOLEAN,
    allowNUll: false,
    field: 'game_started',
    defaultValue: false 
  },
  gameEnded: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    field: 'game_ended',
    defaultValue: false
  },
  currentPlayer: {
    type: Sequelize.NUMBER,
    allowNull: false,
    field: 'current_player'
  },
  currentRoll: {
    type: Sequelize.NUMBER,
    allowNull: false,
    field: 'current_roll'
  }
},
  {
    timestamps: false,
    tableName: 'games'
  })

  module.exports = Game