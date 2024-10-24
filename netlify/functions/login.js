const connectToDatabase = require('./db');

exports.handler = async (event) => {
    const db = await connectToDatabase();
    const { username, password } = JSON.parse(event.body);

    const user = await db.collection('users').findOne({ username });

    if (user && user.password === password) {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Login successful!' }),
        };
    }

    return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid username or password' }),
    };
};
