const positiveWords = ['vekst', 'suksess', 'rekord', 'prisvinnende', 'ros'];
const negativeWords = ['kritikk', 'krise', 'streik', 'skandale', 'bot'];

export function scoreSentiment(text: string): number {
  const haystack = text.toLowerCase();
  let score = 0;
  for (const word of positiveWords) {
    if (haystack.includes(word)) score += 1;
  }
  for (const word of negativeWords) {
    if (haystack.includes(word)) score -= 1;
  }
  return Math.max(-1, Math.min(1, score / 3));
}
