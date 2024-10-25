const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);
            console.log('Received body:', body);

            const { codeSelect, embedText, webhooks: selectedWebhooks = [] } = body;

            if (!Array.isArray(selectedWebhooks)) {
                throw new Error('webhook property is not an array');
            }

            const images = {
                codeGreen: 'CGIMG_URL',
                codeBlue: 'CBIMG_URL',
                codeYellow: 'CYIMG_URL',
                codeOrange: 'COIMG_URL',
                codeRed: 'CRIMG_URL',
                codePurple: 'CPIMG_URL'
            };

            const webhookUrls = {
                webhook1: process.env.DISCORD_WEBHOOK1,
                webhook2: process.env.DISCORD_WEBHOOK2,
                webhook3: process.env.DISCORD_WEBHOOK3
            };

            const embed = {
                title: `Security Alert: ${codeSelect}`,
                description: embedText,
                color: 0xFF9999,
                image: {
                    url: images[codeSelect] || ''
                }
            };

            const promises = selectedWebhooks.map(async (webhook) => {
                const url = webhookUrls[webhook];
                if (url) {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ embeds: [embed] })
                    });

                    if (!response.ok) {
                        const errorMessage = await response.text(); // Capture response for more information
                        throw new Error(`Webhook request failed for ${webhook}: ${response.statusText} - ${errorMessage}`);
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
            console.error('Error processing request:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message || 'Internal Server Error' })
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
};
