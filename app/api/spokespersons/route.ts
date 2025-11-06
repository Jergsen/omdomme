import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const SpokespersonSchema = z.object({
  name: z.string().min(2),
  aliases: z.array(z.string().min(1)).default([])
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = SpokespersonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, aliases } = parsed.data;

  const spokesperson = await db.spokesperson.create({
    data: {
      name,
      aliases: {
        create: aliases.map((value) => ({ value }))
      }
    },
    include: { aliases: true }
  });

  return NextResponse.json(spokesperson, { status: 201 });
}
