export type RelationshipType =
  | "partner"
  | "parent"
  | "best-friend"
  | "sibling"
  | "mentor"
  | "colleague"
  | "child"
  | "long-distance";

export type GiftInput = {
  recipientName: string;
  relationship: RelationshipType;
  occasion: string;
  budget: string;
  personalityTraits: string[];
  emotionalSignals: string[];
  emotionalContext: string;
};

export type GiftResult = {
  emotionalHeadline: string;
  giftDirection: string;
  primaryIdea: string;
  whyItFits: string;
  recommendationStyle: string;
  emotionalStrategy: string;
  deliveryNote: string;
  backupIdeas: string[];
};

export type RelationshipProfile = {
  id: RelationshipType;
  label: string;
  shortLabel: string;
  accent: string;
  gradient: string;
  softGradient: string;
  glow: string;
  tone: string;
  emotionalFrame: string;
  aiPhrasing: string;
  recommendationStyle: string;
  cardCopy: string;
  placeholder: string;
  completionReward: string;
};

export const relationshipProfiles: RelationshipProfile[] = [
  {
    id: "partner",
    label: "Partner",
    shortLabel: "Intimate",
    accent: "#e85d75",
    gradient: "from-rose-500 via-pink-500 to-orange-300",
    softGradient: "from-rose-100 via-pink-50 to-orange-100",
    glow: "shadow-rose-200/70",
    tone: "tender, intimate, memory-rich",
    emotionalFrame: "shared history, affection, vulnerability, and rituals",
    aiPhrasing: "Speak with warmth and emotional closeness, but avoid cliches.",
    recommendationStyle: "romantic keepsakes, shared experiences, private rituals",
    cardCopy: "For love that is built from tiny rituals and remembered details.",
    placeholder: "Someone who remembers tiny details",
    completionReward: "This already feels more personal than a generic romantic gift.",
  },
  {
    id: "parent",
    label: "Parent",
    shortLabel: "Gratitude",
    accent: "#b7791f",
    gradient: "from-amber-500 via-orange-300 to-yellow-200",
    softGradient: "from-amber-100 via-orange-50 to-yellow-100",
    glow: "shadow-amber-200/70",
    tone: "grateful, steady, reverent",
    emotionalFrame: "appreciation, legacy, care, and being truly seen",
    aiPhrasing: "Use grounded language that honors effort without becoming overly sentimental.",
    recommendationStyle: "legacy keepsakes, comfort, family memory, practical care",
    cardCopy: "For someone who may value appreciation more than extravagance.",
    placeholder: "My elder sister",
    completionReward: "Good. The gift can now carry gratitude instead of just occasion value.",
  },
  {
    id: "best-friend",
    label: "Best Friend",
    shortLabel: "Belonging",
    accent: "#0ea5a3",
    gradient: "from-teal-500 via-cyan-400 to-sky-300",
    softGradient: "from-teal-100 via-cyan-50 to-sky-100",
    glow: "shadow-cyan-200/70",
    tone: "playful, loyal, nostalgic",
    emotionalFrame: "inside jokes, chosen-family energy, loyalty, and shared eras",
    aiPhrasing: "Balance humor with emotional sincerity. Keep it alive and specific.",
    recommendationStyle: "memory kits, playful personalization, experience gifts",
    cardCopy: "For the person who knows the unedited version of the story.",
    placeholder: "A friend who hides stress with humor",
    completionReward: "Nice. This can feel like your friendship, not a friendship template.",
  },
  {
    id: "sibling",
    label: "Sibling",
    shortLabel: "Shared roots",
    accent: "#7c3aed",
    gradient: "from-violet-500 via-fuchsia-400 to-rose-300",
    softGradient: "from-violet-100 via-fuchsia-50 to-rose-100",
    glow: "shadow-fuchsia-200/70",
    tone: "familiar, funny, emotionally understated",
    emotionalFrame: "shared childhood, playful loyalty, old references, and quiet care",
    aiPhrasing: "Keep the emotion sincere but not heavy; siblings often prefer meaning with wit.",
    recommendationStyle: "nostalgic callbacks, useful upgrades, playful keepsakes",
    cardCopy: "For a bond that can be teasing and protective at the same time.",
    placeholder: "My elder sister",
    completionReward: "That gives the gift a shared-origin feeling.",
  },
  {
    id: "mentor",
    label: "Mentor",
    shortLabel: "Respect",
    accent: "#2563eb",
    gradient: "from-blue-600 via-indigo-500 to-cyan-300",
    softGradient: "from-blue-100 via-indigo-50 to-cyan-100",
    glow: "shadow-blue-200/70",
    tone: "respectful, composed, specific",
    emotionalFrame: "growth, guidance, dignity, and the impact of their belief",
    aiPhrasing: "Sound mature and precise. Avoid overly casual or intimate framing.",
    recommendationStyle: "elevated utility, thoughtful notes, symbolic professional keepsakes",
    cardCopy: "For someone whose guidance changed your direction.",
    placeholder: "Someone who believed in me",
    completionReward: "Strong. The gift can now express impact without feeling excessive.",
  },
  {
    id: "colleague",
    label: "Colleague",
    shortLabel: "Considerate",
    accent: "#059669",
    gradient: "from-emerald-500 via-lime-400 to-yellow-200",
    softGradient: "from-emerald-100 via-lime-50 to-yellow-100",
    glow: "shadow-emerald-200/70",
    tone: "warm, appropriate, observant",
    emotionalFrame: "respect, everyday support, taste, and useful delight",
    aiPhrasing: "Keep boundaries polished. Make it personal without feeling intimate.",
    recommendationStyle: "tasteful desk upgrades, premium consumables, small experience gifts",
    cardCopy: "For appreciation that should feel thoughtful and well-calibrated.",
    placeholder: "Calm, observant, loves good coffee",
    completionReward: "That helps keep the gesture thoughtful without crossing lines.",
  },
  {
    id: "child",
    label: "Child",
    shortLabel: "Wonder",
    accent: "#f97316",
    gradient: "from-orange-500 via-amber-300 to-lime-200",
    softGradient: "from-orange-100 via-amber-50 to-lime-100",
    glow: "shadow-orange-200/70",
    tone: "encouraging, imaginative, confidence-building",
    emotionalFrame: "wonder, identity, encouragement, and feeling understood",
    aiPhrasing: "Make the gift feel affirming, age-aware, and full of possibility.",
    recommendationStyle: "creative kits, identity-building gifts, experiences, keepsakes",
    cardCopy: "For a gift that says, I notice who you are becoming.",
    placeholder: "Loves space and brave stories",
    completionReward: "Good. The gift can support who they are becoming.",
  },
  {
    id: "long-distance",
    label: "Long-distance",
    shortLabel: "Closeness",
    accent: "#8b5cf6",
    gradient: "from-indigo-500 via-sky-400 to-rose-300",
    softGradient: "from-indigo-100 via-sky-50 to-rose-100",
    glow: "shadow-indigo-200/70",
    tone: "yearning, reassuring, present",
    emotionalFrame: "absence, continuity, anticipation, and feeling close across distance",
    aiPhrasing: "Emphasize presence, rhythm, and emotional continuity across distance.",
    recommendationStyle: "scheduled surprises, sensory keepsakes, shared rituals at a distance",
    cardCopy: "For closeness that has to travel well.",
    placeholder: "We miss ordinary routines",
    completionReward: "That gives the gift a way to shorten the distance.",
  },
];

export const personalityQuestions = [
  {
    id: "seen",
    prompt: "What makes them feel most seen?",
    encouragement: "This is the emotional anchor.",
    options: [
      "Remembering tiny details",
      "Celebrating their effort",
      "Making them laugh",
      "Giving them calm",
    ],
  },
  {
    id: "tone",
    prompt: "What tone would land best?",
    encouragement: "You are shaping the voice of the gift.",
    options: ["Tender", "Playful", "Elegant", "Deeply nostalgic"],
  },
  {
    id: "memory",
    prompt: "Which memory style matters most?",
    encouragement: "This helps the idea feel lived-in.",
    options: [
      "A private shared moment",
      "A family or origin story",
      "A hard season they survived",
      "A future they are excited about",
    ],
  },
  {
    id: "avoid",
    prompt: "What should the gift avoid?",
    encouragement: "Good restraint makes personalization stronger.",
    options: ["Too generic", "Too expensive-looking", "Too sentimental", "Too impractical"],
  },
];

export const getRelationshipProfile = (relationship: RelationshipType) =>
  relationshipProfiles.find((profile) => profile.id === relationship) ??
  relationshipProfiles[0];
