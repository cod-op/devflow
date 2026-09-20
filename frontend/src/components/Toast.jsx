import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = `${Date.now()}-${Math.random()}`;

      setToasts((current) => [...current, { id, message, type }]);

      window.setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[min(92vw,380px)] flex-col gap-3">
        {toasts.map((toast) => {
          const config = {
            success: {
              icon: <CheckCircle2 size={18} />,
              className: "border-emerald-200 bg-emerald-50 text-emerald-800",
            },
            error: {
              icon: <XCircle size={18} />,
              className: "border-red-200 bg-red-50 text-red-800",
            },
            info: {
              icon: <Info size={18} />,
              className: "border-blue-200 bg-blue-50 text-blue-800",
            },
          }[toast.type] || {
            icon: <Info size={18} />,
            className: "border-slate-200 bg-white text-slate-800",
          };

          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 text-sm font-medium shadow-lg ${config.className}`}
            >
              <span className="mt-0.5 shrink-0">{config.icon}</span>
              <p className="min-w-0 flex-1 leading-5">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-md p-1 opacity-70 hover:bg-black/5 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};
