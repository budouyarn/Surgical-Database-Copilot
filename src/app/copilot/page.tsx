'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Bot, User, Loader2, Lightbulb } from 'lucide-react';
import { CopilotMessage, Surgeon, Procedure } from '@/types';
import { fetchList } from '@/lib/fetchList';

const SUGGESTIONS = [
  'Generate a preference card template for a laparoscopic cholecystectomy',
  'What instruments are typically needed for a total knee replacement?',
  'Suggest OR setup steps for a C-section',
  'Summarize the preference card for Dr. [Name]',
];

export default function CopilotPage() {
  const searchParams = useSearchParams();
  const surgeonParam = searchParams.get('surgeon');

  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [surgeons, setSurgeons] = useState<Surgeon[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [selectedSurgeon, setSelectedSurgeon] = useState(surgeonParam || '');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [cachedCards, setCachedCards] = useState<Record<string, unknown[]>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchContext() {
      const [sur, proc] = await Promise.all([
        fetchList<Surgeon>('/api/surgeons'),
        fetchList<Procedure>('/api/procedures'),
      ]);
      setSurgeons(sur);
      setProcedures(proc);
    }
    fetchContext();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = text || input.trim();
    if (!content) return;

    const newMessages: CopilotMessage[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    let context: Record<string, unknown> = {};
    if (selectedSurgeon) {
      let cards = cachedCards[selectedSurgeon];
      if (!cards) {
        const cardRes = await fetch(`/api/preference-cards?surgeon_id=${selectedSurgeon}`);
        cards = await cardRes.json();
        setCachedCards(prev => ({ ...prev, [selectedSurgeon]: cards }));
      }
      context = { surgeon: surgeons.find(s => s.id === selectedSurgeon), preference_cards: cards };
    }
    if (selectedProcedure) {
      context.procedure = procedures.find(p => p.id === selectedProcedure);
    }

    const res = await fetch('/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, context }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.message || data.error }]);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">AI Copilot</h1>
        <p className="text-sm text-slate-500 mt-0.5">Ask about cases, generate templates, and get procedure guidance.</p>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={selectedSurgeon}
          onChange={e => setSelectedSurgeon(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No surgeon context</option>
          {surgeons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          value={selectedProcedure}
          onChange={e => setSelectedProcedure(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No procedure context</option>
          {procedures.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <Bot className="w-10 h-10 text-slate-300" />
              <p className="text-slate-400 text-sm max-w-sm">
                Select a surgeon or procedure above, then ask a question or use a suggestion below.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="flex items-start gap-2 text-left text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-3 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                    <span className="text-slate-600">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-purple-600" />
              </div>
              <div className="bg-slate-100 rounded-xl px-4 py-3">
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
              placeholder="Ask about a case, request a template, or get procedure guidance…"
              className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
