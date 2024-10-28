// database.js

const mongoose = require('mongoose');

// Connect using the environment variable
const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        throw new Error('MongoDB connection failed');
    });

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

// Create the Blog model
const Blog = mongoose.model('Blog', blogSchema);

// Define the notibar schema
const notibarSchema = new mongoose.Schema({
    text: { type: String, required: true },
    color: { type: String, default: '#333' },
    width: { type: String, default: '100%' },
    active: { type: Boolean, default: true },
    buttonActive: { type: Boolean, default: false },
    buttonText: { type: String, default: '' },
    buttonColor: { type: String, default: '#444' },
    buttonURL: { type: String, default: '#' },
});

const Notibar = mongoose.model('Notibar', notibarSchema);

module.exports = { User, Blog, Notibar };
