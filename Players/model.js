const Sequelize = require('sequelize')
const sequelize = require('../db')
const validator = require('validator')

const Player = sequelize.define('players',
{
  userName: {
    type: Sequelize.STRING,
    allowNUll: false,
    field: 'user_name'
  },
  clientId: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'client_id',
  },
  password: {
    type: Sequelize.STRING,
    allowNUll: false
  }
},
  {
    timestamps: false,
    tableName: 'players'
  })

  module.exports = Player
