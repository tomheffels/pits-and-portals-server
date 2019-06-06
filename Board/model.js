const Sequelize = require('sequelize')
const sequelize = require('../db')

const Board = sequelize.define ('Board', {
  X: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  Y: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},
{
  timestamps: false,
  tableName: 'Board'
})


module.exports = Board
