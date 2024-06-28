const { MongoClient } = require('mongodb');

const mongoUri = 'YOUR_DB_URI'; // Replace with your MongoDB URI

let db;

const getDb = async () => {
  if (db) {
    return db;
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db('youtube_summaries'); // Replace with your database name
  console.log('Connected to MongoDB');
  return db;
};

module.exports = { getDb };
