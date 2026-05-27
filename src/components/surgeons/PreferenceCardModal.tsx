'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal, { inputCls } from '@/components/ui/Modal';
import { useFormSubmit } from '@/lib/useFormSubmit';
import { PreferenceCard, Procedure } from '@/types';

interface Props {
  surgeonId: string;
  card: PreferenceCard | null;
  procedures: Procedure[];
  onClose: () => void;
  onSaved: () => void;
}

function TagInput({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('');
  function add() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput('');
  }
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add item and press Enter"
        />
        <button type="button" onClick={add} className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {value.map(item => (
          <span key={item} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
            {item}
            <button type="button" onClick={() => onChange(value.filter(v => v !== item))}>
              <Trash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PreferenceCardModal({ surgeonId, card, procedures, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    procedure_id: card?.procedure_id ?? '',
    instruments: card?.instruments ?? [],
    sutures: card?.sutures ?? [],
    positioning: card?.positioning ?? '',
    draping: card?.draping ?? '',
    special_equipment: card?.special_equipment ?? [],
    steps: card?.steps ?? [],
    notes: card?.notes ?? '',
  });
  const { saving, error, submit } = useFormSubmit('/api/preference-cards', onSaved);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit({ ...form, surgeon_id: surgeonId, ...(card ? { id: card.id } : {}) });
  }

  return (
    <Modal title={`${card ? 'Edit' : 'Add'} Preference Card`} onClose={onClose} onSubmit={handleSubmit}
      saving={saving} saveLabel="Save Card" error={error} wide scrollable>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Procedure</label>
        <select required value={form.procedure_id} onChange={e => setForm(f => ({ ...f, procedure_id: e.target.value }))}
          className={inputCls} disabled={!!card}>
          <option value="">Select procedure…</option>
          {procedures.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Positioning</label>
        <input type="text" value={form.positioning} onChange={e => setForm(f => ({ ...f, positioning: e.target.value }))}
          className={inputCls} placeholder="e.g. Supine, beach chair, lateral decubitus" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Draping</label>
        <input type="text" value={form.draping} onChange={e => setForm(f => ({ ...f, draping: e.target.value }))}
          className={inputCls} placeholder="e.g. Standard sterile drape, extremity drape" />
      </div>
      <TagInput label="Instruments" value={form.instruments} onChange={v => setForm(f => ({ ...f, instruments: v }))} />
      <TagInput label="Sutures" value={form.sutures} onChange={v => setForm(f => ({ ...f, sutures: v }))} />
      <TagInput label="Special Equipment" value={form.special_equipment} onChange={v => setForm(f => ({ ...f, special_equipment: v }))} />
      <TagInput label="Procedure Steps" value={form.steps} onChange={v => setForm(f => ({ ...f, steps: v }))} />
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          rows={3} className={inputCls} placeholder="Any additional notes or preferences…" />
      </div>
    </Modal>
  );
}
