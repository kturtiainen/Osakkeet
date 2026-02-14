interface FloatingButtonsProps {
  onRefresh: () => void;
  onSettings: () => void;
  isRefreshing?: boolean;
}

export function FloatingButtons({ onRefresh, onSettings, isRefreshing }: FloatingButtonsProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={`
          w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center text-2xl
          transition-all duration-300
          ${
            isRefreshing
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-purple-pink hover:shadow-purple-500/50 hover:scale-110'
          }
        `}
        aria-label="Päivitä hinnat"
        title="Päivitä hinnat"
      >
        <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
      </button>
      <button
        onClick={onSettings}
        className="
          w-14 h-14 rounded-full shadow-lg
          bg-gradient-purple-pink
          hover:shadow-purple-500/50 hover:scale-110
          flex items-center justify-center text-2xl
          transition-all duration-300
        "
        aria-label="Asetukset"
        title="Asetukset"
      >
        ⚙️
      </button>
    </div>
  );
}
