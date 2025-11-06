import type { Article, ArticleDriver, ArticleProfile, ArticleSpokesperson } from '@prisma/client';

import { TrendChart } from '@/components/feed/trend-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type ArticleWithRelations = Article & {
  drivers: (ArticleDriver & { driver: { name: string } })[];
  profiles: (ArticleProfile & { profile: { name: string } })[];
  spokespeople: (ArticleSpokesperson & { spokesperson: { name: string } })[];
};

type Props = {
  articles: ArticleWithRelations[];
};

function computeAveragePr(articles: ArticleWithRelations[]) {
  const values = articles.map((article) => article.prScore ?? 0);
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function computeBuckets(articles: ArticleWithRelations[]) {
  const now = Date.now();
  const buckets = [7, 30, 365].map((days) => {
    const threshold = now - days * 24 * 60 * 60 * 1000;
    const filtered = articles.filter((article) => article.publishedAt.getTime() >= threshold);
    return {
      label: days === 7 ? '7 dager' : days === 30 ? '30 dager' : '365 dager',
      total: filtered.length,
      avgPr: computeAveragePr(filtered)
    };
  });
  return buckets;
}

export function StatsHeader({ articles }: Props) {
  const buckets = computeBuckets(articles);
  const overallAverage = computeAveragePr(articles);
  const total = articles.length;

  const trendData = articles
    .map((article) => ({
      period: article.publishedAt.toISOString().slice(0, 10),
      prScore: article.prScore ?? 0
    }))
    .reduce<Record<string, { count: number; sum: number }>>((acc, value) => {
      const existing = acc[value.period] ?? { count: 0, sum: 0 };
      existing.count += 1;
      existing.sum += value.prScore;
      acc[value.period] = existing;
      return acc;
    }, {});

  const chartData = Object.entries(trendData)
    .map(([period, stats]) => ({
      period,
      avg: stats.sum / stats.count,
      count: stats.count
    }))
    .sort((a, b) => (a.period < b.period ? -1 : 1));

  return (
    <Card>
      <CardHeader className="gap-6 md:flex md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <CardTitle>OmdømmeLand</CardTitle>
          <CardDescription>
            Totalt <span className="font-semibold text-foreground">{total}</span> saker siste periode. Snitt PR-score{' '}
            <span className="font-semibold text-primary">{overallAverage.toFixed(1)}</span>.
          </CardDescription>
        </div>
        <div className="grid w-full gap-3 sm:grid-cols-3 md:w-auto">
          {buckets.map((bucket) => (
            <div key={bucket.label} className="rounded-lg border bg-muted/40 p-4 text-center shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{bucket.label}</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{bucket.total}</p>
              <p className="text-xs text-emerald-500">PR {bucket.avgPr.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </CardHeader>
      <Separator className="mx-6" />
      <CardContent className="pt-6">
        <TrendChart data={chartData} />
      </CardContent>
    </Card>
  );
}
