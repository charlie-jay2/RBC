// .netlify/functions/triggerReload.js

let shouldReload = false;

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        shouldReload = true; // Set reload to true on POST request
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Reload triggered!' }),
        };
    }

    // Check if reload is needed
    const response = { shouldReload };
    shouldReload = false; // Reset after checking
    return {
        statusCode: 200,
        body: JSON.stringify(response),
    };
};
