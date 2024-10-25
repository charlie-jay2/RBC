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

    const { code, message, webhooks } = body;
    const webhookURLs = {
        webhook1: process.env.DISCORD_WEBHOOK_URL1,
        webhook2: process.env.DISCORD_WEBHOOK_URL2,
        webhook3: process.env.DISCORD_WEBHOOK_URL3
    };
    const selectedWebhooks = webhooks.map(name => webhookURLs[name]).filter(Boolean);

    // Case-based preset image URL, title, and color for each code
    let embedSettings;
    switch (code) {
        case 'codeGreen':
            embedSettings = {
                title: "Code Green Alert",
                color: 0x00ff00,
                imageUrl: "https://cdn.discordapp.com/emojis/1297634914388410538.png"
            };
            break;
        case 'codeYellow':
            embedSettings = {
                title: "Code Yellow Alert",
                color: 0xffff00,
                imageUrl: "https://cdn.discordapp.com/emojis/1297638454573924493.png"
            };
            break;
        case 'codeBlue':
            embedSettings = {
                title: "Code Blue Alert",
                color: 0x0000ff,
                imageUrl: "https://cdn.discordapp.com/emojis/1297634914388410538.png"
            };
            break;
        case 'codeOrange':
            embedSettings = {
                title: "Code Orange Alert",
                color: 0x0000ff,
                imageUrl: "https://cdn.discordapp.com/emojis/1297639479053520936.png"
            }
        case 'codeRed':
            embedSettings = {
                title: "Code Red Alert",
                color: 0xff0000,
                imageUrl: "https://cdn.discordapp.com/emojis/1297640061822828716.png"
            };
            break;
        case 'codePurple':
            embedSettings = {
                title: "Code Purple Alert",
                color: 0x800080,
                imageUrl: "https://cdn.discordapp.com/emojis/1297640648710553651.png"
            };
            break;
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid code selected' }),
            };
    }

    // Discord embed object
    const embed = {
        title: embedSettings.title,
        description: message || "No message provided",
        color: embedSettings.color,
        image: { url: embedSettings.imageUrl },
        fields: [{ name: "Alert Code", value: code }]
    };

    // Send message to each selected webhook
    try {
        await Promise.all(selectedWebhooks.map(async (url) => {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({ embeds: [embed] }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error('Failed to send message to Discord');
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Alert sent successfully!' }),
        };
    } catch (error) {
        console.error('Error sending message to Discord:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send message to Discord' }),
        };
    }
};
