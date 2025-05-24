import WebServer from '@blockless/sdk-ts/dist/lib/web';
import { Groq } from 'groq-sdk';

const server = new WebServer();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY // Make sure to set this environment variable
});

// Career recommendations endpoint
server.post('/api/career-recommendations', async (req, res) => {
  try {
    const { bio, skills, careerGoals } = req.body;
    
    const prompt = `Generate detailed career recommendations for a user with bio: '${bio}', skills: '${skills}', and career goals: '${careerGoals}'. Include specific job roles and why they are suitable.`;
    
    const result = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    res.json({ 
      success: true, 
      content: result.choices[0]?.message?.content || 'No recommendations available' 
    });
  } catch (error) {
    console.error('Career recommendations error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get career recommendations' 
    });
  }
});

// Job prospects endpoint
server.post('/api/job-prospects', async (req, res) => {
  try {
    const { skills, careerGoals } = req.body;
    
    const prompt = `Provide job prospects and market outlook for a user with skills: '${skills}' and career goals: '${careerGoals}'. Highlight growth areas and competitive advantages.`;
    
    const result = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    res.json({ 
      success: true, 
      content: result.choices[0]?.message?.content || 'No job prospects available' 
    });
  } catch (error) {
    console.error('Job prospects error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get job prospects' 
    });
  }
});

// Skills assessment endpoint
server.post('/api/assess-skills', async (req, res) => {
  try {
    const { skills, careerGoals } = req.body;
    
    const prompt = `Assess the skills of a user with skills: '${skills}' and suggest specific areas for improvement to align with career goals: '${careerGoals}'.`;
    
    const result = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    res.json({ 
      success: true, 
      content: result.choices[0]?.message?.content || 'No assessment available' 
    });
  } catch (error) {
    console.error('Skills assessment error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to assess skills' 
    });
  }
});

// Skills assessment chart data endpoint
server.post('/api/skill-chart-data', async (req, res) => {
  try {
    const { bio, skills, careerGoals } = req.body;
    
    const prompt = `
Based on this user profile, extract up to five key skills
and rate each on a scale 1=Beginner,2=Intermediate,3=Advanced.
Return *only* a JSON object:
{"labels":[skill1,skill2…],"data":[rating1,rating2…]}

User bio: "${bio}"
Skills: "${skills}"
Career goals: "${careerGoals}"
    `.trim();
    
    const result = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });
    
    const txt = result.choices[0]?.message?.content || '';
    const match = txt.match(/(\{[\s\S]*\})/);
    const skillData = match ? JSON.parse(match[0]) : { labels: [], data: [] };
    
    res.json({ 
      success: true, 
      data: skillData 
    });
  } catch (error) {
    console.error('Skill chart data error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get skill chart data' 
    });
  }
});

// Job matching endpoint
server.post('/api/match-jobs', async (req, res) => {
  try {
    const { bio, skills, careerGoals } = req.body;
    
    const prompt = `Match job opportunities for a user with bio: '${bio}', skills: '${skills}', and career goals: '${careerGoals}'. Provide job titles, required skills, and match strength.`;
    
    const result = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    res.json({ 
      success: true, 
      content: result.choices[0]?.message?.content || 'No job matches available' 
    });
  } catch (error) {
    console.error('Job matching error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to match jobs' 
    });
  }
});

// Learning resources endpoint
server.post('/api/learning-resources', async (req, res) => {
  try {
    const { skills, careerGoals } = req.body;
    
    const prompt = `Recommend learning resources (courses, books, communities) for a user with skills: '${skills}' and career goals: '${careerGoals}'.`;
    
    const result = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    res.json({ 
      success: true, 
      content: result.choices[0]?.message?.content || 'No resources available' 
    });
  } catch (error) {
    console.error('Learning resources error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get learning resources' 
    });
  }
});

// Networking opportunities endpoint
server.post('/api/networking-opportunities', async (req, res) => {
  try {
    const { bio, careerGoals } = req.body;
    
    const prompt = `Suggest networking opportunities (events, online communities, organizations) for a user with bio: '${bio}' and career goals: '${careerGoals}'.`;
    
    const result = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    res.json({ 
      success: true, 
      content: result.choices[0]?.message?.content || 'No networking opportunities available' 
    });
  } catch (error) {
    console.error('Networking opportunities error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get networking opportunities' 
    });
  }
});

// Serve static files
server.statics('public', '/');

// Start the server
server.start();
console.log('Server started with Groq API integration');