
async function testAll() {
  const groqKey = process.env.GROQ_API_KEY;
  const orKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GOOGLE_API_KEY;

  const sysPrompt = `
      You are an elite full-stack web designer specializing in high-performance career portfolios.
      TASK: Generate a COMPLETE, SINGLE-FILE HTML portfolio based on the user's career data and the specified theme.
      
      RULES:
      1. RETURN JSON ONLY: { "html": "..." }
  `;
  const userPrompt = `
      User Data: {}
      Theme requested: minimal-dev
      Instructions: Create a hero.
  `;
  const messages = [{role: 'system', content: sysPrompt}, {role:'user', content: userPrompt}];

  // Groq
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      }),
    });
    console.log('Groq status:', res.status, await res.text());
  } catch (e) {
    console.error('Groq fetch error:', e);
  }

  // OpenRouter
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${orKey}`,
        'HTTP-Referer': 'https://dreamsync-ruddy.vercel.app',
        'X-Title': 'DreamSync AI',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages,
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      }),
    });
    console.log('OpenRouter status:', res.status, await res.text());
  } catch (e) {
    console.error('OpenRouter fetch error:', e);
  }
}

testAll();
