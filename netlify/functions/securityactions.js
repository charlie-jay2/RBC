exports.handler = async (event) => {
    // Check if the request method is POST
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    // Log the entire event body to see the structure
    console.log("Full Event Body:", event.body);

    let securityCode, webhooks;
    try {
        const body = JSON.parse(event.body); // Parse the request body
        console.log("Parsed Body:", body);

        securityCode = body.securityCode; // Extract the security code
        webhooks = body.webhooks; // Extract the webhooks array

        console.log("Security Code:", securityCode);
        console.log("Webhooks:", webhooks);

        // Validate the input data
        if (!securityCode || !Array.isArray(webhooks) || webhooks.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid request data" })
            };
        }
    } catch (error) {
        console.error("Failed to parse request body:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid request body format" })
        };
    }

    // Set up embed settings based on the security code
    let embedSettings;
    switch (securityCode) {
        case 'codeRed':
            embedSettings = {
                title: "Code Red Alert",
                color: 0xff0000,
                imageUrl: "https://cdn.discordapp.com/emojis/939459951079129109.png"
            };
            break;
        case 'codeAmber':
            embedSettings = {
                title: "Code Amber Alert",
                color: 0xffbf00,
                imageUrl: "https://cdn.discordapp.com/emojis/783279693056212038.png"
            };
            break;
        case 'codeOrange':
            embedSettings = {
                title: "Code Orange Alert",
                color: 0xffa500,
                imageUrl: "https://cdn.discordapp.com/emojis/1297639479053520936.png"
            };
            break;
        case 'codeGreen':
            embedSettings = {
                title: "Code Green Alert",
                color: 0x00ff00,
                imageUrl: "https://cdn.discordapp.com/emojis/1297639479053520936.png"
            };
            break;
        case 'codeBlue':
            embedSettings = {
                title: "Code Blue Alert",
                color: 0x0000ff,
                imageUrl: "https://cdn.discordapp.com/emojis/123456789012345678.png" // Replace with a valid URL for blue alert emoji
            };
            break;
        case 'codeYellow':
            embedSettings = {
                title: "Code Yellow Alert",
                color: 0xffff00, // Yellow color
                imageUrl: "https://cdn.discordapp.com/emojis/123456789012345678.png" // Replace with a valid URL for yellow alert emoji
            };
            break;
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid security code" })
            };
    }

    // Send alerts to webhooks
    try {
        const responses = await Promise.all(webhooks.map(async (webhookURL) => {
            // Use fetch to send the POST request
            const response = await fetch(webhookURL, {
                method: "POST",
                body: JSON.stringify({
                    embeds: [{
                        title: embedSettings.title,
                        color: embedSettings.color,
                        image: { url: embedSettings.imageUrl }
                    }]
                }),
                headers: { "Content-Type": "application/json" },
            });

            // Check for successful response
            if (!response.ok) {
                const errorData = await response.json(); // Read error response
                throw new Error(errorData.error || 'Failed to send message to Discord');
            }

            console.log(`Response from ${webhookURL}:`, response.status);
            return response; // Return the response
        }));

        // Check for failed responses
        const failedResponses = responses.filter(res => res.status !== 200);
        if (failedResponses.length > 0) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Some webhooks failed" })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Alert sent successfully!" })
        };
    } catch (error) {
        console.error("Error sending alerts:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" })
        };
    }
};
