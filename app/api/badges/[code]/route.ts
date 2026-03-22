import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseAdmin';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  const { data, error } = await db
    .from('badges')
    .select('*')
    .eq('code', code)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Badge no encontrado' }, { status: 404 });
  }

  return NextResponse.json(data);
}
