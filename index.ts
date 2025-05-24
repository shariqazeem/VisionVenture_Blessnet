import WebServer from '@blockless/sdk-ts/dist/lib/web';
import { handler as geminiHandler } from './gemini-handler.bls'; // Import your handler

const server = new WebServer();

// Serve static files
server.statics('public', '/');

// Mount Gemini API route
server.route('POST', '/api/gemini', geminiHandler);

server.start();
