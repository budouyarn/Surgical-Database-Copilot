'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { Surgeon } from '@/types';
import { fetchList } from '@/lib/fetchList';
import AddSurgeonModal from '@/components/surgeons/AddSurgeonModal';
import Link from 'next/link';

export default function SurgeonsPage() {
  const [surgeons, setSurgeons] = useState<Surgeon[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchSurgeons() {
    setSurgeons(await fetchList<Surgeon>('/api/surgeons'));
    setLoading(false);
  }

  useEffect(() => { fetchSurgeons(); }, []);

  const filtered = surgeons.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.specialty.toLowerCase().includes(search.toLowerCase()) ||
    s.hospital.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Surgeons</h1>
          <p className="text-sm text-slate-500 mt-0.5">{surgeons.length} surgeons in database</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Surgeon
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, specialty, or hospital…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          {search ? 'No surgeons match your search.' : 'No surgeons yet. Add one to get started.'}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {filtered.map(surgeon => (
            <Link
              key={surgeon.id}
              href={`/surgeons/${surgeon.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="font-medium text-slate-800">{surgeon.name}</p>
                <p className="text-sm text-slate-500">{surgeon.specialty} · {surgeon.hospital}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <AddSurgeonModal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchSurgeons(); }}
        />
      )}
    </div>
  );
}
