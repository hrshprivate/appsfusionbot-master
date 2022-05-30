const mongoose = require('mongoose')

module.exports = async function() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log(`Connected to ${process.env.DB_URL}.`)

  } catch (error) {
    console.log('Unable to connect to MongoDB!')
    throw error
  }
}
