const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const SubscriptionSchema= new Schema({
    chatId: Number,
    appId: String,
    store: String,
    isSubscribe: Boolean,
    reviews: Array,
    lastReview: String,
    isRead: Boolean,
    end: Number

},{
    versionKey: false,
})

SubscriptionSchema.method('toJSON', function () {
    const {
      _id,
      ...object
    } = this.toObject();
    object.id = _id;
    return object;
  });


module.exports =mongoose.model("Subscription",SubscriptionSchema);