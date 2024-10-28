const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection URI
const uri = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
    if (!uri) {
        return { statusCode: 500, body: 'MongoDB URI is missing' };
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('RBCBlogs');
        const collection = database.collection('notibar');
        const notibarData = await collection.findOne({}); // Get the first document

        // Check if the notibar is active
        if (notibarData && notibarData.active) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    text: notibarData.text,
                    color: notibarData.color,
                    width: notibarData.width,
                    active: notibarData.active,
                    buttonActive: notibarData.buttonActive,
                    buttonText: notibarData.buttonText,
                    buttonColor: notibarData.buttonColor,
                    buttonURL: notibarData.buttonURL,
                }),
            };
        } else {
            // If not active, return a response indicating it is inactive
            return {
                statusCode: 200,
                body: JSON.stringify({ active: false }), // Indicates notibar should not be shown
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch notibar data' }),
        };
    } finally {
        await client.close();
    }
};
