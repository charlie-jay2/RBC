// contactForm.js

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    let body;
    try {
        body = JSON.parse(event.body); // Parse the request body
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request body' }),
        };
    }

    const { name, email, message, contactPreference } = body;
    const webhookURL = process.env.DISCORD_WEBHOOK_URL4;

    // Log the webhook URL for debugging
    console.log('Webhook URL:', webhookURL);

    const embed = {
        title: "New contact form",
        fields: [
            { name: "Name", value: name || "Not provided" },
            { name: "Email", value: email || "Not provided" },
            { name: "Message", value: message || "Not provided" },
            { name: "Contact Preference", value: contactPreference.join(", ") || "Not provided" },
        ],
        color: 0x0099ff,
    };

    try {
        // Directly using global fetch without import
        const response = await fetch(webhookURL, {
            method: "POST",
            body: JSON.stringify({ embeds: [embed] }),
            headers: { "Content-Type": "application/json" },
        });

        // Check for successful response
        if (!response.ok) {
            const errorData = await response.json(); // Read error response
            throw new Error(errorData.error || 'Failed to send message to Discord');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form submitted successfully!' }),
        };
    } catch (error) {
        console.error('Error sending message to Discord:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send message to Discord' }),
        };
    }
};
