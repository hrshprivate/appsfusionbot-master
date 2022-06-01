// const mongoose = require("mongoose");
// const Schema = mongoose.Schema ;

// const ApplicationSchema= new Schema({
//     chatId: Number,
//     applications: Array
// },{
//     versionKey: false,
// })

// ApplicationSchema.method('toJSON', function () {
//     const {
//       _id,
//       ...object
//     } = this.toObject();
//     object.id = _id;
//     return object;
//   });

// module.exports =mongoose.model("Application", ApplicationSchema);

const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const ApplicationSchema = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chatId: { type: DataTypes.INTEGER },
  applications: { type: DataTypes.ARRAY(DataTypes.STRING) },
})

// ApplicationSchema.method('toJSON', function () {
//   const { id, ...object } = this.toObject()
//   object.id = id
//   return object
// })

module.exports = { ApplicationSchema }
