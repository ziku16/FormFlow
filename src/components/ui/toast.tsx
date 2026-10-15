"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const ToastContext = createContext<((message: string) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const notify = useCallback((nextMessage: string) => {
    clearTimeout(timer.current);
    setMessage(nextMessage);
    timer.current = setTimeout(() => setMessage(""), 4200);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        className="toast"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        hidden={!message}
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error("useToast must be used within ToastProvider.");
  return notify;
}
