const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection URI
const uri = process.env.MONGODB_URI;

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('RBCBlogs');
        const collection = database.collection('notibar');

        const data = JSON.parse(event.body); // Parse the incoming data

        // Update the Notibar schema with the new data
        const result = await collection.findOneAndUpdate(
            {},
            {
                $set: {
                    text: data.text,
                    color: data.color,
                    buttonActive: data.buttonActive, // Directly using the checkbox value
                    buttonText: data.buttonText,
                    buttonColor: data.buttonColor,
                    buttonURL: data.buttonURL,
                    active: data.active
                }
            },
            { returnDocument: 'after' } // Return the updated document
        );

        if (result.value) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, updatedNotibar: result.value }),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Updated notibar.' }),
            };
        }
    } catch (error) {
        console.error('Error occurred:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update Notibar', details: error.message }),
        };
    } finally {
        await client.close();
    }
};
