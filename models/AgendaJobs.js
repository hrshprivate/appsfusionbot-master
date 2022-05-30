const mongoose = require("mongoose");
const Schema = mongoose.Schema;
  

const jobsScheme = new Schema({
    data: {}
});
module.exports = mongoose.model("Agenda-jobs", jobsScheme);