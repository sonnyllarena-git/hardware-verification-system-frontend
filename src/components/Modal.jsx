import { X } from "lucide-react";

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="cursor-pointer">
            <X className="h-5 w-5 text-gray-400 transition-colors hover:text-gray-600" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
