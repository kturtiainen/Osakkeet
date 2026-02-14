interface EmptyStateProps {
  onOpenSettings: () => void;
}

export function EmptyState({ onOpenSettings }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-6xl mb-6">📊</div>
      <h2 className="text-2xl font-bold text-white mb-3">
        Tervetuloa Osakesalkkuun!
      </h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Aloita lisäämällä ensimmäinen osakkeesi. Tarvitset myös RapidAPI-avaimen
        hintojen hakemiseen.
      </p>
      <button
        onClick={onOpenSettings}
        className="px-6 py-3 bg-gradient-purple-pink text-white rounded-lg font-semibold
                   hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
      >
        ⚙️ Avaa asetukset
      </button>
    </div>
  );
}
