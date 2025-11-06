import { db } from '@/lib/db';
import { calculateReach, normaliseReach } from '@/services/reach';
import { scoreSentiment } from '@/services/sentiment';
import { estimateFocus, focusWeight } from '@/services/focus';
import {
  buildArticleText,
  buildProfileMatcher,
  matchDrivers,
  matchSpokespeople
} from '@/services/match';
import type { IngestedArticle } from '@/ingest/rss';

export type EnrichedArticle = {
  sentiment: number;
  focus: string;
  prScore: number;
  reach: number;
  profiles: string[];
  drivers: string[];
  spokespeople: string[];
};

export async function applyArticleEnrichment(article: IngestedArticle): Promise<EnrichedArticle> {
  const text = buildArticleText({
    title: article.title,
    summary: article.summary ?? '',
    content: article.content ?? ''
  });
  const lowered = text.toLowerCase();

  const sentiment = scoreSentiment(lowered);
  const focus = estimateFocus(article.title + '\n' + (article.summary ?? ''));
  const reach = calculateReach(article.source, article.publishedAt);

  const [profiles, aliases, driverKeywords] = await Promise.all([
    db.profile.findMany({ include: { keywords: true } }),
    db.alias.findMany(),
    db.driverKeyword.findMany()
  ]);

  const profileMatches = profiles
    .filter((profile) => {
      if (profile.keywords.length === 0) return false;
      const matcher = buildProfileMatcher(profile.keywords);
      return matcher(lowered);
    })
    .map((profile) => profile.id);

  const driverMatches = matchDrivers(lowered, driverKeywords);
  const spokespersonMatches = matchSpokespeople(text, aliases);

  const sentimentNorm = (sentiment + 1) / 2;
  const focusNorm = focusWeight(focus);
  const reachNorm = normaliseReach(reach);
  const prScore = Math.round((40 * sentimentNorm + 35 * focusNorm + 25 * reachNorm) * 100) / 100;

  return {
    sentiment,
    focus,
    prScore,
    reach,
    profiles: profileMatches,
    drivers: [...new Set(driverMatches)],
    spokespeople: [...new Set(spokespersonMatches)]
  };
}
