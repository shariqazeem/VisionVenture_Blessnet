import WebServer from '@blockless/sdk-ts/dist/lib/web';

const server = new WebServer();

// Serve static files from public directory
server.statics('public', '/');

console.log('Starting server...');

// Combined API handler in the same file
server.post('/api', async (input) => {
  try {
    console.log('API route hit!');
    console.log('Input received:', JSON.stringify(input, null, 2));
    
    // Handle the input structure from Blockless
    let requestData;
    if (input.body) {
      requestData = input.body;
    } else if (input.args) {
      requestData = input.args;
    } else {
      requestData = input;
    }
    
    console.log('Request data:', JSON.stringify(requestData, null, 2));
    
    const { bio, skills, careerGoals, promptType } = requestData;

    // Validate required parameters
    if (!promptType) {
      const errorResponse = JSON.stringify({ 
        error: 'Missing promptType parameter'
      });
      console.log('Returning error:', errorResponse);
      return errorResponse;
    }

    const prompts = {
      "career-recommendations": `Generate detailed career recommendations for a user with bio: '${bio}', skills: '${skills}', and career goals: '${careerGoals}'. Include specific job roles and explain why.`,
      "job-prospects": `What are the top job prospects for someone with the following: Bio: '${bio}', Skills: '${skills}', Career Goals: '${careerGoals}'?`,
      "match-jobs": `Match the following skills to best-fit jobs. Skills: '${skills}', Bio: '${bio}', Career Goals: '${careerGoals}'. Provide top 5 matches.`,
      "learning-resources": `Suggest best learning resources for someone with skills: '${skills}' who wants to achieve: '${careerGoals}'.`,
      "networking-opportunities": `Suggest top networking strategies and platforms for a user with this bio: '${bio}' and goals: '${careerGoals}'.`,
      "assess-skills": `Assess the following skills: '${skills}'. Suggest improvements and possible weak areas.`
    };

    const prompt = prompts[promptType] || prompts["career-recommendations"];

    // Replace with your actual Gemini API key
    const API_KEY = 'AIzaSyDNeMYy5q3mGJv7-Bj6KMwPmDL6f51RJ9s';
    
    if (API_KEY === 'AIzaSyDNeMYy5q3mGJv7-Bj6KMwPmDL6f51RJ9s') {
      const errorResponse = JSON.stringify({
        error: 'Gemini API key not configured. Please set your API key in index.ts'
      });
      console.log('Returning API key error:', errorResponse);
      return errorResponse;
    }

    console.log('Making request to Gemini API...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    console.log('Gemini API response status:', response.status);

    // Check if the response is ok
    if (!response.ok) {
      const errorResponse = JSON.stringify({
        error: `Gemini API error: ${response.status} ${response.statusText}`
      });
      console.log('Gemini API error:', errorResponse);
      return errorResponse;
    }

    const data = await response.json();
    console.log('Gemini API data received');
    
    // Check if the response has the expected structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      const errorResponse = JSON.stringify({
        error: 'Unexpected response from Gemini API'
      });
      console.log('Unexpected response structure:', errorResponse);
      return errorResponse;
    }

    const text = data.candidates[0].content.parts[0]?.text || 'No response generated';
    
    const successResponse = JSON.stringify({ text });
    console.log('Returning success response (length):', successResponse.length);
    return successResponse;

  } catch (error) {
    const errorResponse = JSON.stringify({
      error: `Server error: ${error.message}`
    });
    console.log('Caught error:', errorResponse);
    return errorResponse;
  }
});

// Test route to verify server is working
server.get('/test', () => {
  console.log('Test GET route hit');
  return 'Test route working - server is alive!';
});

console.log('Routes registered, starting server...');
server.start();
console.log('Server start called');