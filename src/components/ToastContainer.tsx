import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium bg-white ${
            t.type === 'error'
              ? 'border-red-200 text-red-800'
              : t.type === 'info'
              ? 'border-[#E6EAE6] text-[#202822]'
              : 'border-[#2E8B57]/30 text-[#163D32]'
          }`}
        >
          {t.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          ) : t.type === 'info' ? (
            <Info className="w-4 h-4 text-[#2E8B57] shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0" />
          )}
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
};
