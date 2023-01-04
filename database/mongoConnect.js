const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const MONDB_URL = "mongodb://localhost:27017/StudentAdmin"
const mongoConnect = callback => {
  MongoClient.connect(
       MONDB_URL,
    { useNewUrlParser: true },
  )
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
