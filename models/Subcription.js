// const mongoose = require("mongoose");
// const Schema = mongoose.Schema ;

// const SubscriptionSchema= new Schema({
//     chatId: Number,
//     appId: String,
//     store: String,
//     isSubscribe: Boolean,
//     reviews: Array,
//     lastReview: String,
//     isRead: Boolean,
//     end: Number

// },{
//     versionKey: false,
// })

// SubscriptionSchema.method('toJSON', function () {
//     const {
//       _id,
//       ...object
//     } = this.toObject();
//     object.id = _id;
//     return object;
//   });

// module.exports =mongoose.model("Subscription",SubscriptionSchema);

const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const SubscriptionSchema = sequelize.define('Subscription', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  appId: { type: DataTypes.STRING },
  chatId: { type: DataTypes.INTEGER },
  store: { type: DataTypes.STRING },
  isSubscribe: { type: DataTypes.BOOLEAN },
  reviews: { type: DataTypes.ARRAY(DataTypes.STRING) },
  lastReview: { type: DataTypes.STRING },
  isRead: { type: DataTypes.BOOLEAN },
  end: { type: DataTypes.INTEGER },
})

// SubscriptionSchema.method('toJSON', function () {
//   const { id, ...object } = this.toObject()
//   object.id = id
//   return object
// })

module.exports = { SubscriptionSchema }
