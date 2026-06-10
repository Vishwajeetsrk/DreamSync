import { NextResponse, NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const profile = await redis.get(`ds:profile:${userId}`);
    return NextResponse.json({ profile });
  } catch (err: any) {
    console.error('[API Profile GET] Error:', err);
    return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, profile } = await req.json();
    if (!userId || !profile) {
      return NextResponse.json({ error: 'Missing userId or profile data' }, { status: 400 });
    }

    const existing: any = (await redis.get(`ds:profile:${userId}`)) || {};
    const updated = {
      ...existing,
      ...profile,
      updated_at: new Date().toISOString(),
    };

    await redis.set(`ds:profile:${userId}`, updated);
    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    console.error('[API Profile POST] Error:', err);
    return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
  }
}
