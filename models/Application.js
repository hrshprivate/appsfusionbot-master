const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const ApplicationSchema= new Schema({
    chatId: Number,
    applications: Array
},{
    versionKey: false,
})

ApplicationSchema.method('toJSON', function () {
    const {
      _id,
      ...object
    } = this.toObject();
    object.id = _id;
    return object;
  });


module.exports =mongoose.model("Application", ApplicationSchema);