const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const TermSchema= new Schema({
    term: String,
    store: String,
    key: String
},{
    versionKey: false,
})

TermSchema.method('toJSON', function () {
    const {
      _id,
      ...object
    } = this.toObject();
    object.id = _id;
    return object;
  });


module.exports =mongoose.model("Terms",TermSchema);