import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseAdmin';

// GET /api/badges?email=xxx  →  badges creados por esa institución
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  const query = db.from('badges').select('*').order('created_at', { ascending: false });
  if (email) query.eq('institucion_email', email.toLowerCase());

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// POST /api/badges  →  crear badge
export async function POST(req: NextRequest) {
  try {
    const { title, issuer, event, description, imageUrl, institucionEmail, origin } = await req.json();

    if (!title || !issuer) {
      return NextResponse.json({ error: 'title e issuer son requeridos' }, { status: 400 });
    }

    const code     = 'BADGE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const claimUrl = `${origin ?? 'http://localhost:3001'}/claim_badge?code=${code}`;

    const { data, error } = await db
      .from('badges')
      .insert({
        code,
        title,
        issuer,
        event:             event ?? '',
        description:       description ?? '',
        image_url:         imageUrl ?? '',
        institucion_email: institucionEmail?.toLowerCase() ?? '',
        claim_url:         claimUrl,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, badge: data });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
