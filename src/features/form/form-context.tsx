"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { sampleForm, type SampleForm } from "@/data/sample-form";
import {
  createDemoPdfBlob,
  fillUploadedPdf,
  type ParsedPdfResult,
} from "@/features/pdf/pdf-engine";

import {
  defaultSampleAnswers,
  sampleFieldLabels,
  originalSampleNames,
  displayValue,
  validateFieldValue,
  getFormErrors,
} from "./form-state";

export {
  defaultSampleAnswers,
  sampleFieldLabels,
  originalSampleNames,
  displayValue,
  validateFieldValue,
  getFormErrors,
};

type FormContextType = {
  mode: "sample" | "uploaded";
  answers: Record<string, string | boolean>;
  activeSection: number;
  highlightedField: string | null;
  useOriginalLabels: boolean;
  uploadedPdf: (ParsedPdfResult & { ok: true }) | null;
  activeForm: SampleForm;
  validationErrors: Record<string, string>;
  downloadStatus: string;
  setAnswer: (fieldId: string, value: string | boolean) => void;
  setAnswers: (next: Record<string, string | boolean>) => void;
  setActiveSection: (section: number) => void;
  setHighlightedField: (fieldId: string | null) => void;
  setUseOriginalLabels: (val: boolean | ((prev: boolean) => boolean)) => void;
  setUploadedPdf: (pdf: (ParsedPdfResult & { ok: true }) | null) => void;
  switchToSample: () => void;
  validateSection: (index: number) => {
    valid: boolean;
    errors: Record<string, string>;
    firstErrorFieldId?: string;
  };
  validateAll: () => {
    valid: boolean;
    errors: Record<string, string>;
    firstErrorFieldId?: string;
    firstErrorSection?: number;
  };
  clearFieldError: (fieldId: string) => void;
  resetToDefaults: () => void;
  clearAnswers: () => void;
  generatePdfDownload: () => Promise<{ blob: Blob; filename: string }>;
};

const FormContext = createContext<FormContextType | null>(null);

const STORAGE_ANSWERS_KEY = "formflow_answers_v1";
const STORAGE_SECTION_KEY = "formflow_section_v1";
const STORAGE_MODE_KEY = "formflow_mode_v1";

export function FormProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswersState] = useState<Record<string, string | boolean>>(
    () => {
      if (typeof window === "undefined") return defaultSampleAnswers;
      try {
        const saved = localStorage.getItem(STORAGE_ANSWERS_KEY);
        return saved ? JSON.parse(saved) : defaultSampleAnswers;
      } catch {
        return defaultSampleAnswers;
      }
    },
  );
  const [activeSection, setActiveSectionState] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem(STORAGE_SECTION_KEY);
      return saved !== null ? Number(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [mode, setMode] = useState<"sample" | "uploaded">(() => {
    if (typeof window === "undefined") return "sample";
    try {
      const saved = localStorage.getItem(STORAGE_MODE_KEY);
      return saved === "uploaded" ? "uploaded" : "sample";
    } catch {
      return "sample";
    }
  });
  const [uploadedPdf, setUploadedPdfState] = useState<
    (ParsedPdfResult & { ok: true }) | null
  >(null);

  const setUploadedPdf = useCallback(
    (pdf: (ParsedPdfResult & { ok: true }) | null) => {
      setUploadedPdfState(pdf);
      if (pdf) {
        setMode("uploaded");
        try {
          localStorage.setItem(STORAGE_MODE_KEY, "uploaded");
          localStorage.setItem(STORAGE_SECTION_KEY, "0");
        } catch {
          // Safe fallback
        }
        setActiveSectionState(0);
        const initialAnswers: Record<string, string | boolean> = {};
        for (const section of pdf.formSchema.sections) {
          for (const field of section.fields) {
            initialAnswers[field.id] = field.type === "checkbox" ? false : "";
          }
        }
        setAnswersState(initialAnswers);
        try {
          localStorage.setItem(
            STORAGE_ANSWERS_KEY,
            JSON.stringify(initialAnswers),
          );
        } catch {
          // Safe fallback
        }
      }
    },
    [],
  );
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [useOriginalLabels, setUseOriginalLabels] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [downloadStatus, setDownloadStatus] = useState(
    "Ready to export your completed PDF.",
  );

  const setAnswer = useCallback((fieldId: string, value: string | boolean) => {
    setAnswersState((prev) => {
      const updated = { ...prev, [fieldId]: value };
      try {
        localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(updated));
      } catch {
        // Safe fallback
      }
      return updated;
    });
  }, []);

  const setAnswers = useCallback(
    (next: Record<string, string | boolean>) => {
      setAnswersState(next);
      try {
        localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(next));
      } catch {
        // Safe fallback
      }
    },
    [],
  );

  const setActiveSection = useCallback((section: number) => {
    setActiveSectionState(section);
    try {
      localStorage.setItem(STORAGE_SECTION_KEY, String(section));
    } catch {
      // Safe fallback
    }
  }, []);

  const switchToSample = useCallback(() => {
    setMode("sample");
    setUploadedPdf(null);
    setAnswersState(defaultSampleAnswers);
    setActiveSectionState(0);
    setValidationErrors({});
    try {
      localStorage.setItem(STORAGE_MODE_KEY, "sample");
      localStorage.setItem(
        STORAGE_ANSWERS_KEY,
        JSON.stringify(defaultSampleAnswers),
      );
      localStorage.setItem(STORAGE_SECTION_KEY, "0");
    } catch {
      // Safe fallback
    }
  }, [setUploadedPdf]);

  const resetToDefaults = useCallback(() => {
    setAnswersState(defaultSampleAnswers);
    setActiveSectionState(0);
    setValidationErrors({});
    try {
      localStorage.setItem(
        STORAGE_ANSWERS_KEY,
        JSON.stringify(defaultSampleAnswers),
      );
      localStorage.setItem(STORAGE_SECTION_KEY, "0");
    } catch {
      // Safe fallback
    }
  }, []);

  const clearAnswers = useCallback(() => {
    const cleared: Record<string, string | boolean> = {};
    for (const key of Object.keys(answers)) {
      cleared[key] = typeof answers[key] === "boolean" ? false : "";
    }
    setAnswersState(cleared);
    setActiveSectionState(0);
    setValidationErrors({});
    try {
      localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(cleared));
      localStorage.setItem(STORAGE_SECTION_KEY, "0");
    } catch {
      // Safe fallback
    }
  }, [answers]);

  const activeForm: SampleForm = useMemo(() => {
    if (mode === "uploaded" && uploadedPdf?.formSchema) {
      return uploadedPdf.formSchema;
    }
    return sampleForm;
  }, [mode, uploadedPdf]);

  const clearFieldError = useCallback((fieldId: string) => {
    setValidationErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const copy = { ...prev };
      delete copy[fieldId];
      return copy;
    });
  }, []);

  const validateSection = useCallback(
    (index: number) => {
      const section = activeForm.sections[index];
      if (!section) return { valid: true, errors: {} };

      const nextErrors: Record<string, string> = {};
      let firstErrorFieldId: string | undefined;

      for (const field of section.fields) {
        const val = answers[field.id];
        const res = validateFieldValue(
          field.id,
          val,
          field.required,
          field.label,
        );
        if (!res.valid && res.message) {
          nextErrors[field.id] = res.message;
          if (!firstErrorFieldId) firstErrorFieldId = field.id;
        }
      }

      setValidationErrors((prev) => {
        const cleaned = { ...prev };
        for (const field of section.fields) {
          delete cleaned[field.id];
        }
        return { ...cleaned, ...nextErrors };
      });

      return {
        valid: Object.keys(nextErrors).length === 0,
        errors: nextErrors,
        firstErrorFieldId,
      };
    },
    [activeForm, answers],
  );

  const validateAll = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    let firstErrorFieldId: string | undefined;
    let firstErrorSection: number | undefined;

    activeForm.sections.forEach((section, sIndex) => {
      for (const field of section.fields) {
        const val = answers[field.id];
        const res = validateFieldValue(
          field.id,
          val,
          field.required,
          field.label,
        );
        if (!res.valid && res.message) {
          nextErrors[field.id] = res.message;
          if (!firstErrorFieldId) {
            firstErrorFieldId = field.id;
            firstErrorSection = sIndex;
          }
        }
      }
    });

    setValidationErrors(nextErrors);
    return {
      valid: Object.keys(nextErrors).length === 0,
      errors: nextErrors,
      firstErrorFieldId,
      firstErrorSection,
    };
  }, [activeForm, answers]);

  const generatePdfDownload = useCallback(async () => {
    setDownloadStatus(
      "Your completed PDF has been generated and downloaded.",
    );
    if (mode === "uploaded" && uploadedPdf?.buffer) {
      const blob = await fillUploadedPdf(uploadedPdf.buffer, answers);
      const filename = uploadedPdf.filename.replace(
        /\.pdf$/i,
        "_completed.pdf",
      );
      return { blob, filename };
    }

    const fieldLabelsMap = Object.fromEntries(
      activeForm.sections
        .flatMap((s) => s.fields)
        .map((f) => [f.id, f.label]),
    );
    const blob = createDemoPdfBlob(answers, fieldLabelsMap);
    const filename = activeForm.filename.replace(/\.pdf$/i, "_completed.pdf");
    return { blob, filename };
  }, [mode, uploadedPdf, answers, activeForm]);

  const value = useMemo(
    () => ({
      mode,
      answers,
      activeSection,
      highlightedField,
      useOriginalLabels,
      uploadedPdf,
      activeForm,
      validationErrors,
      downloadStatus,
      setAnswer,
      setAnswers,
      setActiveSection,
      setHighlightedField,
      setUseOriginalLabels,
      setUploadedPdf,
      switchToSample,
      validateSection,
      validateAll,
      clearFieldError,
      resetToDefaults,
      clearAnswers,
      generatePdfDownload,
    }),
    [
      mode,
      answers,
      activeSection,
      highlightedField,
      useOriginalLabels,
      uploadedPdf,
      activeForm,
      validationErrors,
      downloadStatus,
      setAnswer,
      setAnswers,
      setActiveSection,
      setHighlightedField,
      setUseOriginalLabels,
      setUploadedPdf,
      switchToSample,
      validateSection,
      validateAll,
      clearFieldError,
      resetToDefaults,
      clearAnswers,
      generatePdfDownload,
    ],
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm must be used within FormProvider.");
  return ctx;
}
