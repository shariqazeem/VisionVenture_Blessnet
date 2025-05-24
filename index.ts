import WebServer from '@blockless/sdk-ts/dist/lib/web';
import handler from './gemini-handler.bls';

const server = new WebServer();

// Serve static files
server.statics('public', '/');

// Mount Gemini API route
server.post('/api', handler);

server.start();
