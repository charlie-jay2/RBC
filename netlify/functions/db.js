require('dotenv').config();  // Ensure environment variables are loaded
const { MongoClient } = require('mongodb');

console.log("MongoDB URI:", process.env.MONGODB_URI); // Log URI for debugging

const uri = process.env.MONGODB_URI;
let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        cachedDb = client.db('RBCBlogs');
        console.log("Database connected successfully!");
        return cachedDb;
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error('Database connection failed');
    }
};

module.exports = connectToDatabase;
