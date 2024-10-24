require('dotenv').config();
const { MongoClient } = require('mongodb');

let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    const uri = process.env.MONGODB_URI;

    try {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,  // 5-second timeout for server selection
            connectTimeoutMS: 10000          // 10-second connection timeout
        });

        await client.connect();
        cachedDb = client.db('RBCBlogs');
        return cachedDb;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;  // Fail fast if there's a connection issue
    }
};

module.exports = connectToDatabase;
