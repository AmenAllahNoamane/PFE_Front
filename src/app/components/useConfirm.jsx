import { useState, useCallback } from 'react';

const useConfirm = () => {
  const [state, setState] = useState({ open: false, title: '', description: '', resolve: null, variant: 'default' });

  const confirm = useCallback(({ title, description, variant = 'default' }) => {
    return new Promise((resolve) => {
      setState({ open: true, title, description, variant, resolve });
    });
  }, []);

  const handleConfirm = () => {
    state.resolve(true);
    setState(s => ({ ...s, open: false }));
  };

  const handleCancel = () => {
    state.resolve(false);
    setState(s => ({ ...s, open: false }));
  };

  const colors = {
    success: { btn: 'bg-green-600 hover:bg-green-700', dot: 'bg-green-100' },
    danger:  { btn: 'bg-red-600   hover:bg-red-700',   dot: 'bg-red-100'   },
    info:    { btn: 'bg-blue-600  hover:bg-blue-700',   dot: 'bg-blue-100'  },
    default: { btn: 'bg-gray-800  hover:bg-gray-900',   dot: 'bg-gray-100'  },
  };
  const c = colors[state.variant] || colors.default;

  const ConfirmDialog = state.open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">{state.title}</h3>
        {state.description && <p className="text-sm text-gray-500 mb-5">{state.description}</p>}
        <div className="flex gap-3">
          <button onClick={handleCancel}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Annuler
          </button>
          <button onClick={handleConfirm}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition ${c.btn}`}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, ConfirmDialog };
};

export default useConfirm;