// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const jobsScheme = new Schema({
//   data: {},
// })
// module.exports = mongoose.model('Agenda-jobs', jobsScheme)

const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const jobsScheme = sequelize.define('Agenda-jobs', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const data = sequelize.define('data', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

jobsScheme.hasMany(data)
data.belongsTo(jobsScheme)

module.exports = { jobsScheme, data }
