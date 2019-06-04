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
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
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
