import reachConfig from '@/config/reach.json';

const HALF_LIFE_DAYS = 7;

export function calculateReach(domain: string, publishedAt: Date): number {
  const base = reachConfig[domain] ?? 0.25;
  const ageMs = Date.now() - publishedAt.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  const decay = Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
  return base * decay;
}

export function normaliseReach(reach: number) {
  return Math.max(0, Math.min(1, reach));
}
