import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const FeedQuerySchema = z.object({
  profileId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  source: z.string().optional(),
  driver: z.string().optional(),
  spokesperson: z.string().optional(),
  sentimentMin: z.coerce.number().optional(),
  sentimentMax: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(20)
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parseResult = FeedQuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
  }

  const {
    profileId,
    from,
    to,
    source,
    driver,
    spokesperson,
    sentimentMin,
    sentimentMax,
    page,
    pageSize
  } = parseResult.data;

  const where: any = {};
  if (profileId) {
    where.profiles = { some: { profileId } };
  }
  if (from || to) {
    where.publishedAt = {};
    if (from) where.publishedAt.gte = new Date(from);
    if (to) where.publishedAt.lte = new Date(to);
  }
  if (source) {
    where.source = source;
  }
  if (sentimentMin !== undefined || sentimentMax !== undefined) {
    where.sentiment = {};
    if (sentimentMin !== undefined) where.sentiment.gte = sentimentMin;
    if (sentimentMax !== undefined) where.sentiment.lte = sentimentMax;
  }
  if (driver) {
    where.drivers = { some: { driverId: driver } };
  }
  if (spokesperson) {
    where.spokespeople = { some: { spokespersonId: spokesperson } };
  }

  const [total, items] = await Promise.all([
    db.article.count({ where }),
    db.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        profiles: { include: { profile: true } },
        drivers: { include: { driver: true } },
        spokespeople: { include: { spokesperson: true } }
      }
    })
  ]);

  return NextResponse.json({
    total,
    page,
    pageSize,
    items
  });
}
