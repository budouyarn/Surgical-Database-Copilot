'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { Procedure } from '@/types';
import { fetchList } from '@/lib/fetchList';
import AddProcedureModal from '@/components/procedures/AddProcedureModal';

export default function ProceduresPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchProcedures() {
    setProcedures(await fetchList<Procedure>('/api/procedures'));
    setLoading(false);
  }

  useEffect(() => { fetchProcedures(); }, []);

  const filtered = procedures.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, Procedure[]>>((acc, p) => {
    (acc[p.specialty] = acc[p.specialty] || []).push(p);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Procedures</h1>
          <p className="text-sm text-slate-500 mt-0.5">{procedures.length} procedures in database</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Procedure
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or specialty…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          {search ? 'No procedures match your search.' : 'No procedures yet. Add one to get started.'}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([specialty, procs]) => (
            <div key={specialty}>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{specialty}</h2>
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                {procs.map(p => (
                  <Link key={p.id} href={`/procedures/${p.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-800">{p.name}</p>
                      {p.description && <p className="text-sm text-slate-500 mt-0.5">{p.description}</p>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddProcedureModal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchProcedures(); }}
        />
      )}
    </div>
  );
}
