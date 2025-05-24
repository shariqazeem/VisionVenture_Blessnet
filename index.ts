import WebServer from '@blockless/sdk-ts/dist/lib/web';
import { Groq } from 'groq-sdk';

const server = new WebServer();
server.statics('public', '/');

// Groq setup
const groq = new Groq({ apiKey: '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' }); // WARNING: Avoid hardcoding keys!

server.post('/api/groq', async (req, res) => {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const prompt = body?.prompt;

    if (!prompt) {
      return res.status(400).send(JSON.stringify({ error: 'Missing prompt' }));
    }

    const result = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768', // or 'llama3-8b-8192', etc.
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const message = result.choices?.[0]?.message?.content ?? 'No response';
    res.send(JSON.stringify({ text: message }));
  } catch (err) {
    console.error('Groq API error:', err);
    res.status(500).send(JSON.stringify({ error: 'Failed to call Groq API' }));
  }
});

server.start();
