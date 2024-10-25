const connectToDatabase = require('./db');
const { User } = require('./database');

exports.handler = async (event) => {
    try {
        const { username, password } = JSON.parse(event.body);
        const user = await User.findOne({ username });

        if (user && user.password === password) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Allow all origins for simplicity; restrict this in production
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: 'Login successful!' }),
            };
        }

        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Invalid username or password' }),
        };
    } catch (error) {
        console.error("Error during login process", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};
