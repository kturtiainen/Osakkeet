import { useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { useDialog } from '../hooks/useDialog';
import { Dialog } from './Dialog';

export function PortfolioTabs() {
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);
  const setActivePortfolio = usePortfolioStore((state) => state.setActivePortfolio);
  const addPortfolio = usePortfolioStore((state) => state.addPortfolio);
  const removePortfolio = usePortfolioStore((state) => state.removePortfolio);
  const renamePortfolio = usePortfolioStore((state) => state.renamePortfolio);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const { dialog, showDialog, handleConfirm, handleCancel } = useDialog();

  const handleAddPortfolio = () => {
    if (newName.trim()) {
      addPortfolio(newName.trim());
      setNewName('');
      setIsAdding(false);
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      renamePortfolio(id, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDelete = async (id: string) => {
    if (portfolios.length > 1) {
      const confirmed = await showDialog({
        title: 'Vahvista poisto',
        message: 'Haluatko varmasti poistaa tämän salkun?',
        confirmText: 'Poista',
        cancelText: 'Peruuta',
        type: 'warning',
      });
      if (confirmed) {
        removePortfolio(id);
      }
    }
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 overflow-x-auto">
      <div className="flex gap-2 min-w-max max-w-4xl mx-auto">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            className={`
              group relative flex items-center gap-2 px-4 py-2 rounded-lg
              transition-all duration-200
              ${
                portfolio.id === activePortfolioId
                  ? 'bg-gradient-purple-pink text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
            `}
          >
            {editingId === portfolio.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleRename(portfolio.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename(portfolio.id);
                  if (e.key === 'Escape') {
                    setEditingId(null);
                    setEditName('');
                  }
                }}
                className="bg-gray-700 text-white px-2 py-1 rounded outline-none w-32"
                autoFocus
              />
            ) : (
              <>
                <button
                  onClick={() => setActivePortfolio(portfolio.id)}
                  className="font-medium"
                >
                  {portfolio.name}
                </button>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingId(portfolio.id);
                      setEditName(portfolio.name);
                    }}
                    className="text-xs hover:text-white"
                    title="Nimeä uudelleen"
                  >
                    ✏️
                  </button>
                  {portfolios.length > 1 && (
                    <button
                      onClick={() => {
                        void handleDelete(portfolio.id);
                      }}
                      className="text-xs hover:text-red-400"
                      title="Poista"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        {isAdding ? (
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleAddPortfolio}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPortfolio();
                if (e.key === 'Escape') {
                  setIsAdding(false);
                  setNewName('');
                }
              }}
              placeholder="Salkun nimi"
              className="bg-gray-700 text-white px-2 py-1 rounded outline-none w-32"
              autoFocus
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg
                       transition-colors duration-200 font-medium"
            title="Lisää salkku"
          >
            + Uusi salkku
          </button>
        )}
      </div>

      {/* Dialog Component */}
      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        type={dialog.type}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
