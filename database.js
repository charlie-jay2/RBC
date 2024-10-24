const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI; // Store your MongoDB connection string in the .env file

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Blog = mongoose.model('Blog', blogSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Blog, User };
