const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // Your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function createTestUser() {
    try {
        await client.connect();
        const db = client.db('RBCBlogs'); // Replace with your actual database name
        const usersCollection = db.collection('users');

        // Insert a test user
        const result = await usersCollection.insertOne({
            username: 'admin',
            password: 'password123',
        });

        console.log('Test user created:', result);
    } catch (error) {
        console.error('Error inserting test user:', error);
    } finally {
        await client.close();
    }
}

createTestUser();
