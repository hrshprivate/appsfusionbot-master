// const mongoose = require('mongoose')

// module.exports = async function() {
//   try {
//     await mongoose.connect(process.env.DB_URL, {
//       useCreateIndex: true,
//       useFindAndModify: false,
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     })

//     console.log(`Connected to ${process.env.DB_URL}.`)

//   } catch (error) {
//     console.log('Unable to connect to MongoDB!')
//     throw error
//   }
// }
const { Sequelize } = require('sequelize')
require('dotenv').config()
module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
)
