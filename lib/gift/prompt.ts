import { GiftInput, getRelationshipProfile } from "./schema";

export function buildGiftPrompt(input: GiftInput) {
  const profile = getRelationshipProfile(input.relationship);

  return [
    `Recipient: ${input.recipientName}`,
    `Relationship: ${profile.label}`,
    `Occasion: ${input.occasion || "Not specified"}`,
    `Budget: ${input.budget || "Flexible"}`,
    `Relationship tone: ${profile.tone}`,
    `Emotional frame: ${profile.emotionalFrame}`,
    `AI phrasing: ${profile.aiPhrasing}`,
    `Recommendation style: ${profile.recommendationStyle}`,
    `Personality signals: ${input.personalityTraits.join(", ") || "Not specified"}`,
    `Emotional preferences: ${input.emotionalSignals.join(", ") || "Not specified"}`,
    `Context only the giver knows: ${input.emotionalContext || "Not provided"}`,
  ].join("\n");
}
