// db.js

require('dotenv').config();  // Load environment variables
const { MongoClient } = require('mongodb');

console.log("MongoDB URI:", process.env.MONGODB_URI); // Check if URI is loaded

const uri = process.env.MONGODB_URI;
let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();
    cachedDb = client.db('RBCBlogs'); // Ensure this is your database name
    return cachedDb;
};

module.exports = connectToDatabase;
