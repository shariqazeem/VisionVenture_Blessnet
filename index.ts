import WebServer from '@blockless/sdk-ts/dist/lib/web';
import handler from './gemini-handler.bls';

const server = new WebServer();

// Serve static files
server.statics('public', '/');

// Alternative approach - return string directly
server.post('/api', async (input) => {
  try {
    console.log('API called with input:', JSON.stringify(input, null, 2));
    
    // Call the handler with the input
    const result = await handler(input);
    
    console.log('Handler result:', JSON.stringify(result, null, 2));
    
    // Return stringified JSON directly
    if (result.error) {
      return JSON.stringify({ error: result.error });
    } else {
      return JSON.stringify({ text: result.text });
    }
  } catch (error) {
    console.error('Route error:', error);
    return JSON.stringify({ error: 'Internal server error' });
  }
});

server.start();