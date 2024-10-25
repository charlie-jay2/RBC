require('dotenv').config();
const { MongoClient } = require('mongodb');

console.log("MongoDB URI:", process.env.MONGODB_URI); // Debug check

const uri = process.env.MONGODB_URI;
let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000   // 45 seconds
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
