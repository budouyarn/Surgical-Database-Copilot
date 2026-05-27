'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';

interface Props {
  extractType: 'surgeon' | 'preference_card';
  onExtracted: (data: Record<string, unknown>) => void;
}

const ACCEPTED = '.pdf,.docx,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.webp';

export default function FileUpload({ extractType, onExtracted }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);

  async function processFile(file: File) {
    setFileName(file.name);
    setLoading(true);
    setError('');

    const form = new FormData();
    form.append('file', file);
    form.append('type', extractType);

    try {
      const res = await fetch('/api/parse-file', { method: 'POST', body: form });
      const text = await res.text();
      let data: Record<string, unknown>;
      try { data = JSON.parse(text); } catch { setError(`Server error: ${text.slice(0, 200)}`); return; }
      if (!res.ok) { setError((data.error as string) || 'Failed to parse file'); return; }
      onExtracted(data);
    } catch (e) {
      setError(`Failed to upload file: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">Import from file</label>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !loading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-4 py-5 cursor-pointer transition-colors text-center
          ${dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            <p className="text-xs text-slate-500">Parsing <span className="font-medium">{fileName}</span>…</p>
          </>
        ) : fileName && !error ? (
          <>
            <p className="text-xs text-green-600 font-medium">Extracted from {fileName}</p>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setFileName(''); }}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 text-slate-400" />
            <p className="text-xs text-slate-500">
              Drop a file or <span className="text-blue-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-slate-400">PDF, DOCX, XLSX, CSV, or image</p>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ''; }}
      />
    </div>
  );
}
