const Sequelize = require('sequelize')
const sequelize = require('../db')

const Game = sequelize.define ('games', {
  gameStart: {
    type: Sequelize.BOOLEAN
  },
  gameEnd : {
    type: Sequelize.BOOLEAN
  },
  winner: {
    type: Sequelize.STRING
  }
},
{
  timestamps: false,
  tableName: 'games'
}
)

module.exports = Game 