
export async function storeChatMessages(supabase: any, userId: string, userMessage: string, aiReply: string) {
  const { error } = await supabase
    .from("chats")
    .insert([
      { user_id: userId, role: "user", content: userMessage },
      { user_id: userId, role: "assistant", content: aiReply }
    ]);

  if (error) {
    console.error("Error storing chat:", error);
  }
}

export async function createWarLogEntry(supabase: any, userProfile: any, content: string, reply: string) {
  // Create enhanced war log entry if this appears to be a mission/decision
  if (content.length > 50 && userProfile) {
    // Extract potential commands from the AI response (basic parsing)
    const commands = {};
    const intensityMatch = reply.match(/intensity[:\s]+(tactical|ruthless|legion)/i);
    const intensity = intensityMatch ? intensityMatch[1].toLowerCase() : userProfile.intensity_mode?.toLowerCase();
    
    // Look for common command patterns in the response
    if (reply.toLowerCase().includes('workout') || reply.toLowerCase().includes('exercise')) {
      commands['body'] = true;
    }
    if (reply.toLowerCase().includes('mindset') || reply.toLowerCase().includes('mental')) {
      commands['mindset'] = true;
    }
    if (reply.toLowerCase().includes('environment') || reply.toLowerCase().includes('space')) {
      commands['environment'] = true;
    }

    await supabase
      .from("war_logs")
      .insert([{
        user_id: userProfile.id,
        dilemma: content,
        decision_path: reply.substring(0, 500), // Store first 500 chars of response
        commands: Object.keys(commands).length > 0 ? commands : null,
        intensity: intensity || null,
        result: null // Will be updated later when user provides feedback
      }]);
  }
}
