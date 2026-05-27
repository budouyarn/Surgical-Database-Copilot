'use client';

import { useState } from 'react';
import Modal, { inputCls } from '@/components/ui/Modal';
import { useFormSubmit } from '@/lib/useFormSubmit';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function AddProcedureModal({ onClose, onSaved }: Props) {
  const [form, setForm] = useState({ name: '', specialty: '', description: '' });
  const { saving, error, submit } = useFormSubmit('/api/procedures', onSaved);

  return (
    <Modal title="Add Procedure" onClose={onClose} onSubmit={e => { e.preventDefault(); submit(form); }}
      saving={saving} saveLabel="Save Procedure" error={error}>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Procedure Name</label>
        <input type="text" required value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className={inputCls} placeholder="e.g. Laparoscopic Cholecystectomy" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Specialty</label>
        <input type="text" required value={form.specialty}
          onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
          className={inputCls} placeholder="e.g. General Surgery, Orthopaedics" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Description (optional)</label>
        <textarea rows={3} value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className={inputCls} placeholder="Brief description of the procedure…" />
      </div>
    </Modal>
  );
}
