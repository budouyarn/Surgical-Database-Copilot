'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Procedure, PreferenceCard } from '@/types';
import { fetchList } from '@/lib/fetchList';

export default function ProcedureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [cards, setCards] = useState<PreferenceCard[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [proc, prefCards] = await Promise.all([
        fetch(`/api/procedures/${id}`).then(r => r.json()),
        fetchList<PreferenceCard>(`/api/preference-cards?procedure_id=${id}`),
      ]);
      setProcedure(proc);
      setCards(prefCards);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="text-center py-16 text-slate-400">Loading…</div>;
  if (!procedure) return <div className="text-center py-16 text-slate-400">Procedure not found.</div>;

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Procedures
      </button>

      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{procedure.specialty}</p>
        <h1 className="text-2xl font-bold text-slate-900">{procedure.name}</h1>
        {procedure.description && <p className="text-sm text-slate-500 mt-1">{procedure.description}</p>}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">
          Surgeons with this procedure
          <span className="ml-2 text-xs font-normal text-slate-400">({cards.length})</span>
        </h2>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
          No surgeons have a preference card for this procedure yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {cards.map(card => (
            <div key={card.id}>
              <button
                onClick={() => setExpanded(expanded === card.id ? null : card.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{card.surgeon?.name}</p>
                    <p className="text-xs text-slate-500">{card.surgeon?.specialty} · {card.surgeon?.hospital}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expanded === card.id ? 'rotate-90' : ''}`} />
              </button>

              {expanded === card.id && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 bg-slate-50">
                  {card.positioning && (
                    <Section label="Positioning" value={card.positioning} />
                  )}
                  {card.draping && (
                    <Section label="Draping" value={card.draping} />
                  )}
                  {card.instruments?.length > 0 && (
                    <ListSection label="Instruments" items={card.instruments} />
                  )}
                  {card.sutures?.length > 0 && (
                    <ListSection label="Sutures" items={card.sutures} />
                  )}
                  {card.special_equipment?.length > 0 && (
                    <ListSection label="Special Equipment" items={card.special_equipment} />
                  )}
                  {card.steps?.length > 0 && (
                    <ListSection label="Steps" items={card.steps} numbered />
                  )}
                  {card.notes && (
                    <Section label="Notes" value={card.notes} />
                  )}
                  <div className="pt-1">
                    <Link
                      href={`/surgeons/${card.surgeon_id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View full surgeon profile →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  );
}

function ListSection({ label, items, numbered }: { label: string; items: string[]; numbered?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <ul className="space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-700">
            {numbered ? `${i + 1}. ${item}` : `• ${item}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
