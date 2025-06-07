const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Very conservative limit

interface RateLimitResult {
  allowed: boolean;
  waitTime?: number;
}

export async function checkRateLimit(supabase: any, userId: string): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  const { data, error } = await supabase
    .from('rate_limits')
    .select('requested_at')
    .eq('user_id', userId)
    .gte('requested_at', windowStart)
    .order('requested_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch rate limit data:', error);
    return { allowed: true };
  }

  if (data.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = data[0].requested_at;
    const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - oldest)) / 1000);
    return { allowed: false, waitTime };
  }

  const { error: insertError } = await supabase
    .from('rate_limits')
    .insert({ user_id: userId, requested_at: now });

  if (insertError) {
    console.error('Failed to record rate limit event:', insertError);
  }

  await supabase
    .from('rate_limits')
    .delete()
    .lt('requested_at', windowStart)
    .eq('user_id', userId);

  return { allowed: true };
}
