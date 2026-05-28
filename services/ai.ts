import {
  GiftInput,
  GiftResult,
  RelationshipType,
  getRelationshipProfile,
} from "@/lib/gift/schema";

type OccasionStrategy = {
  frame: string;
  risk: string;
  delivery: string;
};

type RelationshipStrategy = {
  insight: string;
  primary: string;
  why: string;
  delivery: string;
  note: string;
  backups: string[];
};

const relationshipStrategies: Record<RelationshipType, RelationshipStrategy> = {
  partner: {
    insight:
      "They are unlikely to be moved by grandeur alone. The emotional value is in proof that you remember the small private world you share.",
    primary:
      "Build a private memory box with three layers: one object from an early chapter, one note about who they are now, and one plan for something you still want to experience together.",
    why:
      "For a partner, the gift should not just say I love you. It should say I have been paying attention while our life was happening.",
    delivery:
      "Give it in a quiet moment, not in front of people. Let the first note be simple and specific.",
    note:
      "I wanted this to feel less like a gift and more like proof that I have been noticing our life while it is happening.",
    backups: [
      "a printed photo timeline with one sentence under each image",
      "a date built around a memory they mentioned once",
      "a set of future-open letters for ordinary hard days",
    ],
  },
  parent: {
    insight:
      "They may not need another nice object. They are more likely to feel the gift if it names effort they quietly assumed went unnoticed.",
    primary:
      "Create a gratitude keepsake built around one lesson, one sacrifice, and one ordinary habit of theirs that shaped you.",
    why:
      "Parent gifts land when they turn appreciation from a general thank you into evidence: this is what I saw, this is what stayed with me.",
    delivery:
      "Do not overperform the emotion. Hand it over with a grounded line about one thing they did that still matters.",
    note:
      "I do not say this enough, but there are things I carry well because you carried them first.",
    backups: [
      "a framed family photo with a handwritten note on the back",
      "a comfort day planned around their pace, not yours",
      "a recipe, song, or place from home turned into a keepsake",
    ],
  },
  "best-friend": {
    insight:
      "They probably do not want polished sentiment. The best gift should carry the proof of shared history: the joke, the loyalty, and the fact that you know what sits underneath both.",
    primary:
      "Make an inside-story kit: one funny artifact, one photo or note from a hard season, and one small object that says I still know exactly who you are.",
    why:
      "Best-friend gifts work when humor opens the door and sincerity walks in quietly after it.",
    delivery:
      "Let the first reaction be laughter. Then include one sentence they can reread when they need to feel less alone.",
    note:
      "This is partly a joke because we are us, but mostly it is proof that I am still grateful I get to know you this well.",
    backups: [
      "a custom memory deck with prompts only the two of you would understand",
      "a surprise plan built around an old shared obsession",
      "a care package disguised as a joke",
    ],
  },
  sibling: {
    insight:
      "A sibling gift should feel familiar before it feels emotional. The meaning works best when it is tucked inside a callback, not announced too heavily.",
    primary:
      "Choose a childhood callback and upgrade it into something useful now: a framed old reference, a recreated snack-night box, or a practical item engraved with a line only they would understand.",
    why:
      "Siblings often trust affection more when it arrives with a wink. The right gift says I know where we came from without forcing a speech.",
    delivery:
      "Keep the handoff casual. Put the real emotional sentence in the card so they can absorb it privately.",
    note:
      "This made me think of where we came from, and of the fact that I am still quietly glad it was with you.",
    backups: [
      "a useful upgrade tied to an old shared habit",
      "a small archive of childhood photos with dry captions",
      "a planned sibling day with one nostalgic stop",
    ],
  },
  mentor: {
    insight:
      "The gift should respect the boundary of the relationship while still naming impact clearly. Too personal can feel awkward; too generic can feel forgettable.",
    primary:
      "Give an elevated everyday object with a short note naming the exact decision, skill, or confidence they helped you build.",
    why:
      "Mentor gifts are strongest when the object is restrained and the words carry the weight.",
    delivery:
      "Keep the note concise and specific. Avoid flattery; describe the change their guidance made possible.",
    note:
      "I wanted to mark the specific impact your guidance had on me, not with a grand gesture, but with something considered.",
    backups: [
      "a refined desk object connected to their craft",
      "a book with a margin note about what they helped you understand",
      "a handwritten impact letter paired with a small premium consumable",
    ],
  },
  colleague: {
    insight:
      "The gift needs warmth with good boundaries. It should show that you notice their presence without making the gesture feel intimate or performative.",
    primary:
      "Choose a tasteful workday upgrade tied to how they make the environment better: calm, humor, reliability, taste, or care.",
    why:
      "For a colleague, emotional intelligence is restraint. The best recommendation feels observant, useful, and easy to receive.",
    delivery:
      "Give it with a short line about what they consistently bring to the team.",
    note:
      "I wanted to acknowledge the way you make the work feel better without making a big production of it.",
    backups: [
      "a premium coffee or tea set matched to their routine",
      "a clean desk object with a small note",
      "a low-pressure experience gift they can use on their own time",
    ],
  },
  child: {
    insight:
      "The gift should not only entertain them. It should mirror back something true about who they are becoming.",
    primary:
      "Build a confidence kit around their current fascination, with one playful item, one challenge they can master, and one note that names the quality you see growing in them.",
    why:
      "Children remember gifts that make them feel recognized, not just occupied.",
    delivery:
      "Let the reveal feel like an invitation: I saw this and thought of the kind of person you are becoming.",
    note:
      "I chose this because it reminded me of who you are becoming, and I love getting to notice that.",
    backups: [
      "a creative kit connected to their obsession",
      "an experience where they get to lead",
      "a keepsake that captures their current age and imagination",
    ],
  },
  "long-distance": {
    insight:
      "The gift has to solve for absence. It should create a repeatable feeling of presence, not just a one-time surprise.",
    primary:
      "Create a distance ritual: paired objects, scheduled notes, or a shared sensory routine that makes an ordinary day feel briefly shared again.",
    why:
      "Long-distance gifts are believable when they give the relationship a rhythm across space.",
    delivery:
      "Send the first piece with a date or time attached so the gift becomes something you both enter together.",
    note:
      "I wanted this to make an ordinary moment feel a little closer to shared, even from far away.",
    backups: [
      "paired mugs, playlists, or lamps tied to a weekly ritual",
      "a set of open-when notes for specific missed moments",
      "a surprise delivery planned for their most ordinary day",
    ],
  },
};

const occasionStrategies: { match: string[]; strategy: OccasionStrategy }[] = [
  {
    match: ["birthday", "bday"],
    strategy: {
      frame: "A birthday gift should make them feel known in the present, not summarized by their past.",
      risk: "avoid defaulting to age, luxury, or a generic celebration object",
      delivery: "Make the note about who they are this year.",
    },
  },
  {
    match: ["anniversary"],
    strategy: {
      frame: "An anniversary gift should prove that the relationship has been witnessed, not just counted.",
      risk: "avoid romance that could belong to anyone",
      delivery: "Anchor the reveal in one specific moment from the relationship.",
    },
  },
  {
    match: ["apology", "sorry", "fight"],
    strategy: {
      frame: "An apology gift should never try to buy forgiveness. It should create room for repair.",
      risk: "avoid anything that feels like pressure to move on quickly",
      delivery: "Lead with accountability before the object.",
    },
  },
  {
    match: ["thank", "gratitude", "appreciation"],
    strategy: {
      frame: "An appreciation gift should name the invisible labor or presence that made a difference.",
      risk: "avoid vague praise",
      delivery: "Say exactly what you noticed and why it mattered.",
    },
  },
  {
    match: ["graduation", "promotion", "new job", "achievement"],
    strategy: {
      frame: "A milestone gift should honor the effort behind the visible win.",
      risk: "avoid only celebrating the title or outcome",
      delivery: "Name the quality that carried them here.",
    },
  },
  {
    match: ["just because", "random", "ordinary"],
    strategy: {
      frame: "A just-because gift works when it interrupts an ordinary day with evidence of attention.",
      risk: "avoid making it feel like an occasion was required",
      delivery: "Keep the handoff light, almost casual.",
    },
  },
];

function detectOccasion(occasion: string): OccasionStrategy {
  const normalized = occasion.toLowerCase();

  return (
    occasionStrategies.find(({ match }) =>
      match.some((item) => normalized.includes(item))
    )?.strategy ?? {
      frame:
        "The occasion should shape the timing, but the emotional signal should shape the gift.",
      risk: "avoid letting the occasion overpower the person",
      delivery: "Connect the gift to a specific thing you see in them.",
    }
  );
}

function budgetLanguage(budget: string) {
  const value = budget.trim();
  if (!value) return "Keep the spend flexible; the precision should come from meaning.";

  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric) || numeric === 0) {
    return `Treat "${value}" as a comfort boundary, not the emotional center.`;
  }

  if (numeric < 40) {
    return "Use the budget as a creative constraint: small, specific, and hard to copy.";
  }

  if (numeric < 150) {
    return "There is enough room for polish, but the emotional detail still needs to do the work.";
  }

  return "Higher spend should buy care, craft, or experience quality, not emotional volume.";
}

function ageContext(age: string) {
  const numericAge = Number(age);
  if (!Number.isFinite(numericAge) || numericAge <= 0) {
    return {
      label: "age not specified",
      guidance:
        "Do not assume a life stage; keep the recommendation flexible and based on the relationship signals.",
    };
  }

  if (numericAge < 13) {
    return {
      label: "child",
      guidance:
        "Prioritize wonder, confidence, safe creativity, and a gift they can use with guidance.",
    };
  }

  if (numericAge < 20) {
    return {
      label: "teen",
      guidance:
        "Avoid anything patronizing. Choose something identity-building, social, creative, or independence-supporting.",
    };
  }

  if (numericAge < 35) {
    return {
      label: "young adult",
      guidance:
        "Favor taste, identity, experiences, usefulness, and gifts that fit an active changing life.",
    };
  }

  if (numericAge < 55) {
    return {
      label: "midlife adult",
      guidance:
        "Favor quality, relief, meaning, refined usefulness, and time-saving care over novelty.",
    };
  }

  return {
    label: "older adult",
    guidance:
      "Favor comfort, legacy, ease, family connection, quality, and gifts that do not create extra work.",
  };
}

function genderContext(gender: string) {
  if (!gender || gender === "Prefer not to say") {
    return "Do not gender the gift; infer taste from the selected emotional signals.";
  }

  return `Gender context: ${gender}. Use it only to avoid mismatched assumptions; do not rely on stereotypes.`;
}

function lifeStageSentence(age: string) {
  const lifeStage = ageContext(age);
  if (lifeStage.label === "age not specified") {
    return lifeStage.guidance;
  }

  return `Because they are a ${lifeStage.label}, the idea should be calibrated this way: ${lifeStage.guidance}`;
}

function sentenceList(items: string[]) {
  const unique = [...new Set(items.filter(Boolean))];
  if (unique.length === 0) return "the signals you chose";
  if (unique.length === 1) return unique[0].toLowerCase();

  return `${unique.slice(0, -1).join(", ").toLowerCase()}, and ${unique[
    unique.length - 1
  ].toLowerCase()}`;
}

function contextLine(input: GiftInput) {
  const context = input.emotionalContext.trim();
  if (context) {
    return `The personal clue that matters most is this: ${context}`;
  }

  return "Since there is no long context note, the gift should lean harder on the selected emotional signals and avoid pretending to know details it does not.";
}

function refinePrimaryIdea(input: GiftInput, baseIdea: string) {
  const signals = sentenceList([...input.personalityTraits, ...input.emotionalSignals]);
  const context = input.emotionalContext.trim();
  const lifeStage = ageContext(input.age);

  if (!context) {
    return `${baseIdea} Adapt it for a ${lifeStage.label}: ${lifeStage.guidance} Build it around ${signals}, then add one concrete detail before giving it.`;
  }

  return `${baseIdea} Adapt it for a ${lifeStage.label}: ${lifeStage.guidance} Use the detail about "${context}" as the emotional proof, not as decoration.`;
}

function refineBackupIdeas(backups: string[], occasion: OccasionStrategy) {
  return backups.map((idea) => `${idea}, with the note focused on ${occasion.delivery}`);
}

export async function generateGiftIdea(input: GiftInput): Promise<GiftResult> {
  const profile = getRelationshipProfile(input.relationship);
  const relationship = relationshipStrategies[input.relationship];
  const occasion = detectOccasion(input.occasion);
  const recipient = input.recipientName.trim() || "them";
  const emotionalSignals = sentenceList([
    ...input.personalityTraits,
    ...input.emotionalSignals,
  ]);

  return {
    emotionalHeadline: `${profile.shortLabel} read for ${recipient}`,
    giftDirection: `${relationship.insight} ${occasion.frame} ${lifeStageSentence(input.age)}`,
    primaryIdea: refinePrimaryIdea(input, relationship.primary),
    whyItFits: `${relationship.why} The choices point toward ${emotionalSignals}, so the gift should feel observed rather than impressive. ${genderContext(input.gender)} ${budgetLanguage(
      input.budget
    )}`,
    recommendationStyle: `${profile.recommendationStyle}. The key constraint: ${occasion.risk}.`,
    emotionalStrategy: `${contextLine(input)} Let the object be simple enough that the emotional read stays in focus.`,
    deliveryNote: `${relationship.delivery} ${occasion.delivery}`,
    giftNote: relationship.note,
    backupIdeas: refineBackupIdeas(relationship.backups, occasion),
  };
}
