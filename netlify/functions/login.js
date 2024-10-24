const connectToDatabase = require('./db');

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Method Not Allowed' }),
            };
        }

        const { username, password } = JSON.parse(event.body);

        // Check if username and password are provided
        if (!username || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing username or password' }),
            };
        }

        // Connect to the database
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ username });

        if (user && user.password === password) {
            // Login successful
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Login successful' }),
            };
        } else {
            // Invalid username or password
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid username or password' }),
            };
        }
    } catch (error) {
        console.error("Login error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
