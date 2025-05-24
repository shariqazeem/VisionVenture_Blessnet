import WebServer from '@blockless/sdk-ts/dist/lib/web';

const server = new WebServer();

// Groq API configuration - hardcoded since process.env is not available
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Helper function to make direct HTTP calls to Groq API
async function callGroqAPI(prompt, maxTokens = 1000) {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      content: data.choices[0]?.message?.content || 'No response available'
    };
  } catch (error) {
    console.error('Groq API Error:', error);
    return {
      success: false,
      error: error.message || 'API call failed'
    };
  }
}

// Career recommendations endpoint
server.post('/api/career-recommendations', async (req, res) => {
  const { bio, skills, careerGoals } = req.body;
  
  const prompt = `Generate detailed career recommendations for a user with bio: '${bio}', skills: '${skills}', and career goals: '${careerGoals}'. Include specific job roles and why they are suitable.`;
  
  const result = await callGroqAPI(prompt);
  
  if (result.success) {
    res.json({ 
      success: true, 
      content: result.content 
    });
  } else {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get career recommendations',
      details: result.error
    });
  }
});

// Job prospects endpoint
server.post('/api/job-prospects', async (req, res) => {
  const { skills, careerGoals } = req.body;
  
  const prompt = `Provide job prospects and market outlook for a user with skills: '${skills}' and career goals: '${careerGoals}'. Highlight growth areas and competitive advantages.`;
  
  const result = await callGroqAPI(prompt);
  
  if (result.success) {
    res.json({ 
      success: true, 
      content: result.content 
    });
  } else {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get job prospects',
      details: result.error
    });
  }
});

// Skills assessment endpoint
server.post('/api/assess-skills', async (req, res) => {
  const { skills, careerGoals } = req.body;
  
  const prompt = `Assess the skills of a user with skills: '${skills}' and suggest specific areas for improvement to align with career goals: '${careerGoals}'.`;
  
  const result = await callGroqAPI(prompt);
  
  if (result.success) {
    res.json({ 
      success: true, 
      content: result.content 
    });
  } else {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to assess skills',
      details: result.error
    });
  }
});

// Skills assessment chart data endpoint
server.post('/api/skill-chart-data', async (req, res) => {
  const { bio, skills, careerGoals } = req.body;
  
  const prompt = `
Based on this user profile, extract up to five key skills and rate each on a scale 1=Beginner,2=Intermediate,3=Advanced.
Return ONLY a valid JSON object in this exact format:
{"labels":["skill1","skill2","skill3","skill4","skill5"],"data":[1,2,3,2,1]}

User bio: "${bio}"
Skills: "${skills}"
Career goals: "${careerGoals}"

Response must be valid JSON only, no additional text.
  `.trim();
  
  const result = await callGroqAPI(prompt, 300);
  
  if (result.success) {
    try {
      // Extract JSON from response
      const txt = result.content;
      const match = txt.match(/(\{[\s\S]*\})/);
      const skillData = match ? JSON.parse(match[0]) : { 
        labels: ['Communication', 'Problem Solving', 'Teamwork', 'Adaptability', 'Leadership'], 
        data: [2, 2, 1, 2, 1] 
      };
      
      res.json({ 
        success: true, 
        data: skillData 
      });
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      // Fallback data if parsing fails
      res.json({ 
        success: true, 
        data: { 
          labels: ['Communication', 'Problem Solving', 'Teamwork', 'Adaptability', 'Leadership'], 
          data: [2, 2, 1, 2, 1] 
        }
      });
    }
  } else {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get skill chart data',
      details: result.error
    });
  }
});

// Job matching endpoint
server.post('/api/match-jobs', async (req, res) => {
  const { bio, skills, careerGoals } = req.body;
  
  const prompt = `Match job opportunities for a user with bio: '${bio}', skills: '${skills}', and career goals: '${careerGoals}'. Provide job titles, required skills, and match strength.`;
  
  const result = await callGroqAPI(prompt);
  
  if (result.success) {
    res.json({ 
      success: true, 
      content: result.content 
    });
  } else {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to match jobs',
      details: result.error
    });
  }
});

// Learning resources endpoint
server.post('/api/learning-resources', async (req, res) => {
  const { skills, careerGoals } = req.body;
  
  const prompt = `Recommend learning resources (courses, books, communities) for a user with skills: '${skills}' and career goals: '${careerGoals}'.`;
  
  const result = await callGroqAPI(prompt);
  
  if (result.success) {
    res.json({ 
      success: true, 
      content: result.content 
    });
  } else {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get learning resources',
      details: result.error
    });
  }
});

// Networking opportunities endpoint
server.post('/api/networking-opportunities', async (req, res) => {
  const { bio, careerGoals } = req.body;
  
  const prompt = `Suggest networking opportunities (events, online communities, organizations) for a user with bio: '${bio}' and career goals: '${careerGoals}'.`;
  
  const result = await callGroqAPI(prompt);
  
  if (result.success) {
    res.json({ 
      success: true, 
      content: result.content 
    });
  } else {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get networking opportunities',
      details: result.error
    });
  }
});

// Health check endpoint
server.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running with direct Groq HTTP integration',
    timestamp: new Date().toISOString()
  });
});

// Serve static files
server.statics('public', '/');

// Start the server
server.start();
console.log('Server started with direct Groq HTTP API integration');