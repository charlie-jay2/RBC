// contactForm.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const { name, email, message, contactPreference } = JSON.parse(event.body);
    const webhookURL = process.env.DISCORD_WEBHOOK_URL4;

    const embed = {
        title: "New contact form",
        fields: [
            { name: "Name", value: name || "Not provided" },
            { name: "Email", value: email || "Not provided" },
            { name: "Message", value: message || "Not provided" },
            { name: "Preferred Contact Method", value: contactPreference ? contactPreference.join(", ") : "None" }
        ],
    };

    const body = JSON.stringify({ embeds: [embed] });

    try {
        await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'applicataion/json' },
            body,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form submitted successfully!' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error sending message' }),
        };
    }
};
