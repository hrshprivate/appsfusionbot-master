// const mongoose = require("mongoose");
// const Schema = mongoose.Schema ;

// const AppReviewsSchema = new Schema({
//     appId: String,
//     store: String,
//     reviews: {
//       type: Array,
//       default: []
//     },
//     reviewsCount: {
//       type: Number,
//       default: null
//     }
// },{
//     versionKey: false,
// })

// AppReviewsSchema.method('toJSON', function () {
//     const {
//       _id,
//       ...object
//     } = this.toObject();
//     object.id = _id;
//     return object;
//   });

// module.exports = mongoose.model("app-reviews", AppReviewsSchema);

const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const AppReviewsSchema = sequelize.define('app-reviews', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  appId: { type: DataTypes.STRING },
  store: { type: DataTypes.STRING },
  reviews: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  reviewsCount: { type: DataTypes.INTEGER, defaultValue: null },
})

// AppReviewsSchema.method('toJSON', function () {
//   const { id, ...object } = this.toObject()
//   object.id = id
//   return object
// })

module.exports = { AppReviewsSchema }
