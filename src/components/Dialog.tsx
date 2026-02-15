interface DialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'confirm';
  onConfirm: () => void;
  onCancel: () => void;
}

export function Dialog({
  isOpen,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Peruuta',
  type = 'confirm',
  onConfirm,
  onCancel,
}: DialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❓';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10';
      default:
        return 'border-purple-500/30 bg-purple-500/10';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className={`flex items-center gap-3 p-6 border-b ${getColor()}`}>
          <span className="text-2xl">{getIcon()}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 whitespace-pre-line">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-800">
          {cancelText && (
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold
                         transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-purple-pink text-white rounded-lg font-semibold
                       hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
