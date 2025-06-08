
// Simplified rate limiting to reduce load
export async function checkRateLimit(supabase: any, userId: string) {
  // Simple check - allow all requests for now to focus on core functionality
  return { 
    allowed: true, 
    waitTime: 0 
  };
}
