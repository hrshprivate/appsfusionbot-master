const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const AppIdSchema= new Schema({
    appId: String,
},{
    versionKey: false,
})

AppIdSchema.method('toJSON', function () {
    const {
      _id,
      ...object
    } = this.toObject();
    object.id = _id;
    return object;
  });


module.exports =mongoose.model("App-ids",AppIdSchema);