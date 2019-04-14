const MongoClient = require('mongodb').MongoClient;
const URI = process.env.MONGO || 'mongodb://localhost:27017';
let _DB;

const connectDB = async callback => {
  try {
    MongoClient.connect(URI, { useNewUrlParser: true }, (err, client) => {
      _DB = client.db('Chat-app');
      return callback(err);
    });
  } catch (e) {
    throw e;
  }
};

const getDB = () => _DB;

const disconnectDB = () => _DB.close();

module.exports = { connectDB, getDB, disconnectDB };
