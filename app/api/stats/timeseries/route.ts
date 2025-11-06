import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const QuerySchema = z.object({
  profileId: z.string().optional(),
  bucket: z.enum(['day', 'week', 'month']).default('day')
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parse = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  }

  const { profileId, bucket } = parse.data;
  const interval = bucket === 'day' ? 'day' : bucket === 'week' ? 'week' : 'month';

  const results = await db.$queryRawUnsafe<
    { period: string; count: bigint; avg: number }[]
  >(
    `SELECT DATE_TRUNC('${interval}', "publishedAt") as period, COUNT(*) as count, AVG(COALESCE("prScore", 0)) as avg
     FROM "Article"
     ${profileId ? 'JOIN "ArticleProfile" ap ON ap."articleId" = "Article"."id"' : ''}
     ${profileId ? 'WHERE ap."profileId" = $1' : ''}
     GROUP BY period
     ORDER BY period ASC`,
    ...(profileId ? [profileId] : [])
  );

  return NextResponse.json({
    results: results.map((row) => ({
      period: row.period,
      count: Number(row.count),
      avgPr: Number(row.avg ?? 0)
    }))
  });
}
