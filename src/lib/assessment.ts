// Assessment restructured into themed buckets
// User picks which group to answer and when — no forced linear march

export interface Question {
  id: string;
  text: string;
  help?: string;
  patterns: string[];
  weights?: Record<string, number>;
}

export interface QuestionGroup {
  id: string;
  title: string;
  emoji: string;
  description: string;
  questions: Question[];
}

export const questionGroups: QuestionGroup[] = [
  {
    id: "daily-life",
    title: "Daily Life",
    emoji: "☀️",
    description: "How your days actually go — energy, focus, getting things done",
    questions: [
      {
        id: "task_start",
        text: "Your phone buzzes with a reminder you set yourself. You look at it, know exactly what it's for, and... you don't move. Not because you forgot. You just can't make yourself start. An hour goes by.",
        help: "It's not laziness. It's like there's an invisible wall between you and the thing.",
        patterns: ["adhd", "anxiety", "depression"],
        weights: { adhd: 3, anxiety: 1, depression: 1 },
      },
      {
        id: "follow_through",
        text: "You discovered a new hobby last Tuesday. Bought all the stuff. Watched tutorials. Told everyone about it. By Saturday, the supplies are sitting in a bag and you've already moved on to something else.",
        patterns: ["adhd", "bipolar"],
        weights: { adhd: 3, bipolar: 1 },
      },
      {
        id: "time_blindness",
        text: "You sit down to scroll for 'just a minute' while something loads. When you look up, two hours have passed. You don't know where they went.",
        patterns: ["adhd", "autism"],
        weights: { adhd: 3, autism: 1 },
      },
      {
        id: "energy_crash",
        text: "You had a productive morning. Got stuff done. Felt okay. Then around 2pm something happens — like a cord gets pulled. You go from functioning to barely able to keep your eyes open.",
        help: "Not gradual tiredness. Like someone literally unplugs you.",
        patterns: ["depression", "adhd", "ptsd"],
        weights: { depression: 2, adhd: 2, ptsd: 1 },
      },
      {
        id: "object_permanence",
        text: "Someone texted you while you were driving. You thought 'I'll reply when I park.' You parked, walked inside, started doing something else, and that text stopped existing in your brain.",
        help: "Out of sight, completely out of mind. Appointments, groceries, messages — same thing.",
        patterns: ["adhd", "autism"],
        weights: { adhd: 3, autism: 1 },
      },
    ],
  },
  {
    id: "inner-world",
    title: "Inner World",
    emoji: "🌙",
    description: "What happens inside your head — thoughts, feelings, the stuff nobody else sees",
    questions: [
      {
        id: "overthinking",
        text: "It's 11pm. You're exhausted. But your brain decided now is the perfect time to replay something you said in a meeting on Tuesday. Word for word. Did you sound weird?",
        help: "Rumination — your brain won't let go of things that already happened.",
        patterns: ["anxiety", "depression", "ptsd"],
        weights: { anxiety: 3, depression: 1, ptsd: 1 },
      },
      {
        id: "anticipatory_worry",
        text: "You have a meeting on Thursday. It's Monday. You're already running through how it could go wrong. You've essentially lived through it three times before it even happens.",
        patterns: ["anxiety", "ptsd"],
        weights: { anxiety: 3, ptsd: 1 },
      },
      {
        id: "motivation_flat",
        text: "Your favorite show just dropped a new season. Three months ago you would've binged it immediately. Now it's been sitting in your queue for two weeks and even hitting play feels like work.",
        patterns: ["depression", "adhd"],
        weights: { depression: 3, adhd: 1 },
      },
      {
        id: "hopelessness",
        text: "A friend sends you a job posting that's perfect for you. You read it. You're qualified. And your first thought is 'what's the point, I probably won't get it anyway.' You can't muster the energy to even try.",
        patterns: ["depression", "ptsd"],
        weights: { depression: 3, ptsd: 1 },
      },
      {
        id: "emotional_regulation",
        text: "Someone uses a slightly off tone with you and suddenly you're fighting back tears. Or a minor inconvenience — like dropping a spoon — triggers a flash of real anger. You know it's too much for the situation.",
        patterns: ["adhd", "autism", "ptsd", "bipolar"],
        weights: { adhd: 2, autism: 2, ptsd: 2, bipolar: 1 },
      },
      {
        id: "racing_thoughts",
        text: "You're trying to fall asleep but your brain is connecting dots at lightning speed. That thing from work connects to this idea which reminds you of a project. You can't slow it down. It's not anxious — it's just fast.",
        patterns: ["bipolar", "adhd", "anxiety"],
        weights: { bipolar: 3, adhd: 1, anxiety: 1 },
      },
    ],
  },
  {
    id: "people-places",
    title: "People & Places",
    emoji: "🫂",
    description: "How you experience being around others and moving through the world",
    questions: [
      {
        id: "social_drain",
        text: "You go to a casual get-together. Everyone's having a good time. But by the time you get home you feel like someone wrung you out like a sponge. You need tomorrow to not exist socially.",
        help: "Not introversion — more like social interaction physically drains your battery.",
        patterns: ["autism", "anxiety", "adhd"],
        weights: { autism: 3, anxiety: 1, adhd: 1 },
      },
      {
        id: "sensory_overload",
        text: "You walk into a restaurant. The music is a little loud, the lights are a bit harsh, someone's wearing strong perfume. You can still function, but it's like all of these things are physically pushing on you.",
        help: "Not annoying — like your body wants to escape the input.",
        patterns: ["autism", "ptsd"],
        weights: { autism: 3, ptsd: 1 },
      },
      {
        id: "masking",
        text: "You're at lunch with coworkers. You're laughing at the right times, making the right faces. But it feels like you're operating a character from inside your own head. By the time you leave, you're exhausted.",
        patterns: ["autism", "adhd"],
        weights: { autism: 3, adhd: 1 },
      },
      {
        id: "literal_thinking",
        text: "Someone says 'sure, whenever' about hanging out. You ask what day works. They look at you funny because apparently 'whenever' meant 'not really.' You genuinely thought it was an open invitation.",
        patterns: ["autism"],
        weights: { autism: 3 },
      },
      {
        id: "physical_anxiety",
        text: "You're sitting at your desk doing something completely normal when your heart starts racing. Your jaw is clenched. You weren't even thinking about anything stressful — your body just went into alert mode.",
        patterns: ["anxiety", "ptsd"],
        weights: { anxiety: 3, ptsd: 2 },
      },
    ],
  },
  {
    id: "patterns-rhythms",
    title: "Patterns & Rhythms",
    emoji: "🔄",
    description: "Your routines, sleep, energy cycles, and what throws you off",
    questions: [
      {
        id: "routine_rupture",
        text: "You always get coffee at the same place on the way to work. Today they were closed. It's a minor thing. You know it's a minor thing. But something about it threw you off and you still feel it three hours later.",
        patterns: ["autism", "adhd", "anxiety"],
        weights: { autism: 3, adhd: 1, anxiety: 1 },
      },
      {
        id: "sleep_issues",
        text: "Sleep is a whole thing. Either you can't fall asleep because your brain won't stop, or you wake up at 3am, or you sleep for 10 hours and still feel like you got hit by a truck. There's no 'normal' sleep night.",
        patterns: ["depression", "anxiety", "adhd", "ptsd", "bipolar"],
        weights: { depression: 2, anxiety: 2, adhd: 1, ptsd: 2, bipolar: 2 },
      },
      {
        id: "energy_extremes",
        text: "Last month you redecorated your entire apartment in three days on four hours of sleep. This week you can barely get off the couch. People keep asking what's different and you don't know how to explain it.",
        help: "Not just good days and bad days. Like two completely different operating systems.",
        patterns: ["bipolar", "depression"],
        weights: { bipolar: 3, depression: 1 },
      },
      {
        id: "special_interests",
        text: "Someone casually mentions a topic you care about. Forty-five minutes later you realize you've been talking nonstop about it. You know an unreasonable amount of detail. You could keep going.",
        patterns: ["autism", "adhd"],
        weights: { autism: 3, adhd: 2 },
      },
      {
        id: "memory_fog",
        text: "You're telling a story and mid-sentence you completely lose the thread. Or you walk into a room and stand there for ten seconds trying to remember why you went in there.",
        help: "Like your brain has a slow memory leak.",
        patterns: ["adhd", "depression", "anxiety", "ptsd"],
        weights: { adhd: 2, depression: 2, anxiety: 1, ptsd: 1 },
      },
    ],
  },
  {
    id: "safety-body",
    title: "Safety & Body",
    emoji: "🛡️",
    description: "How your body responds to the world — startle responses, avoidance, grounding",
    questions: [
      {
        id: "startle_response",
        text: "You're making coffee. Someone walks into the kitchen normally — not sneaking up. Your whole body jumps. Heart slamming. It takes a few seconds to come down. This happens a lot.",
        patterns: ["ptsd", "anxiety"],
        weights: { ptsd: 3, anxiety: 1 },
      },
      {
        id: "avoidance",
        text: "There's a place in your town you never go to. Or a topic you immediately steer away from. Or a type of situation you always find an excuse to skip. You don't think about why — you just have a strong internal 'no' about it.",
        patterns: ["ptsd", "anxiety"],
        weights: { ptsd: 3, anxiety: 2 },
      },
    ],
  },
];

// Answer scale — conversational, not clinical
export const answerScale = [
  { value: 0, label: "Can't relate", desc: "That's not really my life" },
  { value: 1, label: "Sometimes", desc: "I've been there but it's not a regular thing" },
  { value: 2, label: "That's familiar", desc: "This shows up in my life a lot" },
  { value: 3, label: "That's literally me", desc: "You just described my everyday" },
];

export interface AssessmentResult {
  patterns: Record<string, number>;
  topPatterns: string[];
  totalScore: number;
}

export function scoreAssessment(answers: Record<string, number>): AssessmentResult {
  const patternScores: Record<string, number> = {};

  for (const group of questionGroups) {
    for (const question of group.questions) {
      const answerValue = answers[question.id] ?? 0;
      if (answerValue === 0) continue;

      for (const pattern of question.patterns) {
        const weight = question.weights?.[pattern] ?? 1;
        patternScores[pattern] = (patternScores[pattern] ?? 0) + answerValue * weight;
      }
    }
  }

  const sorted = Object.entries(patternScores).sort((a, b) => b[1] - a[1]);
  const topPatterns = sorted.slice(0, 3).map(([p]) => p);
  const totalScore = Object.values(patternScores).reduce((a, b) => a + b, 0);

  return {
    patterns: patternScores,
    topPatterns,
    totalScore,
  };
}

// Pattern metadata for display
export const patternInfo: Record<string, { name: string; theme: string; color: string }> = {
  adhd: { name: "Focus & Follow-Through", theme: "executive-function", color: "#FF6B6B" },
  anxiety: { name: "Worry & Overthinking", theme: "anxiety", color: "#4ECDC4" },
  depression: { name: "Energy & Motivation", theme: "depression", color: "#45B7D1" },
  autism: { name: "Sensory & Social Energy", theme: "sensory-social", color: "#FFA07A" },
  ptsd: { name: "Safety & Regulation", theme: "safety", color: "#98D8C8" },
  bipolar: { name: "Energy & Mood Cycles", theme: "mood-cycles", color: "#DDA0DD" },
};
