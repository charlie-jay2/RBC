const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);

            // Log the received body for debugging
            console.log('Received body:', body);

            const selectedCode = body.codeSelect;
            const embedText = body.embedText;
            const selectedWebhooks = body.webhooks || []; // Ensure we use the correct key

            // Check if selectedWebhooks is an array
            if (!Array.isArray(selectedWebhooks)) {
                throw new Error('webhook property is not an array');
            }

            // Define images for each security code
            const images = {
                codeGreen: 'CGIMG_URL',  // Replace with your Code Green image URL
                codeBlue: 'CBIMG_URL',   // Replace with your Code Blue image URL
                codeYellow: 'CYIMG_URL', // Replace with your Code Yellow image URL
                codeOrange: 'COIMG_URL', // Replace with your Code Orange image URL
                codeRed: 'CRIMG_URL',    // Replace with your Code Red image URL
                codePurple: 'CPIMG_URL'  // Replace with your Code Purple image URL
            };

            // Define webhook URLs from environment variables
            const webhookUrls = {
                webhook1: process.env.DISCORD_WEBHOOK1,
                webhook2: process.env.DISCORD_WEBHOOK2,
                webhook3: process.env.DISCORD_WEBHOOK3
            };

            // Prepare the embed message
            const embed = {
                title: `Security Alert: ${selectedCode}`,
                description: embedText,
                color: 0xFF9999, // Salmon pink color in hexadecimal
                image: {
                    url: images[selectedCode] || '' // Use a default image or empty string if not found
                }
            };

            // Send to selected webhooks
            const promises = selectedWebhooks.map(async (webhook) => {
                if (webhookUrls[webhook]) {
                    const response = await fetch(webhookUrls[webhook], {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ embeds: [embed] })
                    });

                    // Check for successful response
                    if (!response.ok) {
                        throw new Error(`Webhook request failed for ${webhook}: ${response.statusText}`);
                    }

                    return response.json();
                }
            });

            await Promise.all(promises);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Security action sent successfully!' })
            };
        } catch (error) {
            console.error('Error processing request:', error); // Log the error for debugging
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' })
    };
};
