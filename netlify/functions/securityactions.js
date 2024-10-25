const fetch = require("node-fetch");

exports.handler = async (event, context) => {
    if (event.httpMethod === "POST") {
        const { code, message, webhooks } = JSON.parse(event.body);

        // Check if webhooks are provided
        if (!webhooks || webhooks.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No webhooks selected." }),
            };
        }

        try {
            // Loop through selected webhooks and send the message
            for (const webhookUrl of webhooks) {
                await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: `**Security Code:** ${code}\n**Message:** ${message}`,
                    }),
                });
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Message sent successfully!" }),
            };
        } catch (error) {
            console.error("Error sending message:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Error sending message." }),
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
    };
};
