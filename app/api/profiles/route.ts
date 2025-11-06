import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const ProfileSchema = z.object({
  name: z.string().min(2)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await db.profile.create({ data: parsed.data });
  return NextResponse.json(profile, { status: 201 });
}
