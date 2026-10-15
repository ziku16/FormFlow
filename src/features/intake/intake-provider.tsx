"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  validatePdfSelection,
  type FileValidationError,
} from "./validate-file";

export type IntakeState =
  | { status: "idle" }
  | { status: "validating"; name: string }
  | { status: "selected"; file: File }
  | { status: "error"; error: FileValidationError };

type IntakeContextValue = {
  state: IntakeState;
  selectFiles: (files: readonly File[]) => Promise<void>;
  clearSelection: () => void;
};

const IntakeContext = createContext<IntakeContextValue | null>(null);

export function IntakeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IntakeState>({ status: "idle" });
  const requestNumber = useRef(0);

  useEffect(
    () => () => {
      requestNumber.current += 1;
    },
    [],
  );

  async function selectFiles(files: readonly File[]) {
    const request = ++requestNumber.current;
    setState({
      status: "validating",
      name: files[0]?.name ?? "your selection",
    });
    const result = await validatePdfSelection(files);
    if (request !== requestNumber.current) return;
    setState(
      result.ok
        ? { status: "selected", file: result.file }
        : { status: "error", error: result.error },
    );
  }

  function clearSelection() {
    requestNumber.current += 1;
    setState({ status: "idle" });
  }

  return (
    <IntakeContext.Provider value={{ state, selectFiles, clearSelection }}>
      {children}
    </IntakeContext.Provider>
  );
}

export function useIntake() {
  const context = useContext(IntakeContext);
  if (!context)
    throw new Error("useIntake must be used within IntakeProvider.");
  return context;
}
