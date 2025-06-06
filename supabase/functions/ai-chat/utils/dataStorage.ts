
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

export async function createWarLogEntry(supabase: any, userProfile: any, combatantProfile: any, content: string, reply: string) {
  // Create enhanced war log entry if this appears to be a mission/decision
  if (content.length > 50 && userProfile) {
    // Extract potential commands from the AI response (basic parsing)
    const commands = {};
    const intensityMatch = reply.match(/intensity[:\s]+(tactical|ruthless|legion)/i);
    const intensity = intensityMatch ? intensityMatch[1].toLowerCase() : 
                     (combatantProfile?.intensity_mode || userProfile.intensity_mode)?.toLowerCase();
    
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

    // Store in the new combatant_war_log table
    if (combatantProfile) {
      await supabase
        .from("combatant_war_log")
        .insert([{
          user_id: userProfile.id,
          profile_id: combatantProfile.id,
          input_text: content,
          recognition: extractRecognition(reply),
          extract: extractDilemma(content),
          decision_map: extractDecisionMap(reply),
          system: Object.keys(commands).length > 0 ? commands : null,
          warning: extractWarning(reply),
          commit: extractCommit(reply),
          intensity_mode: intensity?.toUpperCase() || 'TACTICAL',
          completed: false
        }]);
    }

    // Also store in legacy war_logs table for compatibility
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

function extractRecognition(reply: string): string | null {
  // Extract recognition/empathy phrases from the beginning of the response
  const lines = reply.split('\n');
  const firstLine = lines[0]?.trim();
  if (firstLine && firstLine.length > 10 && firstLine.length < 200) {
    return firstLine;
  }
  return null;
}

function extractDilemma(content: string): string | null {
  // Extract the core dilemma from user input
  return content.length > 500 ? content.substring(0, 500) + "..." : content;
}

function extractDecisionMap(reply: string): any {
  // Extract decision options from the response
  const options = [];
  const lines = reply.split('\n');
  
  for (const line of lines) {
    if (line.match(/^\s*[-•]\s*/) || line.match(/^\s*\d+\.\s*/)) {
      const option = line.replace(/^\s*[-•]\s*/, '').replace(/^\s*\d+\.\s*/, '').trim();
      if (option.length > 5 && option.length < 200) {
        options.push(option);
      }
    }
  }
  
  return options.length > 0 ? { options } : null;
}

function extractWarning(reply: string): string | null {
  // Extract warning/consequence phrases
  const warningPattern = /(warning|consequence|risk|danger|fail)/i;
  const lines = reply.split('\n');
  
  for (const line of lines) {
    if (warningPattern.test(line) && line.length > 20 && line.length < 300) {
      return line.trim();
    }
  }
  return null;
}

function extractCommit(reply: string): string | null {
  // Extract binary instructions/commands
  const commitPattern = /(do this|action|execute|commit|now)/i;
  const lines = reply.split('\n');
  
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (commitPattern.test(line) && line.length > 10 && line.length < 200) {
      return line;
    }
  }
  return null;
}
