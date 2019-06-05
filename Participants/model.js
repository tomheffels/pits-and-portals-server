const Sequelize = require('sequelize')
const sequelize = require('../db')
const Player = require('../Players/model')
const Avatar = require ('../Avatars/model')

const Participant = sequelize.define ('participants', {
  playerId : {
    type: Sequelize.INTEGER,
    field: 'player_id'
  },
  gameId : {
    type: Sequelize.INTEGER,
    field: 'game_id'
  },
  score : {
    type: Sequelize.NUMBER,
  },
  avatarId :{
    type: Sequelize.INTEGER,
    field: 'avatar_id'
  }
},
{
  timestamps: false,
  tableName: 'participants'
})

Participant.belongsTo(Player)
Participant.belongsTo(Avatar)
module.exports = Participant
