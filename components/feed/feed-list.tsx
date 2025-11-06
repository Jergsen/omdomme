import type { Article, ArticleDriver, ArticleProfile, ArticleSpokesperson } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ArticleWithRelations = Article & {
  profiles: (ArticleProfile & { profile: { name: string } })[];
  drivers: (ArticleDriver & { driver: { name: string } })[];
  spokespeople: (ArticleSpokesperson & { spokesperson: { name: string } })[];
};

type Props = {
  articles: ArticleWithRelations[];
};

const badgeBase = 'border-transparent px-3 py-1 text-xs font-semibold';

function SentimentBadge({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) return null;

  const tone = value > 0.2 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' : value < -0.2 ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300' : 'bg-muted text-muted-foreground';

  return (
    <Badge variant="secondary" className={cn(badgeBase, tone)}>
      Sentiment {value.toFixed(2)}
    </Badge>
  );
}

function FocusBadge({ focus }: { focus: string | null | undefined }) {
  if (!focus) return null;
  return (
    <Badge variant="secondary" className={cn(badgeBase, 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300')}>
      Fokus {focus}
    </Badge>
  );
}

export function FeedList({ articles }: Props) {
  if (articles.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-base font-medium">Ingen artikler ennå</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 text-sm text-muted-foreground">
          Ingest-jobben vil fylle feeden fortløpende så snart kildene svarer.
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                <a href={article.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">
                  {article.title}
                </a>
              </CardTitle>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {article.source} • {formatDistanceToNow(article.publishedAt, { addSuffix: true, locale: nb })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SentimentBadge value={article.sentiment} />
              <FocusBadge focus={article.focus} />
              {article.prScore !== null && article.prScore !== undefined ? (
                <Badge variant="secondary" className={cn(badgeBase, 'bg-amber-500/10 text-amber-600 dark:text-amber-300')}>
                  PR-score {article.prScore.toFixed(1)}
                </Badge>
              ) : null}
              {article.reach !== null && article.reach !== undefined ? (
                <Badge variant="secondary" className={cn(badgeBase, 'bg-sky-500/10 text-sky-600 dark:text-sky-300')}>
                  Synlighet {(article.reach ?? 0).toFixed(2)}
                </Badge>
              ) : null}
            </div>
          </CardHeader>
          {article.summary ? (
            <CardContent>
              <p className="text-sm text-muted-foreground">{article.summary}</p>
            </CardContent>
          ) : null}
          <CardContent className="flex flex-wrap gap-3 pt-0 text-xs text-muted-foreground">
            {article.profiles.length > 0 ? (
              <Badge variant="secondary" className="bg-muted px-2.5 py-1 text-xs font-medium">
                Profiler: {article.profiles.map((profile) => profile.profile.name).join(', ')}
              </Badge>
            ) : null}
            {article.drivers.length > 0 ? (
              <Badge variant="secondary" className="bg-muted px-2.5 py-1 text-xs font-medium">
                Drivere: {article.drivers.map((driver) => driver.driver.name).join(', ')}
              </Badge>
            ) : null}
            {article.spokespeople.length > 0 ? (
              <Badge variant="secondary" className="bg-muted px-2.5 py-1 text-xs font-medium">
                Talspersoner: {article.spokespeople.map((spokesperson) => spokesperson.spokesperson.name).join(', ')}
              </Badge>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
