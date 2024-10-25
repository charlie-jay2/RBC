const connectToDatabase = require('./db');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    try {
        const db = await connectToDatabase();
        const { username, password } = JSON.parse(event.body);

        const user = await db.collection('users').findOne({ username });

        if (user && user.password === password) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: 'Login successful!' }),
            };
        }

        return {
            statusCode: 401,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Invalid username or password' }),
        };
    } catch (error) {
        console.error('Error during login process', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};
