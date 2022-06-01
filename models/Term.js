// const mongoose = require("mongoose");
// const Schema = mongoose.Schema ;

// const TermSchema= new Schema({
//     term: String,
//     store: String,
//     key: String
// },{
//     versionKey: false,
// })

// TermSchema.method('toJSON', function () {
//     const {
//       _id,
//       ...object
//     } = this.toObject();
//     object.id = _id;
//     return object;
//   });

// module.exports =mongoose.model("Terms",TermSchema);

const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const TermSchema = sequelize.define('Terms', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  term: { type: DataTypes.STRING },
  store: { type: DataTypes.STRING },
  key: { type: DataTypes.STRING },
})

// TermSchema.method('toJSON', function () {
//   const { id, ...object } = this.toObject()
//   object.id = id
//   return object
// })

module.exports = { TermSchema }
