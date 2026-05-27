'use client';

import { useEffect, useState } from 'react';
import { Plus, Calendar, Clock } from 'lucide-react';
import { OperationCase, Surgeon, Procedure } from '@/types';
import { fetchList } from '@/lib/fetchList';
import AddCaseModal from '@/components/cases/AddCaseModal';

const statusColors: Record<string, string> = {
  scheduled: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-green-50 text-green-700 border-green-100',
  cancelled: 'bg-slate-50 text-slate-500 border-slate-100',
};

export default function CasesPage() {
  const [cases, setCases] = useState<OperationCase[]>([]);
  const [surgeons, setSurgeons] = useState<Surgeon[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterSurgeon, setFilterSurgeon] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  async function fetchData() {
    const [cases, surgeons, procedures] = await Promise.all([
      fetchList<OperationCase>('/api/cases'),
      fetchList<Surgeon>('/api/surgeons'),
      fetchList<Procedure>('/api/procedures'),
    ]);
    setCases(cases);
    setSurgeons(surgeons);
    setProcedures(procedures);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  const filtered = cases.filter(c => {
    if (filterSurgeon && c.surgeon_id !== filterSurgeon) return false;
    if (filterStatus && c.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operation Cases</h1>
          <p className="text-sm text-slate-500 mt-0.5">{cases.length} cases logged</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Case
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={filterSurgeon}
          onChange={e => setFilterSurgeon(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Surgeons</option>
          {surgeons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No cases found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{c.procedure?.name || 'Unknown Procedure'}</p>
                  <p className="text-sm text-slate-500">{c.surgeon?.name} · {c.surgeon?.specialty}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[c.status]}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(c.date).toLocaleDateString()}
                </span>
                {c.duration_minutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {c.duration_minutes} min
                  </span>
                )}
                {c.patient_mrn && <span>MRN: {c.patient_mrn}</span>}
              </div>
              {c.notes && <p className="mt-2 text-sm text-slate-600">{c.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddCaseModal
          surgeons={surgeons}
          procedures={procedures}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchData(); }}
        />
      )}
    </div>
  );
}
