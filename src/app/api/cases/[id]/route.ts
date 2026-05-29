import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const CASE_SELECT = '*, surgeon:surgeons(id, name, specialty), procedure:procedures(id, name, specialty)';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await req.json();
  const { data, error } = await supabase
    .from('operation_cases')
    .update(body)
    .eq('id', id)
    .select(CASE_SELECT)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
