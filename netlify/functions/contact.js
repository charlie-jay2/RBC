const fetch = require('node-fetch'); // Make sure to install node-fetch

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const { name, discord_username, email, message, contact_method } = JSON.parse(event.body);

    // Replace empty optional fields with 'N/A'
    const formattedEmail = email || 'N/A';
    const formattedContactMethod = contact_method?.length > 0 ? contact_method.join(', ') : 'N/A';

    const embed = {
        title: "New Contact Form Submission",
        fields: [
            { name: "Name", value: name || "N/A", inline: true },
            { name: "Discord Username", value: discord_username || "N/A", inline: true },
            { name: "Email", value: formattedEmail, inline: true },
            { name: "Message", value: message || "N/A" },
            { name: "Preferred Contact Method", value: formattedContactMethod, inline: true },
        ],
        color: 7506394, // Color of the embed (optional)
    };

    const webhookUrl = process.env.DiscordWebhook1;

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ embeds: [embed] }),
        });

        if (!response.ok) {
            throw new Error('Error sending message to Discord');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent successfully!' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};
