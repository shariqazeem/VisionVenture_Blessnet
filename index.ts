import WebServer from '@blockless/sdk-ts/dist/lib/web';
import handler from './gemini-handler.bls';

const server = new WebServer();

// Serve static files
server.statics('public', '/');

// Mount Gemini API route - return clean JSON only
server.post('/api', async (input) => {
  try {
    // Call the handler with the input (no console.log to avoid polluting response)
    const result = await handler(input);
    
    // Return clean JSON response
    if (result.error) {
      return JSON.stringify({ error: result.error });
    } else {
      return JSON.stringify({ text: result.text });
    }
  } catch (error) {
    return JSON.stringify({ error: 'Internal server error' });
  }
});

server.start();