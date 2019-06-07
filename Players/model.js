const Sequelize = require('sequelize')
const sequelize = require('../db')
const Game = require('../Games/model')


const Player = sequelize.define('players',
  {
    name: {
      type: Sequelize.STRING,
      allowNUll: false,
    },
    currentPlayer: {
      type: Sequelize.BOOLEAN,
      field:'current_player'
    },
    avatar: {
      type: Sequelize.STRING,
    },
    position : {
      type: Sequelize.INTEGER,
      allowNUll: false,
      defaultValue: 1
    }
  },
  {
    timestamps: false,
    tableName: 'players'
  }
)

Player.beforeCreate(function (player, options) {
  player.avatar = `https://api.adorable.io/avatars/200/${player.name}.png`
})

Player.belongsTo(Game)
Game.hasMany(Player)

module.exports = Player
