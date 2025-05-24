import WebServer from '@blockless/sdk-ts/dist/lib/web';

const server = new WebServer();

// Serve static files from public directory
server.statics('public', '/');

// Add some basic logging to see if server starts
console.log('Starting server...');

// Try different route patterns
server.post('/api', (input) => {
  console.log('API route hit with input:', input);
  return JSON.stringify({ message: 'API route working', timestamp: Date.now() });
});

// Also try with explicit path
server.post('api', (input) => {
  console.log('API route (no slash) hit with input:', input);
  return JSON.stringify({ message: 'API route working (no slash)', timestamp: Date.now() });
});

// Try a GET route as well to test
server.get('/test', () => {
  console.log('Test GET route hit');
  return 'Test route working';
});

console.log('Routes registered, starting server...');
server.start();
console.log('Server start called');