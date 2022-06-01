// const mongoose = require("mongoose");
// const Schema = mongoose.Schema ;

// const FeedbackSchema= new Schema({
//     chatId: Number,
//     message: String
// },{
//     versionKey: false,
// })

// FeedbackSchema.method('toJSON', function () {
//     const {
//       _id,
//       ...object
//     } = this.toObject();
//     object.id = _id;
//     return object;
//   });

// module.exports =mongoose.model("Feedback",FeedbackSchema);
const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const FeedbackSchema = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chatId: { type: DataTypes.INTEGER },
  message: { type: DataTypes.STRING },
})

// FeedbackSchema.method('toJSON', function () {
//   const { id, ...object } = this.toObject()
//   object.id = id
//   return object
// })

module.exports = { FeedbackSchema }
