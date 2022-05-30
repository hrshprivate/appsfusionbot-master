const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const FeedbackSchema= new Schema({
    chatId: Number,
    message: String
},{
    versionKey: false,
})

FeedbackSchema.method('toJSON', function () {
    const {
      _id,
      ...object
    } = this.toObject();
    object.id = _id;
    return object;
  });


module.exports =mongoose.model("Feedback",FeedbackSchema);