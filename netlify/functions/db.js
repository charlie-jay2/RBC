require('dotenv').config();
const { MongoClient } = require('mongodb');

let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        cachedDb = client.db('RBCBlogs'); // Change to your DB name if necessary
        return cachedDb;
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};

module.exports = connectToDatabase; // Ensure this line is present
