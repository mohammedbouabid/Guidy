import React from 'react';
import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmer l'action", 
  message = "Êtes-vous sûr de vouloir continuer ?",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      gradient: 'from-red-500 via-red-600 to-red-500',
      button: 'bg-red-600 hover:bg-red-700',
      icon: AlertCircle
    },
    warning: {
      gradient: 'from-orange-500 via-orange-600 to-orange-500',
      button: 'bg-orange-600 hover:bg-orange-700',
      icon: AlertTriangle
    },
    info: {
      gradient: 'from-blue-500 via-blue-600 to-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: Info
    }
  };

  const config = typeConfig[type] || typeConfig.danger;
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all animate-scaleIn">
        {/* Header moderne */}
        <div className={`relative bg-gradient-to-r ${config.gradient} px-8 py-5 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <IconComponent size={24} className="text-white" strokeWidth={2.5} />
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-all hover:rotate-90 duration-300 cursor-pointer"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 bg-gray-50">
          <p className="text-gray-700 leading-relaxed text-center">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 px-8 pb-8">
          <button
            onClick={onClose}
            className="px-8 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold cursor-pointer hover:scale-105"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-8 py-3 text-white rounded-xl transition-all font-semibold cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 ${config.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
