// Gamification breaks — inserted between question groups to keep engagement up
// Especially important for ADHD/AuDHD users who lose interest in repetitive formats

export interface BreakScreen {
  type: "milestone" | "ranking" | "visual-pick" | "slider";
  title: string;
  subtitle?: string;
  // For ranking: items to drag-sort
  rankItems?: { id: string; label: string; emoji: string }[];
  // For visual-pick: options to choose from
  pickOptions?: { id: string; label: string; emoji: string }[];
  // For slider: question and scale
  sliderQuestion?: string;
  sliderMin?: { label: string; emoji: string };
  sliderMax?: { label: string; emoji: string };
  // Maps answers to patterns (optional — some breaks are just for engagement)
  patternMap?: Record<string, string[]>;
  celebration?: string;
}

export const breakScreens: { afterQuestion: number; screen: BreakScreen }[] = [
  // After question 7 (~1/3 through): Ranking break
  {
    afterQuestion: 7,
    screen: {
      type: "ranking",
      title: "Quick breather 🎯",
      subtitle: "Drag these in order — what drains you the most at the top",
      rankItems: [
        { id: "social", label: "Being around people", emoji: "🫂" },
        { id: "decisions", label: "Making decisions", emoji: "🤔" },
        { id: "transitions", label: "Switching tasks", emoji: "🔄" },
        { id: "mess", label: "Visual clutter / mess", emoji: "🫠" },
        { id: "noise", label: "Loud environments", emoji: "🔊" },
      ],
      patternMap: {
        social: ["autism", "anxiety", "adhd"],
        decisions: ["adhd", "anxiety"],
        transitions: ["autism", "adhd"],
        mess: ["autism", "adhd"],
        noise: ["autism", "ptsd"],
      },
    },
  },
  // After question 14 (~2/3 through): Visual pick break
  {
    afterQuestion: 14,
    screen: {
      type: "visual-pick",
      title: "You're halfway! Pick your vibe 🎨",
      subtitle: "Which of these sounds most like your ideal reset day?",
      pickOptions: [
        { id: "alone", label: "Nobody around. Quiet. A long bath. Maybe a book.", emoji: "🛁" },
        { id: "creative", label: "Deep dive into a project you're obsessed with. No interruptions.", emoji: "🎨" },
        { id: "nature", label: "Outside. Moving your body. Sun on your face.", emoji: "🌳" },
        { id: "social", label: "One or two close people. Good food. Real conversation.", emoji: "🍽️" },
      ],
      patternMap: {
        alone: ["autism", "introvert"],
        creative: ["adhd", "autism"],
        nature: ["depression", "anxiety"],
        social: ["depression"],
      },
      celebration: "Almost there — 8 more to go!",
    },
  },
  // After question 20: Slider break
  {
    afterQuestion: 20,
    screen: {
      type: "slider",
      title: "Last little thing 🎚️",
      subtitle: "Slide to answer",
      sliderQuestion: "How much does your mood swing throughout a typical day?",
      sliderMin: { label: "Rock steady", emoji: "🪨" },
      sliderMax: { label: "Full rollercoaster", emoji: "🎢" },
      patternMap: {
        high: ["bipolar", "adhd", "autism", "ptsd"],
      },
    },
  },
];
