const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const UserBotSchema= new Schema({
    firstName: String,
    lastName: String,
    userName: String,
    chatId: Number,
    subscription:{
        isTrial: Boolean,
        isSubscribe: Boolean,
        days: Number,
        plan: {
          type: String,
          enum: [ 'CREW', 'MINI', 'BASIC' ],
        },
        apps: Number
      },
    settings:{
        command: String,
        store: String,
        country: String
    },
    currentApp: {
        appId: String,
        store: String,
        country: String,
        nextPaginationToken: String
    }
},{
    versionKey: false,
})

UserBotSchema.method('toJSON', function () {
    const {
      _id,
      ...object
    } = this.toObject();
    object.id = _id;
    return object;
  });


module.exports =mongoose.model("Bot-users",UserBotSchema);