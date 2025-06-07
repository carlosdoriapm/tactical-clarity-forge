
// Simple in-memory rate limiting store
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Very conservative limit

interface RateLimitResult {
  allowed: boolean;
  waitTime: number;
}

export function checkRateLimit(_supabaseClient: any, userId: string): RateLimitResult {
  const now = Date.now();
  const userRequests = rateLimitStore.get(userId) || [];
  const validRequests = userRequests.filter((timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW);

  let allowed = true;
  let waitTime = 0;

  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    allowed = false;
    const earliest = validRequests[0];
    waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - earliest)) / 1000);
  } else {
    validRequests.push(now);
    rateLimitStore.set(userId, validRequests);
  }

  return { allowed, waitTime };
}
