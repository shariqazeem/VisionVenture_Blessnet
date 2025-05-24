import WebServer from '@blockless/sdk-ts/dist/lib/web';
import handler from './gemini-handler.bls';

const server = new WebServer();

// Serve static files
server.statics('public', '/');

// Mount Gemini API route - return proper JSON response
server.post('/api', async (input) => {
  try {
    console.log('API called with input:', JSON.stringify(input, null, 2));
    
    // Call the handler with the input
    const result = await handler(input);
    
    console.log('Handler result:', JSON.stringify(result, null, 2));
    
    // Ensure we return a proper JSON response
    const response = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.error ? { error: result.error } : { text: result.text }),
      status: result.status || (result.error ? 500 : 200)
    };
    
    return response;
  } catch (error) {
    console.error('Route error:', error);
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' }),
      status: 500
    };
  }
});

server.start();