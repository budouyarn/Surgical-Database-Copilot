import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CopilotMessage } from '@/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, context }: { messages: CopilotMessage[]; context: Record<string, unknown> } = await req.json();

  const systemPrompt = `You are a surgical copilot assistant for medical staff. You help with:
1. Filling in surgical preference card templates based on surgeon and procedure data
2. Answering questions about surgical cases and procedures
3. Suggesting appropriate templates based on case type

You have access to the following database context:
${JSON.stringify(context, null, 2)}

When asked to fill a template, output it in a clear, structured format with all fields populated.
When suggesting templates, reference the surgeon's actual preferences from the database.
Be concise, accurate, and use medical terminology appropriately.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 });
  }

  return NextResponse.json({ message: content.text });
}
