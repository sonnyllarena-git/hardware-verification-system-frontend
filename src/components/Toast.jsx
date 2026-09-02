import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const TOAST_STYLES = {
  success: "bg-green-600",
  error: "bg-red-600",
};

const AUTO_DISMISS_MS = 3500;

function Toast({ message, type = "success", onDismiss }) {
  // Effect (not a module-level timer) so the timer restarts per message and is
  // cleaned up if the component unmounts before it fires.
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const Icon = type === "error" ? XCircle : CheckCircle2;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-white shadow-lg ${
        TOAST_STYLES[type] ?? TOAST_STYLES.success
      }`}
    >
      <Icon className="h-4 w-4" />
      {message}
    </div>
  );
}

export default Toast;
