export const MAX_PDF_BYTES = 10 * 1024 * 1024;

export type FileErrorCode =
  | "file-count"
  | "empty"
  | "too-large"
  | "wrong-type"
  | "invalid-signature"
  | "unreadable";

export type FileValidationError = {
  code: FileErrorCode;
  title: string;
  message: string;
};

export type FileValidationResult =
  { ok: true; file: File } | { ok: false; error: FileValidationError };

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export async function validatePdfSelection(
  files: readonly File[],
): Promise<FileValidationResult> {
  if (files.length !== 1) {
    return {
      ok: false,
      error: {
        code: "file-count",
        title: "One form at a time.",
        message:
          "Choose a single PDF so we can keep its fields and answers together.",
      },
    };
  }

  const file = files[0];
  if (file.size === 0) {
    return {
      ok: false,
      error: {
        code: "empty",
        title: "This file is empty.",
        message: `${file.name} has no content. Save a complete PDF and try again.`,
      },
    };
  }
  if (file.size > MAX_PDF_BYTES) {
    return {
      ok: false,
      error: {
        code: "too-large",
        title: "A little too large for now.",
        message: `${file.name} is ${formatFileSize(file.size)}. The limit is 10 MB. Choose a smaller fillable copy and keep its interactive fields intact.`,
      },
    };
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return {
      ok: false,
      error: {
        code: "wrong-type",
        title: "Let’s start with a PDF.",
        message: `${file.name} isn’t a PDF filename. Choose a document saved in PDF format.`,
      },
    };
  }

  try {
    const header = await file.slice(0, 5).text();
    if (header !== "%PDF-") {
      return {
        ok: false,
        error: {
          code: "invalid-signature",
          title: "This doesn’t appear to be a PDF.",
          message:
            "The file’s contents don’t match its extension. Export a new PDF from the original document and try again.",
        },
      };
    }
  } catch {
    return {
      ok: false,
      error: {
        code: "unreadable",
        title: "We couldn’t read this file.",
        message:
          "It may have moved or become unavailable. Choose the file again, or save a local copy first.",
      },
    };
  }

  return { ok: true, file };
}
