const { MongoClient } = require('mongoose');
const { MongoClient } = require('mongodb');


const uri = process.env.MONGODB_URI; // Your MongoDB connection string
let db = null;

const connectToDatabase = async () => {
    if (!db) {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db('RBCBlogs'); // Replace with your database name
    }
    return db;
};

module.exports = connectToDatabase;
