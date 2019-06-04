const Sequelize = require('sequelize')
const sequelize = require('../db')

const Avatar = sequelize.define('avatars', 
{
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  }
},
{
  timestamps: false,
  tableName: 'avatars'
})
module.exports = Avatar