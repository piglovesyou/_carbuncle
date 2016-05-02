import syncedDB from 'piglovesyou-synceddb-client';
const {SERVER_HOST} = require('../const');

const db = syncedDB.open({ // Open database.
  name: 'carbuncle',
  version: 3,
  stores: {
    testcases: [
      ['key', 'key'],
      ['title', 'title'],
      ['modifiedAt', 'modifiedAt'],
    ],
  },
  remote: SERVER_HOST
});

module.exports = db;
