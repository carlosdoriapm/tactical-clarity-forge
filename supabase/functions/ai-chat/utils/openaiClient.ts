
export function createOpenAIClient() {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  
  return {
    chat: {
      completions: {
        create: async (params: any) => {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenAI API Error:', response.status, errorData);
            
            if (response.status === 429) {
              throw new Error("The AI service is currently busy. Please try again in a few minutes.");
            } else if (response.status === 401) {
              throw new Error("AI service authentication failed. Please contact support.");
            } else {
              throw new Error(`AI service error (${response.status}). Please try again later.`);
            }
          }

          return await response.json();
        }
      }
    }
  };
}
