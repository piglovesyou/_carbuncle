const syncedDB = require('synceddb-client');
const {SERVER_HOST} = require('../const');

const db = syncedDB.open({ // Open database.
  name: 'carbuncle',
  version: 1,
  stores: {
    testcases: [
      // ['byCreation', 'createdAt']
    ]
  },
  remote: SERVER_HOST
});

module.exports = db;
