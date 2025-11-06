import Parser from 'rss-parser';
import cron from 'node-cron';
import { SOURCES } from '@/config/sources';
import { db } from '@/lib/db';
import { applyArticleEnrichment } from '@/services/enrichment';
import { logger } from '@/lib/logger';

const parser = new Parser({
  timeout: 10000
});

export type IngestedArticle = {
  title: string;
  url: string;
  summary?: string;
  content?: string;
  publishedAt: Date;
  source: string;
};

async function fetchSource(url: string): Promise<IngestedArticle[]> {
  const feed = await parser.parseURL(url);
  return (feed.items || [])
    .filter((item) => item.link && item.title && item.isoDate)
    .map((item) => ({
      title: item.title!,
      url: item.link!,
      summary: item.contentSnippet || undefined,
      content: item['content:encoded'] || item.content || undefined,
      publishedAt: new Date(item.isoDate!),
      source: new URL(item.link!).hostname.replace(/^www\./, '')
    }));
}

async function storeArticles(articles: IngestedArticle[]) {
  for (const article of articles) {
    const existing = await db.article.findFirst({
      where: {
        url: article.url,
        publishedAt: article.publishedAt
      }
    });

    if (existing) continue;

    try {
      const enriched = await applyArticleEnrichment(article);
      const profileLinks = enriched.profiles.map((profileId) => ({ profileId }));
      const driverLinks = enriched.drivers.map((driverId) => ({ driverId }));
      const spokespersonLinks = enriched.spokespeople.map((spokespersonId) => ({ spokespersonId }));

      await db.article.create({
        data: {
          title: article.title,
          url: article.url,
          summary: article.summary,
          content: article.content,
          publishedAt: article.publishedAt,
          source: article.source,
          sentiment: enriched.sentiment,
          focus: enriched.focus,
          prScore: enriched.prScore,
          reach: enriched.reach,
          profiles: profileLinks.length
            ? {
                createMany: {
                  data: profileLinks
                }
              }
            : undefined,
          drivers: driverLinks.length
            ? {
                createMany: {
                  data: driverLinks
                }
              }
            : undefined,
          spokespeople: spokespersonLinks.length
            ? {
                createMany: {
                  data: spokespersonLinks
                }
              }
            : undefined
        }
      });
    } catch (error) {
      logger.error('Failed to store article', {
        url: article.url,
        error
      });
    }
  }
}

export async function runIngest() {
  for (const source of SOURCES) {
    try {
      const articles = await fetchSource(source.url);
      await storeArticles(articles);
    } catch (error) {
      logger.warn('Failed to fetch source', { source: source.url, error });
    }
  }
}

export function scheduleIngest() {
  if (process.env.CRON_ENABLED === 'false') return;
  const cronExpression = process.env.CRON_SCHEDULE || '*/10 * * * *';
  cron.schedule(cronExpression, () => {
    runIngest().catch((error) => logger.error('Cron ingest error', { error }));
  });
}
