import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const KeywordSchema = z.object({
  pattern: z.string().min(1),
  type: z.enum(['include', 'exclude', 'regex']).default('include')
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const parsed = KeywordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const keyword = await db.profileKeyword.create({
    data: {
      ...parsed.data,
      profileId: params.id
    }
  });

  return NextResponse.json(keyword, { status: 201 });
}
