import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const CASE_SELECT = '*, surgeon:surgeons(id, name, specialty), procedure:procedures(id, name, specialty)';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('operation_cases')
    .select(CASE_SELECT)
    .order('date', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { data, error } = await supabase
    .from('operation_cases')
    .insert(body)
    .select(CASE_SELECT)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
