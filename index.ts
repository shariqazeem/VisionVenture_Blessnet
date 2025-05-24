import WebServer from '@blockless/sdk-ts/dist/lib/web';
import handler from './gemini-handler.bls';

const server = new WebServer();

// Serve static files
server.statics('public', '/');

// Mount Gemini API route - simplified to work with Blockless SDK
server.post('/api', async (input) => {
  try {
    console.log('API called with input:', input);
    
    // Call the handler with the input
    const result = await handler(input);
    
    console.log('Handler result:', result);
    
    // Return the result directly - Blockless will handle JSON serialization
    if (result.error) {
      return {
        error: result.error,
        status: result.status || 500
      };
    } else {
      return {
        text: result.text,
        status: 200
      };
    }
  } catch (error) {
    console.error('Route error:', error);
    return {
      error: 'Internal server error',
      status: 500
    };
  }
});

server.start();