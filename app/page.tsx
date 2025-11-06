import { FeedFilters } from '@/components/feed/filters';
import { FeedList } from '@/components/feed/feed-list';
import { StatsHeader } from '@/components/feed/stats-header';
import { ThemeToggle } from '@/components/theme-toggle';
import { db } from '@/lib/db';

export default async function FeedPage() {
  const [articles, profiles, drivers, spokespeople] = await Promise.all([
    db.article.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 50,
      include: {
        profiles: { include: { profile: true } },
        drivers: { include: { driver: true } },
        spokespeople: { include: { spokesperson: true } }
      }
    }),
    db.profile.findMany({ include: { keywords: true } }),
    db.driver.findMany({ include: { keywords: true } }),
    db.spokesperson.findMany({ include: { aliases: true } })
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <StatsHeader articles={articles} />
      <FeedFilters profiles={profiles} drivers={drivers} spokespeople={spokespeople} />
      <FeedList articles={articles} />
    </div>
  );
}
