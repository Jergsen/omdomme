import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const DriverSchema = z.object({
  name: z.string().min(2),
  keywords: z.array(z.string().min(1)).default([])
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = DriverSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, keywords } = parsed.data;
  const driver = await db.driver.create({
    data: {
      name,
      keywords: {
        create: keywords.map((value) => ({ value }))
      }
    },
    include: { keywords: true }
  });

  return NextResponse.json(driver, { status: 201 });
}
