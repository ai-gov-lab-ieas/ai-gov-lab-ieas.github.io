import React from 'react';
import { X } from 'lucide-react';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  closeText: string;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  closeText
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors duration-200"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-lg max-w-none">
            <div
              className="text-slate-700 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  );
};