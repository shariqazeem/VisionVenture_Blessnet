// gemini-handler.bls.ts
export default async function handler(input: any) {
  const { bio, skills, careerGoals, promptType } = input.args || {};

  const prompts: Record<string, string> = {
    "career-recommendations": `Generate detailed career recommendations for a user with bio: '${bio}', skills: '${skills}', and career goals: '${careerGoals}'. Include specific job roles and explain why.`,
    "job-prospects": `What are the top job prospects for someone with the following: Bio: '${bio}', Skills: '${skills}', Career Goals: '${careerGoals}'?`,
    "match-jobs": `Match the following skills to best-fit jobs. Skills: '${skills}', Bio: '${bio}', Career Goals: '${careerGoals}'. Provide top 5 matches.`,
    "learning-resources": `Suggest best learning resources for someone with skills: '${skills}' who wants to achieve: '${careerGoals}'.`,
    "networking-opportunities": `Suggest top networking strategies and platforms for a user with this bio: '${bio}' and goals: '${careerGoals}'.`,
    "assess-skills": `Assess the following skills: '${skills}'. Suggest improvements and possible weak areas.`
  };

  const prompt = prompts[promptType] || prompts["career-recommendations"];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

  return { text };
}
