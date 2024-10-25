const fetch = require("node-fetch");

exports.handler = async (event, context) => {
    const { code, message, webhooks } = JSON.parse(event.body);
    const DISCORD_WEBHOOK_URL1 = process.env.DISCORD_WEBHOOK_URL1;
    const DISCORD_WEBHOOK_URL2 = process.env.DISCORD_WEBHOOK_URL2;
    const DISCORD_WEBHOOK_URL3 = process.env.DISCORD_WEBHOOK_URL3;

    // Map webhook values to their respective URLs
    const webhookMap = {
        webhook1: DISCORD_WEBHOOK_URL1,
        webhook2: DISCORD_WEBHOOK_URL2,
        webhook3: DISCORD_WEBHOOK_URL3,
    };

    // Create an array to hold promises
    const promises = webhooks.map(async (webhook) => {
        const webhookUrl = webhookMap[webhook];
        if (!webhookUrl) return;

        const embed = {
            content: message,
            embeds: [
                {
                    title: `Security Alert: ${code}`,
                    description: message,
                    color: getColorCode(code),
                },
            ],
        };

        // Send the webhook
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(embed),
        });

        return response.ok;
    });

    // Await all promises to complete
    await Promise.all(promises);

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
    };
};

// Helper function to get color codes based on the code
const getColorCode = (code) => {
    switch (code) {
        case "codeGreen":
            return 0x00ff00; // Green
        case "codeYellow":
            return 0xffff00; // Yellow
        case "codeBlue":
            return 0x0000ff; // Blue
        case "codeRed":
            return 0xff0000; // Red
        case "codePurple":
            return 0x800080; // Purple
        default:
            return 0xffffff; // White
    }
};
