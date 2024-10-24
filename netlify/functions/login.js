// login.js

require('dotenv').config();  // Load environment variables
const connectToDatabase = require('./db');
const { User } = require('./database');  // Import User model

exports.handler = async (event) => {
    try {
        const db = await connectToDatabase();

        // Only support POST requests
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Method Not Allowed' }),
            };
        }

        const { username, password } = JSON.parse(event.body);

        // Validate the credentials against the database
        const user = await db.collection('users').findOne({ username, password });

        if (user) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Login successful!' }),
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid credentials.' }),
            };
        }
    } catch (error) {
        // Handle unexpected errors
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
};
