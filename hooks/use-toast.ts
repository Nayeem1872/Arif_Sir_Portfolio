import { useCallback, useState } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "success", duration });
    },
    [addToast],
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "error", duration });
    },
    [addToast],
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "info", duration });
    },
    [addToast],
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "warning", duration });
    },
    [addToast],
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
};
