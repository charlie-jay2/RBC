require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;  // Reuse cached connection if available
    }

    try {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 360000,  // 6-minute connection timeout
            socketTimeoutMS: 360000    // 6-minute socket timeout
        });

        await client.connect();
        cachedDb = client.db('RBCBlogs');
        return cachedDb;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
};

module.exports = connectToDatabase;
