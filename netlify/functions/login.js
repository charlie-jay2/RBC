const connectToDatabase = require('./db');

exports.handler = async (event) => {
    try {
        console.log("Connecting to database...");
        const db = await connectToDatabase();
        console.log("Connected to database!");

        const { username, password } = JSON.parse(event.body);
        console.log(`Logging in user: ${username}`);

        const user = await db.collection('users').findOne({ username });

        if (user && user.password === password) {
            console.log("Login successful!");
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Login successful!' }),
            };
        }

        console.log("Invalid username or password");
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
