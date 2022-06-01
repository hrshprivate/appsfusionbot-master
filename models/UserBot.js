// const mongoose = require("mongoose");
// const Schema = mongoose.Schema ;

// const UserBotSchema= new Schema({
//     firstName: String,
//     lastName: String,
//     userName: String,
//     chatId: Number,
//     subscription:{
//         isTrial: Boolean,
//         isSubscribe: Boolean,
//         days: Number,
//         plan: {
//           type: String,
//           enum: [ 'CREW', 'MINI', 'BASIC' ],
//         },
//         apps: Number
//       },
//     settings:{
//         command: String,
//         store: String,
//         country: String
//     },
//     currentApp: {
//         appId: String,
//         store: String,
//         country: String,
//         nextPaginationToken: String
//     }
// },{
//     versionKey: false,
// })

// UserBotSchema.method('toJSON', function () {
//     const {
//       _id,
//       ...object
//     } = this.toObject();
//     object.id = _id;
//     return object;
//   });

// module.exports =mongoose.model("Bot-users",UserBotSchema);

const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const UserBotSchema = sequelize.define('Bot-users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  userName: { type: DataTypes.STRING },
  chatId: { type: DataTypes.INTEGER },
})

const Subscription = sequelize.define('subscription', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  isTrial: { type: DataTypes.BOOLEAN },
  isSubscribe: { type: DataTypes.BOOLEAN },
  days: { type: DataTypes.INTEGER },
  plan: { type: DataTypes.STRING, Enumerator: ['CREW', 'MINI', 'BASIC'] },
  apps: { type: DataTypes.INTEGER },
})

const Settings = sequelize.define('settings', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  command: { type: DataTypes.STRING },
  store: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
})

const CurrentApp = sequelize.define('currentApp', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  appId: { type: DataTypes.STRING },
  store: { type: DataTypes.STRING },
  nextPaginationToken: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
})

UserBotSchema.hasMany(Subscription)
Subscription.belongsTo(UserBotSchema)

UserBotSchema.hasMany(Settings)
Settings.belongsTo(UserBotSchema)

UserBotSchema.hasMany(CurrentApp)
CurrentApp.belongsTo(UserBotSchema)

// UserBotSchema.method('toJSON', function () {
//   const { id, ...object } = this.toObject()
//   object.id = id
//   return object
// })

module.exports = { UserBotSchema, Subscription, Settings, CurrentApp }
