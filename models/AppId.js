// const mongoose = require("mongoose");
// const Schema = mongoose.Schema ;

// const AppIdSchema= new Schema({
//     appId: String,
// },{
//     versionKey: false,
// })

// AppIdSchema.method('toJSON', function () {
//     const {
//       _id,
//       ...object
//     } = this.toObject();
//     object.id = _id;
//     return object;
//   });

// module.exports =mongoose.model("App-ids",AppIdSchema);

const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const AppIdSchema = sequelize.define('App-ids', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  appId: { type: DataTypes.STRING },
})

// AppIdSchema.method('toJSON', function () {
//   const { id, ...object } = this.toObject()
//   object.id = id
//   return object
// })

module.exports = { AppIdSchema }
