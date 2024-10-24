// contact.js (Netlify Function)
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const { name, email, message } = JSON.parse(event.body);
    const webhookURL = process.env.WEBHOOK_URL;

    const discordMessage = {
        content: `**New Contact Form Submission**\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage),
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Submission Successful' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to submit form' }),
        };
    }
};
