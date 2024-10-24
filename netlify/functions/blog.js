const connectToDatabase = require('./db');

exports.handler = async (event) => {
    const db = await connectToDatabase();

    if (event.httpMethod === 'GET') {
        const blogs = await db.collection('blogs').find().toArray();
        return {
            statusCode: 200,
            body: JSON.stringify(blogs),
        };
    }

    if (event.httpMethod === 'POST') {
        const { title, description } = JSON.parse(event.body);
        await db.collection('blogs').insertOne({ title, description });
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Blog post created' }),
        };
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
};
