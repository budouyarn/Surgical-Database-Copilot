'use client';

import { useState } from 'react';
import Modal, { inputCls } from '@/components/ui/Modal';
import { useFormSubmit } from '@/lib/useFormSubmit';
import { Surgeon, Procedure, OperationCase } from '@/types';

interface Props {
  surgeons: Surgeon[];
  procedures: Procedure[];
  onClose: () => void;
  onSaved: () => void;
  initialCase?: OperationCase;
}

function toLocalDatetimeValue(isoString: string) {
  const d = new Date(isoString);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function nowLocalDatetimeValue() {
  return toLocalDatetimeValue(new Date().toISOString());
}

export default function AddCaseModal({ surgeons, procedures, onClose, onSaved, initialCase }: Props) {
  const editing = !!initialCase;

  const [form, setForm] = useState({
    surgeon_id: initialCase?.surgeon_id ?? '',
    procedure_id: initialCase?.procedure_id ?? '',
    patient_mrn: initialCase?.patient_mrn ?? '',
    date: initialCase ? toLocalDatetimeValue(initialCase.date) : nowLocalDatetimeValue(),
    duration_minutes: initialCase?.duration_minutes?.toString() ?? '',
    status: initialCase?.status ?? 'scheduled',
    notes: initialCase?.notes ?? '',
    medical_device_support: initialCase?.medical_device_support ?? '',
  });

  const url = editing ? `/api/cases/${initialCase!.id}` : '/api/cases';
  const method = editing ? 'PATCH' : 'POST';
  const { saving, error, submit } = useFormSubmit(url, onSaved, method);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit({
      ...form,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
    });
  }

  return (
    <Modal title={editing ? 'Edit Case' : 'Add Case'} onClose={onClose} onSubmit={handleSubmit}
      saving={saving} saveLabel={editing ? 'Save Changes' : 'Save Case'} error={error}>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Surgeon</label>
        <select required value={form.surgeon_id} onChange={e => setForm(f => ({ ...f, surgeon_id: e.target.value }))} className={inputCls}>
          <option value="">Select surgeon…</option>
          {surgeons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Procedure</label>
        <select required value={form.procedure_id} onChange={e => setForm(f => ({ ...f, procedure_id: e.target.value }))} className={inputCls}>
          <option value="">Select procedure…</option>
          {procedures.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Date & Time</label>
        <input type="datetime-local" required value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'scheduled' | 'in_progress' | 'completed' | 'cancelled' }))} className={inputCls}>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Duration (min)</label>
          <input type="number" value={form.duration_minutes}
            onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
            className={inputCls} placeholder="e.g. 120" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Patient MRN (optional)</label>
        <input type="text" value={form.patient_mrn}
          onChange={e => setForm(f => ({ ...f, patient_mrn: e.target.value }))}
          className={inputCls} placeholder="Medical record number" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Medical Device Support (optional)</label>
        <input type="text" value={form.medical_device_support}
          onChange={e => setForm(f => ({ ...f, medical_device_support: e.target.value }))}
          className={inputCls} placeholder="e.g. Stryker rep – total knee implant system" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
        <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          className={inputCls} placeholder="Any case notes…" />
      </div>
    </Modal>
  );
}
