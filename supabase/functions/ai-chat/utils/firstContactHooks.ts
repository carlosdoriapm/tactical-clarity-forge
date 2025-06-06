
interface FirstContactHook {
  id: string;
  tone: string;
  message: string;
}

const firstContactMessages: FirstContactHook[] = [
  {
    id: "hook_01",
    tone: "Empathetic + Strong",
    message: "You didn't land here by accident.\nSomething inside you wants more — or to stop drifting.\nLet's begin the file. One question at a time."
  },
  {
    id: "hook_02", 
    tone: "Calm + Commanding",
    message: "You showed up. That's the signal.\nNow I need clarity — not chaos.\nWho are you?"
  },
  {
    id: "hook_03",
    tone: "Quiet + Unyielding", 
    message: "I won't talk to a stranger.\nBefore we engage — I need intel.\nOne question. Then another. Until your file is complete."
  },
  {
    id: "hook_04",
    tone: "Strategic + Personal",
    message: "Most men wait until collapse.\nYou didn't. That matters.\nLet's calibrate. Start with your name."
  },
  {
    id: "hook_05",
    tone: "Minimal + Powerful",
    message: "You're here. That's not nothing.\nWe move forward only with facts.\nFirst: what should I call you?"
  }
];

const fallbackMessage = "You made it here. That already says something.\nI don't lead ghosts. Before I issue a single directive, I need to know who I'm talking to.\n\nOne question at a time. Ready?";

export function getFirstContactMessage(userId: string, previousHookId?: string): string {
  // Create a simple hash from userId to ensure consistent but varied selection
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Filter out the previously used hook to avoid repetition
  let availableMessages = firstContactMessages;
  if (previousHookId) {
    availableMessages = firstContactMessages.filter(msg => msg.id !== previousHookId);
  }
  
  // If no messages available (shouldn't happen), use fallback
  if (availableMessages.length === 0) {
    return fallbackMessage;
  }
  
  // Select message based on hash
  const index = Math.abs(hash) % availableMessages.length;
  return availableMessages[index].message;
}

export function getOnboardingQuestion(step: string): string {
  const questions = {
    "codename": "What should I call you? Codename or first name.",
    "age": "How old are you?",
    "physical_condition": "How's your physical state? Fit, average, injured?",
    "relationship_status": "What's your current relationship status?", 
    "childhood_summary": "Describe your childhood in 3 honest lines.",
    "parents": "Parents — alive? close? absent?",
    "siblings": "Siblings — who shaped you, if anyone?",
    "school_experience": "Your school years — war zone, throne, exile, or neutral?",
    "vice": "What's the dominant vice you're up against?",
    "mission_90_day": "What's your core 90-day mission?",
    "fear_block": "What fear or pattern keeps sabotaging action?",
    "intensity_mode": "Choose your mode: TACTICAL / RUTHLESS / LEGION."
  };
  
  return questions[step] || "Tell me more.";
}
