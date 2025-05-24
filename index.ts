import WebServer from '@blockless/sdk-ts/dist/lib/web';

const server = new WebServer();

// Serve static files
server.statics('public', '/');

// Simple test endpoint first
server.post('/api', async (input) => {
  // Return a simple test response to see if this works
  return '{"test": "Hello World", "input_received": true}';
});

server.start();