/**
 * Word pool for Word Memory Test
 * Contains simple, common words and confusing alternatives
 */
export const WORD_POOL = [
  // Common words
  "apple", "ocean", "guitar", "mountain", "coffee",
  "sunset", "forest", "rocket", "library", "diamond",
  "thunder", "bicycle", "castle", "penguin", "volcano",
  "crystal", "whisper", "compass", "rainbow", "elephant",
  "lantern", "dragon", "meadow", "planet", "treasure",
  "pyramid", "jungle", "phoenix", "garden", "comet",

  // Confusing alternatives
  "orange", "river", "piano", "valley", "tea",
  "sunrise", "jungle", "shuttle", "bookstore", "ruby",
  "lightning", "motorcycle", "palace", "pelican", "earthquake",
  "gem", "murmur", "map", "spectrum", "mammoth",
  "candle", "serpent", "field", "star", "wealth",
  "temple", "rainforest", "eagle", "park", "meteor"
];

export function getRandomWords(count: number): string[] {
  const shuffled = [...WORD_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getConfusingWords(originalWords: string[], count: number): string[] {
  const available = WORD_POOL.filter(word => !originalWords.includes(word));
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
