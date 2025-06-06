
export async function callOpenAI(apiKey: string, prompt: string, counselorPrompt: string) {
  console.log('Making OpenAI API request...');

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: counselorPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenAI API Error:', response.status, errorData);
    
    if (response.status === 429) {
      throw new Error("The AI service is currently busy. Please try again in a few minutes.");
    } else {
      throw new Error(`AI service error (${response.status}). Please try again.`);
    }
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid response from AI service. Please try again.");
  }
  
  return data.choices[0].message.content;
}
