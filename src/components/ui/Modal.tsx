import { X } from 'lucide-react';

export const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

interface ModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  saveLabel?: string;
  error: string;
  wide?: boolean;
  scrollable?: boolean;
  children: React.ReactNode;
}

export default function Modal({
  title, onClose, onSubmit, saving, saveLabel = 'Save', error, wide, scrollable, children,
}: ModalProps) {
  const outerCls = `fixed inset-0 bg-black/40 flex items-center justify-center z-50${scrollable ? ' overflow-y-auto py-8' : ''}`;
  const innerCls = `bg-white rounded-xl shadow-xl w-full${wide ? ' max-w-lg mx-4' : ' max-w-md'}`;
  const headerCls = `flex items-center justify-between${scrollable ? ' p-6 border-b border-slate-100' : ' mb-4'}`;
  const formCls = scrollable ? 'p-6 space-y-4' : 'space-y-3';
  const wrapperCls = scrollable ? innerCls : `${innerCls} p-6`;

  return (
    <div className={outerCls}>
      <div className={wrapperCls}>
        <div className={headerCls}>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className={formCls}>
          {children}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving…' : saveLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
