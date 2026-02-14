import type { StatusMessage } from '../types';

interface StatusBarProps {
  messages: StatusMessage[];
  onDismiss: (id: number) => void;
}

export function StatusBar({ messages, onDismiss }: StatusBarProps) {
  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg backdrop-blur-md
            flex items-center justify-between gap-3
            animate-slide-down
            ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/30 text-green-100'
                : message.type === 'error'
                ? 'bg-red-500/20 border border-red-500/30 text-red-100'
                : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-100'
            }
          `}
        >
          <span className="flex-1">{message.message}</span>
          <button
            onClick={() => onDismiss(message.id)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Sulje"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
