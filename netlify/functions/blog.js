const connectToDatabase = require('./db');
const { ObjectId } = require('mongodb');

exports.handler = async (event) => {
    try {
        const db = await connectToDatabase();

        if (event.httpMethod === 'GET') {
            if (event.path.includes('/blog/')) {
                const id = event.path.split('/blog/')[1];
                const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });

                if (blog) {
                    blog.createdAt = blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("en-GB", {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })
                        : 'Date not available';
                }

                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*', // Allow all origins for simplicity; restrict this in production
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(blog),
                };
            }

            const blogs = await db.collection('blogs').find().toArray();
            blogs.forEach(blog => {
                blog.createdAt = blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                    : 'Date not available';
            });

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(blogs),
            };
        }

        if (event.httpMethod === 'POST') {
            let parsedBody;
            try {
                parsedBody = JSON.parse(event.body);
            } catch (error) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid JSON' }),
                };
            }

            const { title, description, image, author } = parsedBody;

            if (!title || !description || !image || !author) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Bad Request: Missing required fields' }),
                };
            }

            const createdAt = new Date();
            await db.collection('blogs').insertOne({ title, description, image, author, createdAt });
            return {
                statusCode: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: 'Blog post created' }),
            };
        }

        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    } catch (error) {
        console.error("Internal Server Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
