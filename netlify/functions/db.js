require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;  // Reuse the cached connection
    }

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000,  // Increase connect timeout to 30s
        socketTimeoutMS: 45000,   // Increase socket timeout to 45s
        maxPoolSize: 10  // Allow pooling to reuse connections
    });

    try {
        await client.connect();
        cachedDb = client.db('RBCBlogs');
        return cachedDb;
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};

module.exports = connectToDatabase;
