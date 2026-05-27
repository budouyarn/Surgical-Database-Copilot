'use client';

import { useState } from 'react';
import Modal, { inputCls } from '@/components/ui/Modal';
import { useFormSubmit } from '@/lib/useFormSubmit';
import FileUpload from '@/components/ui/FileUpload';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const fields = [
  { key: 'name', label: 'Full Name', required: true },
  { key: 'specialty', label: 'Specialty', required: true },
  { key: 'hospital', label: 'Hospital / Facility', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Phone', required: false },
] as const;

export default function AddSurgeonModal({ onClose, onSaved }: Props) {
  const [form, setForm] = useState({ name: '', specialty: '', hospital: '', email: '', phone: '' });
  const { saving, error, submit } = useFormSubmit('/api/surgeons', onSaved);

  function handleExtracted(data: Record<string, unknown>) {
    setForm(f => ({
      name: (data.name as string) || f.name,
      specialty: (data.specialty as string) || f.specialty,
      hospital: (data.hospital as string) || f.hospital,
      email: (data.email as string) || f.email,
      phone: (data.phone as string) || f.phone,
    }));
  }

  return (
    <Modal title="Add Surgeon" onClose={onClose} onSubmit={e => { e.preventDefault(); submit(form); }}
      saving={saving} saveLabel="Save Surgeon" error={error}>
      <FileUpload extractType="surgeon" onExtracted={handleExtracted} />
      <hr className="border-slate-100" />
      {fields.map(({ key, label, required }) => (
        <div key={key}>
          <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
          <input
            type="text"
            required={required}
            value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            className={inputCls}
          />
        </div>
      ))}
    </Modal>
  );
}
