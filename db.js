const Sequelize = require('sequelize')

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:funtimes@localhost:5432/postgres'
const sequelize = new Sequelize(connectionString, { define: { timestamps: false } })

sequelize
  .sync(
    // { force: true }
  )
  .then(() => {
    console.log('Sequelize updated database schema')
  })
  .catch(console.error)

module.exports = sequelize