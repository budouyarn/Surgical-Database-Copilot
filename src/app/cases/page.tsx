'use client';

import { useEffect, useState } from 'react';
import { Plus, Calendar, Clock, Cpu, Edit2 } from 'lucide-react';
import { OperationCase, Surgeon, Procedure } from '@/types';
import { fetchList } from '@/lib/fetchList';
import AddCaseModal from '@/components/cases/AddCaseModal';

const statusColors: Record<string, string> = {
  scheduled: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-green-50 text-green-700 border-green-100',
  cancelled: 'bg-slate-50 text-slate-500 border-slate-100',
};

const TABS = [
  { key: '', label: 'All' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function CasesPage() {
  const [cases, setCases] = useState<OperationCase[]>([]);
  const [surgeons, setSurgeons] = useState<Surgeon[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState<OperationCase | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('');
  const [filterSurgeon, setFilterSurgeon] = useState('');

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
    if (activeTab && c.status !== activeTab) return false;
    if (filterSurgeon && c.surgeon_id !== filterSurgeon) return false;
    return true;
  });

  const countFor = (key: TabKey) => key ? cases.filter(c => c.status === key).length : cases.length;

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

      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-slate-100 text-slate-600' : 'bg-slate-200 text-slate-500'
              }`}>
                {countFor(tab.key)}
              </span>
            </button>
          ))}
        </div>

        <select
          value={filterSurgeon}
          onChange={e => setFilterSurgeon(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Surgeons</option>
          {surgeons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[c.status]}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => setEditingCase(c)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(c.date).toLocaleDateString()} {new Date(c.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {c.duration_minutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {c.duration_minutes} min
                  </span>
                )}
                {c.patient_mrn && <span>MRN: {c.patient_mrn}</span>}
              </div>
              {c.medical_device_support && (
                <p className="flex items-center gap-1.5 mt-2 text-sm text-slate-600">
                  <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {c.medical_device_support}
                </p>
              )}
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
      {editingCase && (
        <AddCaseModal
          surgeons={surgeons}
          procedures={procedures}
          initialCase={editingCase}
          onClose={() => setEditingCase(null)}
          onSaved={() => { setEditingCase(null); fetchData(); }}
        />
      )}
    </div>
  );
}
