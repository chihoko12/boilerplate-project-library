require('dotenv').config();
const { MongoClient } = require('mongodb');
const URI = process.env.DB;
const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
  // connect to the MongoDB cluster
  await client.connect();
  console.log('Connected to database');
  // make the appropriate Db calls
  return client.connect();
}

module.exports = main;
