import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const SURGEON_PROMPT = `Extract surgeon information from this document. Return only a JSON object with these fields (omit any you cannot find):
{"name":"","specialty":"","hospital":"","email":"","phone":""}`;

const CARD_PROMPT = `Extract surgical preference card information from this document. Return only a JSON object with these fields (omit any you cannot find, arrays contain strings):
{"positioning":"","draping":"","instruments":[],"sutures":[],"special_equipment":[],"steps":[],"notes":""}`;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const extractType = (formData.get('type') as string) || 'preference_card';

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const prompt = extractType === 'surgeon' ? SURGEON_PROMPT : CARD_PROMPT;
  const name = file.name.toLowerCase();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let message: Anthropic.MessageParam;

  if (file.type.startsWith('image/')) {
    const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    message = {
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
        { type: 'text', text: prompt },
      ],
    };
  } else {
    let text = '';
    if (name.endsWith('.csv') || name.endsWith('.txt')) {
      text = await file.text();
    } else if (name.endsWith('.pdf')) {
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: Buffer.from(await file.arrayBuffer()) });
      text = (await parser.getText()).text;
    } else if (name.endsWith('.docx')) {
      const mammoth = await import('mammoth');
      text = (await mammoth.extractRawText({ buffer: Buffer.from(await file.arrayBuffer()) })).value;
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }
    message = { role: 'user', content: `${prompt}\n\nDocument:\n${text.slice(0, 8000)}` };
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [message],
  });

  const raw = response.content[0].type === 'text' ? response.content[0].text : '';
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return NextResponse.json({ error: 'Could not extract data from document' }, { status: 422 });

  try {
    return NextResponse.json(JSON.parse(match[0]));
  } catch {
    return NextResponse.json({ error: 'Could not parse extracted data' }, { status: 422 });
  }
}
