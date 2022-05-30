var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/apps-fusion-bot-dev-db',function(){
    mongoose.connection.db.dropDatabase();
});