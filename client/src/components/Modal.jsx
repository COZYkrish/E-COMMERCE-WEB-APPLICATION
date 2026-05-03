import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;
  const widthClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${widthClass} max-h-[90vh] overflow-y-auto animate-fade-in`}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
