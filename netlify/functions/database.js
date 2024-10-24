// database.js

const mongoose = require('mongoose');

// Using the connection string directly from .env
const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define the user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Define the blog schema
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Virtual for formatted date in UK format
blogSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
});

// Create the Blog model
const Blog = mongoose.model('Blog', blogSchema);

module.exports = { User, Blog };
