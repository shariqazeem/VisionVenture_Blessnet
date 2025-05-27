import WebServer from '@blockless/sdk-ts/dist/lib/web';

const server = new WebServer();

// Serve static files (optional)
server.statics('public', '/');

server.post('/api/gemini', async (req, res) => {
  try {
    let body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { prompt } = body;

    const gemini = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDNeMYy5q3mGJv7-Bj6KMwPmDL6f51RJ9s',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await gemini.json();
    res.send(JSON.stringify(data));
  } catch (err) {
    res.send(JSON.stringify({ error: 'Proxy error', message: err.message }));
  }
});


// Start the server
server.start();
