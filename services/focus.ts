export type FocusLevel = 'Fullt' | 'Sentralt' | 'Medvirkende' | 'Perifer';

const QUOTES_REGEX = /"([^"]+)"/g;

export function estimateFocus(text: string): FocusLevel {
  const quotes = [...text.matchAll(QUOTES_REGEX)].length;
  const titleLength = text.split('\n')[0]?.split(/\s+/).length ?? 0;
  const summaryLength = text.split('\n')[1]?.split(/\s+/).length ?? 0;
  const emphasisWords = (text.match(/[A-ZÆØÅ][A-Za-zÆØÅæøå'\-]{2,}/g) || []).length;

  const focusScore = quotes * 2 + Math.min(3, Math.floor(summaryLength / 60)) + (titleLength > 12 ? 1 : 0) + Math.min(2, Math.floor(emphasisWords / 4));

  if (focusScore >= 6) return 'Fullt';
  if (focusScore >= 4) return 'Sentralt';
  if (focusScore >= 2) return 'Medvirkende';
  return 'Perifer';
}

export function focusWeight(focus: FocusLevel): number {
  switch (focus) {
    case 'Fullt':
      return 1;
    case 'Sentralt':
      return 0.75;
    case 'Medvirkende':
      return 0.5;
    default:
      return 0.25;
  }
}
