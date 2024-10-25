const connectToDatabase = require('./db'); // Ensure this is the correct relative path
const { Blog } = require('./database'); // Adjust path if necessary

exports.handler = async (event) => {
    const db = await connectToDatabase();

    // GET request to fetch all blog posts
    if (event.httpMethod === 'GET') {
        try {
            const blogs = await db.collection('blogs').find().toArray();
            return {
                statusCode: 200,
                body: JSON.stringify(blogs),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
            };
        } catch (error) {
            console.error('Error retrieving blogs:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error retrieving blogs' }),
            };
        }
    }

    // POST request to create a new blog post
    if (event.httpMethod === 'POST') {
        try {
            const { title, description, image, author } = JSON.parse(event.body);

            const newBlog = {
                title,
                description,
                image,
                author,
                createdAt: new Date(),
            };

            // Insert the new blog post into the database
            const result = await db.collection('blogs').insertOne(newBlog);
            return {
                statusCode: 201,
                body: JSON.stringify({
                    message: 'Blog post created successfully!',
                    blog: {
                        id: result.insertedId, // Return the inserted ID
                        ...newBlog, // Return the new blog details
                    },
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
            };
        } catch (error) {
            console.error('Error saving blog post:', error);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Error saving blog post' }),
            };
        }
    }

    // Handle unsupported methods
    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
    };
};
