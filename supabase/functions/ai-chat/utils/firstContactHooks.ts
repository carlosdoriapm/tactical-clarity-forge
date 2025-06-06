
interface OnboardingStep {
  id: string;
  prompt: string;
}

interface OnboardingConfig {
  enabled: boolean;
  first_message: string;
  steps: OnboardingStep[];
}

const onboardingConfig: OnboardingConfig = {
  enabled: true,
  first_message: "You showed up. That matters more than most people know.\n\nBefore I offer anything — I need to understand who I'm speaking to.\n\nOne question at a time. Let's start simple:\n\nWhat should I call you?",
  steps: [
    { id: "codename", prompt: "What should I call you?" },
    { id: "age", prompt: "How old are you?" },
    { id: "physical_condition", prompt: "How would you describe your current physical condition?" },
    { id: "relationship_status", prompt: "What's your relationship status?" },
    { id: "childhood_summary", prompt: "If you had to describe your childhood in 3 honest lines, what would they be?" },
    { id: "parents", prompt: "What's your connection like with your parents?" },
    { id: "siblings", prompt: "Any siblings? If so, what kind of impact did they have on you?" },
    { id: "school_experience", prompt: "How were your school years — smooth, difficult, or something else?" },
    { id: "vice", prompt: "What's one habit or behavior you've been wanting to change lately?" },
    { id: "mission_90_day", prompt: "If you had 90 days to shift your life — what would you focus on?" },
    { id: "fear_block", prompt: "Is there any recurring fear or pattern that tends to block you?" },
    { id: "intensity_mode", prompt: "Lastly — how do you prefer I speak to you:\n• Calm and focused (TACTICAL)\n• Direct and sharp (RUTHLESS)\n• No-nonsense, all-in (LEGION)" }
  ]
};

export function getFirstContactMessage(): string {
  return onboardingConfig.first_message;
}

export function getOnboardingQuestion(step: string): string {
  const stepConfig = onboardingConfig.steps.find(s => s.id === step);
  return stepConfig ? stepConfig.prompt : "Tell me more.";
}

export function getNextOnboardingStep(userProfile: any): string | null {
  for (const step of onboardingConfig.steps) {
    if (!userProfile[step.id]) {
      return step.id;
    }
  }
  return null; // All steps complete
}
