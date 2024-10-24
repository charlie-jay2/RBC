let fetch;

const loadFetch = async () => {
    if (!fetch) {
        const module = await import('node-fetch');
        fetch = module.default;
    }
};

exports.handler = async (event, context) => {
    await loadFetch(); // Ensure fetch is loaded

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    let data;
    try {
        data = JSON.parse(event.body);
        console.log("Received data:", data);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid JSON body' }),
        };
    }

    // Destructure fields from the data
    const { name, discord_username, email, message, contact_method } = data;

    // Check for required fields
    if (!name || !discord_username || !email || !message || !contact_method || contact_method.length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'All fields are required.' }),
        };
    }

    const formattedEmail = email || 'N/A';
    const formattedContactMethod = contact_method.join(', '); // Always use the selected methods

    const embed = {
        title: "New Contact Form Submission",
        fields: [
            { name: "Name", value: name, inline: true },
            { name: "Discord Username", value: discord_username, inline: true },
            { name: "Email", value: formattedEmail, inline: true },
            { name: "Message", value: message },
            { name: "Preferred Contact Method", value: formattedContactMethod, inline: true },
        ],
        color: 7506394,
    };

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL1;

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ embeds: [embed] }),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Error sending message to Discord: ${errorDetails}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent successfully!' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};
