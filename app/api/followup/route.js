export async function POST(request) {
    try {
        // Get the request data from frontend
        const { query, previousQuery } = await request.json();

        // Forward to the n8n webhook with parameter name "chatInput"
        const response = await fetch('https://pranavreddy.app.n8n.cloud/webhook-test/followup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatInput: query,
                previousQuery: previousQuery
            }),
            signal: AbortSignal.timeout(15000)
        });

        if (!response.ok) {
            throw new Error(`n8n API responded with status: ${response.status}`);
        }

        // Get the response from n8n - this will be an array with an output property
        const n8nResponse = await response.json();

        // Extract the output from the array format
        const output = Array.isArray(n8nResponse) && n8nResponse.length > 0
            ? n8nResponse[0].output || "No additional information found."
            : n8nResponse.output || "No additional information found.";

        // Return a consistent format for the frontend
        return Response.json({
            message: output,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error processing followup query:', error);

        let errorMessage = "Failed to process follow-up query";
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