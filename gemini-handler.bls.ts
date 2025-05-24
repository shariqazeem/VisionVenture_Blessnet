// gemini-handler.bls.ts
export default async function handler(input: any) {
  try {
    console.log('Handler input:', input);
    
    // Handle different input structures from Blockless
    let requestData;
    if (input.body) {
      // If body is a string, parse it
      requestData = typeof input.body === 'string' ? JSON.parse(input.body) : input.body;
    } else if (input.args) {
      requestData = input.args;
    } else {
      requestData = input;
    }
    
    const { bio, skills, careerGoals, promptType } = requestData;

    // Validate required parameters
    if (!promptType) {
      return { 
        error: 'Missing promptType parameter',
        status: 400 
      };
    }

    const prompts: Record<string, string> = {
      "career-recommendations": `Generate detailed career recommendations for a user with bio: '${bio}', skills: '${skills}', and career goals: '${careerGoals}'. Include specific job roles and explain why.`,
      "job-prospects": `What are the top job prospects for someone with the following: Bio: '${bio}', Skills: '${skills}', Career Goals: '${careerGoals}'?`,
      "match-jobs": `Match the following skills to best-fit jobs. Skills: '${skills}', Bio: '${bio}', Career Goals: '${careerGoals}'. Provide top 5 matches.`,
      "learning-resources": `Suggest best learning resources for someone with skills: '${skills}' who wants to achieve: '${careerGoals}'.`,
      "networking-opportunities": `Suggest top networking strategies and platforms for a user with this bio: '${bio}' and goals: '${careerGoals}'.`,
      "assess-skills": `Assess the following skills: '${skills}'. Suggest improvements and possible weak areas.`
    };

    const prompt = prompts[promptType] || prompts["career-recommendations"];

    // Replace YOUR_API_KEY with your actual API key
    const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDNeMYy5q3mGJv7-Bj6KMwPmDL6f51RJ9s';
    
    if (API_KEY === 'AIzaSyDNeMYy5q3mGJv7-Bj6KMwPmDL6f51RJ9s' || !API_KEY) {
      return {
        error: 'Gemini API key not configured',
        status: 500
      };
    }

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

    // Check if the response is ok
    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      return {
        error: `Gemini API error: ${response.status} ${response.statusText}`,
        status: response.status
      };
    }

    const data = await response.json();
    
    // Check if the response has the expected structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini API response structure:', data);
      return {
        error: 'Unexpected response from Gemini API',
        status: 500
      };
    }

    const text = data.candidates[0].content.parts[0]?.text || 'No response generated';

    return { 
      text,
      status: 200 
    };

  } catch (error) {
    console.error('Handler error:', error);
    return {
      error: `Server error: ${error.message}`,
      status: 500
    };
  }
}