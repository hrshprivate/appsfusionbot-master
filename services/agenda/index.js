const Agenda = require('agenda');
require('dotenv').config();

const connectionOpts = {
  db: {
    address: `mongodb+srv://user123:user123@cluster0.nivix.mongodb.net/?retryWrites=true&w=majority`,
    collection: 'agenda-jobs',
    options: { useUnifiedTopology: true },
  },
};

const agenda = new Agenda(connectionOpts);

require('./appSubscription')(agenda);
require('./botSubscription')(agenda);
require('./appReviews')(agenda);

module.exports = agenda;
