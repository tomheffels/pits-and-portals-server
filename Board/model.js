const Sequelize = require('sequelize')
const sequelize = require('../db')

const Board = sequelize.define ('Board', {
  in: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  out: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},
{
  timestamps: false,
  tableName: 'Board'
})

module.exports = Board
