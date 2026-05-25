export async function generateGiftIdea(prompt: string) {

  if (prompt.includes("Partner")) {
    return `
Gift Direction:
Deeply emotional and intimate gifting.

Why This Fits:
Partners respond most strongly to emotional effort and shared memories.

Recommended Gift Ideas:
• Memory scrapbook
• Personalized love letters
• Couple photo timeline
• Voice-note keepsake
• Surprise experience date

Emotional Strategy:
Focus on nostalgia, intimacy, and emotional vulnerability.
`;
  }

  if (prompt.includes("Best Friend")) {
    return `
Gift Direction:
Fun, nostalgic, and personality-driven gifting.

Why This Fits:
Best friends value shared experiences and inside jokes.

Recommended Gift Ideas:
• Friendship photo album
• Custom meme box
• Shared memory jar
• Concert or trip surprise
• Personalized quirky gifts

Emotional Strategy:
Focus on fun memories and emotional comfort.
`;
  }

  if (prompt.includes("Parent")) {
    return `
Gift Direction:
Heartfelt appreciation and gratitude gifting.

Why This Fits:
Parents emotionally value appreciation more than luxury.

Recommended Gift Ideas:
• Handwritten gratitude letter
• Family memory frame
• Personalized keepsake
• Relaxation experience
• Emotional video montage

Emotional Strategy:
Focus on gratitude, warmth, and emotional acknowledgment.
`;
  }

  return `
Gift Direction:
Emotionally meaningful gifting with personal touch.

Why This Fits:
This recipient values intentionality and emotional effort.

Recommended Gift Ideas:
• Personalized keepsake
• Memory-based gift
• Custom experience
• Thoughtful handmade item

Emotional Strategy:
Prioritize emotional personalization over price.
`;
}
