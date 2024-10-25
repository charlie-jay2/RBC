const fetch = require('node-fetch');

// Your Discord Webhook URLs
const webhookURL1 = process.env.DISCORD_WEBHOOK_URL_1;
const webhookURL2 = process.env.DISCORD_WEBHOOK_URL_2;
const webhookURL3 = process.env.DISCORD_WEBHOOK_URL_3;

// Function to create the embed message
function createEmbedMessage(code, message, imageUrl) {
    return {
        embeds: [
            {
                title: code,
                description: message,
                image: {
                    url: imageUrl,
                },
                color: 0x00ff00, // You can change this color if needed
            },
        ],
    };
}

// Main handler
exports.handler = async (event, context) => {
    const { code, message, webhooks } = JSON.parse(event.body);

    let webhookUrls = [];
    if (webhooks.includes("webhook1")) webhookUrls.push(webhookURL1);
    if (webhooks.includes("webhook2")) webhookUrls.push(webhookURL2);
    if (webhooks.includes("webhook3")) webhookUrls.push(webhookURL3);

    const imageUrl = "https://example.com/your-image.jpg"; // Replace with your actual image URL

    // Send messages to selected webhooks
    const promises = webhookUrls.map(async (url) => {
        const embedMessage = createEmbedMessage(code, message, imageUrl);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embedMessage),
        });

        if (!response.ok) {
            console.error(`Failed to send message to webhook: ${url}, Status: ${response.status}`);
            throw new Error(`Webhook failed with status ${response.status}`);
        }
        return response.json();
    });

    try {
        await Promise.all(promises);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Messages sent successfully!' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
