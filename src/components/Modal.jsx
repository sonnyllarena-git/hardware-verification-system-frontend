import { X } from "lucide-react";

function Modal({ title, onClose, children, maxWidth = "max-w-sm" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`w-full ${maxWidth} rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="cursor-pointer">
            <X className="h-5 w-5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
