import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const CARD_SELECT = '*, surgeon:surgeons(id, name, specialty), procedure:procedures(id, name, specialty)';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const surgeonId = searchParams.get('surgeon_id');
  const procedureId = searchParams.get('procedure_id');

  let query = supabase
    .from('preference_cards')
    .select(CARD_SELECT)
    .order('updated_at', { ascending: false });

  if (surgeonId) query = query.eq('surgeon_id', surgeonId);
  if (procedureId) query = query.eq('procedure_id', procedureId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { data, error } = await supabase
    .from('preference_cards')
    .upsert(body, { onConflict: 'surgeon_id,procedure_id' })
    .select(CARD_SELECT)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
