'use client';

import { useState } from 'react';

export function useFormSubmit(url: string, onSaved: () => void, method: string = 'POST') {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(body: unknown) {
    setSaving(true);
    setError('');
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to save');
      setSaving(false);
      return;
    }
    onSaved();
  }

  return { saving, error, submit };
}
