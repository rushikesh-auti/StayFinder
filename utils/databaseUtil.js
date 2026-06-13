const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;

const MONGO_URL = process.env.MONGODB_URI;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL).then(client => {
    console.log("Connected to MongoDB");
    callback();
    _db = client.db('airbnb')
  }).catch(err => {
    console.log("Failed to connect to MongoDB", err);
  })
};

const getDB = () => {
  if (!_db) {
    throw new Error('Mongo Not Connected');
  }
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;