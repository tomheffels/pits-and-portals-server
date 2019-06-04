const Sequelize = require('sequelize')
const sequelize = require('../db')
const Player = require('../Players/model')

const Participant = sequelize.define ('participants', {
  playerId : {
    type: Sequelize.INTEGER,
    field: 'player_id'
  },
  gameId : {
    type: Sequelize.INTEGER,
    field: 'game_id'
  },
  position : {
    type: Sequelize.NUMBER,
  }
},
{
  timestamps: false,
  tableName: 'participants'
})

Participant.belongsTo(Player)
module.exports = Participant
