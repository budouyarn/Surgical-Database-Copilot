'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Bot } from 'lucide-react';
import Link from 'next/link';
import { Surgeon, PreferenceCard, Procedure } from '@/types';
import { fetchList } from '@/lib/fetchList';
import PreferenceCardModal from '@/components/surgeons/PreferenceCardModal';

export default function SurgeonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [surgeon, setSurgeon] = useState<Surgeon | null>(null);
  const [cards, setCards] = useState<PreferenceCard[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCard, setModalCard] = useState<PreferenceCard | null | 'new'>(null);

  async function fetchData() {
    const [surRes, cardRes, procRes] = await Promise.all([
      fetch(`/api/surgeons/${id}`),
      fetch(`/api/preference-cards?surgeon_id=${id}`),
      fetch('/api/procedures'),
    ]);
    const [surgeonData, cards, procedures] = await Promise.all([
      surRes.json(),
      fetchList<PreferenceCard>(`/api/preference-cards?surgeon_id=${id}`),
      fetchList<Procedure>('/api/procedures'),
    ]);
    setSurgeon(surRes.ok ? surgeonData : null);
    setCards(cards);
    setProcedures(procedures);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return <div className="text-center py-20 text-slate-400">Loading…</div>;
  if (!surgeon) return <div className="text-center py-20 text-slate-400">Surgeon not found.</div>;

  return (
    <div>
      <Link href="/surgeons" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Surgeons
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{surgeon.name}</h1>
            <p className="text-slate-500 mt-1">{surgeon.specialty} · {surgeon.hospital}</p>
            {surgeon.email && <p className="text-sm text-slate-400 mt-0.5">{surgeon.email}</p>}
            {surgeon.phone && <p className="text-sm text-slate-400">{surgeon.phone}</p>}
          </div>
          <Link
            href={`/copilot?surgeon=${id}`}
            className="flex items-center gap-2 text-sm bg-purple-50 text-purple-700 border border-purple-100 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Bot className="w-4 h-4" /> Ask Copilot
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Preference Cards</h2>
        <button
          onClick={() => setModalCard('new')}
          className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
          No preference cards yet. Add one for a specific procedure.
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map(card => (
            <div key={card.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-800">{card.procedure?.name}</h3>
                <button
                  onClick={() => setModalCard(card)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {card.positioning && (
                  <div><span className="text-slate-400">Positioning: </span><span className="text-slate-700">{card.positioning}</span></div>
                )}
                {card.draping && (
                  <div><span className="text-slate-400">Draping: </span><span className="text-slate-700">{card.draping}</span></div>
                )}
                {card.instruments.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-slate-400">Instruments: </span>
                    <span className="text-slate-700">{card.instruments.join(', ')}</span>
                  </div>
                )}
                {card.sutures.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-slate-400">Sutures: </span>
                    <span className="text-slate-700">{card.sutures.join(', ')}</span>
                  </div>
                )}
                {card.special_equipment.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-slate-400">Special Equipment: </span>
                    <span className="text-slate-700">{card.special_equipment.join(', ')}</span>
                  </div>
                )}
                {card.notes && (
                  <div className="col-span-2">
                    <span className="text-slate-400">Notes: </span>
                    <span className="text-slate-700">{card.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalCard !== null && (
        <PreferenceCardModal
          surgeonId={id}
          card={modalCard === 'new' ? null : modalCard}
          procedures={procedures}
          onClose={() => setModalCard(null)}
          onSaved={() => { setModalCard(null); fetchData(); }}
        />
      )}
    </div>
  );
}
