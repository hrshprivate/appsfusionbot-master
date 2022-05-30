const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const AppReviewsSchema = new Schema({
    appId: String,
    store: String,
    reviews: {
      type: Array,
      default: []
    },
    reviewsCount: {
      type: Number,
      default: null
    }
},{
    versionKey: false,
})

AppReviewsSchema.method('toJSON', function () {
    const {
      _id,
      ...object
    } = this.toObject();
    object.id = _id;
    return object;
  });


module.exports = mongoose.model("app-reviews", AppReviewsSchema);