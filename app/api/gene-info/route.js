export async function POST(request) {
    try {
        // Get the request data from frontend
        const { query } = await request.json();

        console.log("Searching for gene:", query);

        // Forward to the n8n webhook with parameter name "chatInput"
        const response = await fetch('https://pranavreddy.app.n8n.cloud/webhook-test/chat-input', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatInput: query
            }),
            signal: AbortSignal.timeout(15000)
        });

        // Get more detailed error info if the response isn't okay
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'No error details');
            console.error(`N8n API error (${response.status}):`, errorText);
            throw new Error(`N8n API responded with status: ${response.status}`);
        }

        // Get the response from n8n
        const n8nResponse = await response.json();
        console.log("N8n response received:", n8nResponse ? "data received" : "no data");

        // Return the raw n8n response to be processed by the frontend
        return Response.json(n8nResponse);

    } catch (error) {
        console.error('Error processing gene query:', error);

        let errorMessage = "Failed to process gene query";
        let statusCode = 500;

        if (error.name === 'AbortError') {
            errorMessage = "Request to n8n timed out. Please try again.";
            statusCode = 504;
        } else if (error.message && error.message.includes('API responded with status')) {
            errorMessage = error.message;
            statusCode = 502;
        }

        return Response.json({ error: errorMessage }, { status: statusCode });
    }
}