const Sequelize = require('sequelize')
const sequelize = require('../db')
const Game = require('../Games/model')


const Player = sequelize.define('players',
{
  name: {
    type: Sequelize.STRING,
    allowNUll: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNUll: false
  },
currentPlayer: {
  type: Sequelize.BOOLEAN,
  field:'current_player'
},
avatar: {
  type: Sequelize.STRING,
},
gameId : {
  type: Sequelize.INTEGER,
  field: 'game_id'
}
},
  {
    timestamps: false,
    tableName: 'players'
  })
  Player.beforeCreate(function (player, options) {
   player.avatar = `https://api.adorable.io/avatars/200/${player.name}.png`
  })
Player.belongsTo(Game)
  module.exports = Player
