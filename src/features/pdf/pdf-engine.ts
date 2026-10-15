import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown } from "pdf-lib";
import type { SampleForm, SampleSection, SampleField } from "@/data/sample-form";

export type ParsedPdfResult =
  | {
      ok: true;
      title: string;
      filename: string;
      buffer: ArrayBuffer;
      pageCount: number;
      formSchema: SampleForm;
    }
  | {
      ok: false;
      error: "password-protected" | "no-fields" | "corrupt";
      filename: string;
      message: string;
    };

export async function parsePdfFile(file: File): Promise<ParsedPdfResult> {
  const filename = file.name;
  let buffer: ArrayBuffer;
  try {
    buffer = await file.arrayBuffer();
  } catch {
    return {
      ok: false,
      error: "corrupt",
      filename,
      message: "We couldn’t read this file from your device.",
    };
  }

  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  } catch {
    return {
      ok: false,
      error: "corrupt",
      filename,
      message: "This document appears to be corrupted or not a valid PDF.",
    };
  }

  if (pdfDoc.isEncrypted) {
    return {
      ok: false,
      error: "password-protected",
      filename,
      message: `FormFlow can’t read the fields in ${filename}. If you have permission, save an unlocked copy in your PDF editor and upload that version.`,
    };
  }

  let rawFields: ReturnType<ReturnType<typeof pdfDoc.getForm>["getFields"]>;
  try {
    const form = pdfDoc.getForm();
    rawFields = form.getFields();
  } catch {
    rawFields = [];
  }

  if (!rawFields || rawFields.length === 0) {
    return {
      ok: false,
      error: "no-fields",
      filename,
      message: `We couldn’t find interactive fields in ${filename}. It may be a scan or a flattened document. Ask the institution for a fillable version, or explore our sample.`,
    };
  }

  const pageCount = pdfDoc.getPageCount();

  // Convert PDF fields into structured sections
  const extractedFields: SampleField[] = rawFields.map((field) => {
    const name = field.getName();
    const cleanLabel = formatPdfFieldLabel(name);

    if (field instanceof PDFCheckBox) {
      return {
        id: name,
        pdfName: name,
        label: cleanLabel,
        type: "checkbox" as const,
        required: field.isRequired?.() ?? false,
      };
    }

    if (field instanceof PDFDropdown) {
      const options = field.getOptions();
      return {
        id: name,
        pdfName: name,
        label: cleanLabel,
        type: "dropdown" as const,
        required: field.isRequired?.() ?? false,
        options: options.length > 0 ? options : ["Option 1", "Option 2"],
      };
    }

    return {
      id: name,
      pdfName: name,
      label: cleanLabel,
      type: "text" as const,
      required: (field as PDFTextField).isRequired?.() ?? false,
    };
  });

  // Attempt server AI analysis endpoint if available in browser
  let sections: SampleSection[] = [];
  try {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({
          filename,
          fields: extractedFields.map((f) => ({
            name: f.pdfName,
            type: f.type,
            required: f.required,
            options: f.type === "dropdown" ? f.options : undefined,
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.sections) && data.sections.length > 0) {
          sections = data.sections;
        }
      }
    }
  } catch {
    // Fallback to local grouping
  }

  if (sections.length === 0) {
    const chunkSize = Math.max(1, Math.ceil(extractedFields.length / 3));
    sections = [
      {
        id: "section-1",
        title: "General Information",
        fields: extractedFields.slice(0, chunkSize),
      },
    ];

    if (extractedFields.length > chunkSize) {
      sections.push({
        id: "section-2",
        title: "Details & Options",
        fields: extractedFields.slice(chunkSize, chunkSize * 2),
      });
    }

    if (extractedFields.length > chunkSize * 2) {
      sections.push({
        id: "section-3",
        title: "Confirmations",
        fields: extractedFields.slice(chunkSize * 2),
      });
    }
  }

  const formSchema: SampleForm = {
    filename,
    title: filename.replace(/\.pdf$/i, "").replace(/[-_]/g, " "),
    academicYear: "2027–2028",
    reference: "FORM-UPLOADED",
    pageCount,
    estimatedMinutes: Math.max(2, Math.ceil(extractedFields.length * 0.4)),
    sections,
  };

  return {
    ok: true,
    title: formSchema.title,
    filename,
    buffer,
    pageCount,
    formSchema,
  };
}

function formatPdfFieldLabel(rawName: string): string {
  const lastPart = rawName.split(".").pop() ?? rawName;
  const withSpaces = lastPart
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .trim();
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
}

/**
 * Creates the exact demo PDF matching the design.html specification.
 */
export function createDemoPdfBlob(
  answers: Record<string, string | boolean>,
  fieldLabels: Record<string, string>,
): Blob {
  const ascii = (value: string) =>
    String(value)
      .replace(/[^\x20-\x7E]/g, "?")
      .replace(/([\\()])/g, "\\$1");

  const lines: string[] = [
    "FORMFLOW / DESIGN PROTOTYPE",
    "NORTHBRIDGE UNIVERSITY",
    "Undergraduate application - sample answers",
    "",
    "DEMO EXPORT - NOT AN OFFICIAL APPLICATION",
    "This file is generated from the interactive design preview.",
    "It is not a filled copy of an uploaded PDF.",
    "",
  ];

  for (const key of Object.keys(fieldLabels)) {
    const val = answers[key];
    const displayVal =
      typeof val === "boolean"
        ? val
          ? "Yes"
          : "Not selected"
        : val && String(val).trim()
          ? String(val).trim()
          : "Not provided";

    const text = `${fieldLabels[key]}: ${displayVal}`;
    for (let i = 0; i < text.length; i += 83) {
      lines.push(text.slice(i, i + 83));
    }
  }

  lines.push(
    "",
    "Fictional institution. No application has been submitted.",
    "Non-ASCII characters are represented by ? in this sample export.",
  );

  const stream =
    "BT /F1 11 Tf 45 790 Td 19 TL " +
    lines.map((line, i) => (i ? "T* " : "") + "(" + ascii(line) + ") Tj").join("\n") +
    " ET";

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const start = pdf.length;
  pdf += "xref\n0 6\n0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

/**
 * Fills an uploaded PDF buffer with user answers using pdf-lib.
 */
export async function fillUploadedPdf(
  buffer: ArrayBuffer,
  answers: Record<string, string | boolean>,
): Promise<Blob> {
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const form = pdfDoc.getForm();

  for (const [key, value] of Object.entries(answers)) {
    try {
      const textField = form.getTextField(key);
      if (textField) {
        textField.setText(String(value ?? ""));
        continue;
      }
    } catch {
      // not a text field
    }

    try {
      const checkBox = form.getCheckBox(key);
      if (checkBox) {
        if (value) checkBox.check();
        else checkBox.uncheck();
        continue;
      }
    } catch {
      // not a checkbox
    }

    try {
      const dropdown = form.getDropdown(key);
      if (dropdown && value) {
        dropdown.select(String(value));
        continue;
      }
    } catch {
      // not a dropdown
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as unknown as BlobPart], {
    type: "application/pdf",
  });
}
