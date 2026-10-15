"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Icon, IconButton } from "@/components/ui";
import { sampleForm, type SampleForm } from "@/data/sample-form";
import { cn } from "@/lib/cn";
import {
  displayValue,
  useForm,
  defaultSampleAnswers,
} from "@/features/form/form-context";
import { useIsMounted } from "@/lib/use-mounted";

export type SampleDocumentPreviewProps = {
  form?: SampleForm;
  filled?: boolean;
  answers?: Record<string, string | boolean>;
  highlightedFieldId?: string | null;
};

export function SampleDocumentPreview({
  form = sampleForm,
  filled = false,
  answers = {},
  highlightedFieldId = null,
}: SampleDocumentPreviewProps) {
  const isMounted = useIsMounted();
  const [enlarged, setEnlarged] = useState(false);
  const [viewTab, setViewTab] = useState<"outline" | "document">("outline");
  const { uploadedPdf } = useForm();

  // Guard against SSR hydration mismatches by rendering default answers until mounted
  const currentAnswers = isMounted ? answers : defaultSampleAnswers;

  const isSample = form.filename === "northbridge_application.pdf";

  // Create an object URL if a real PDF binary is available in memory
  const pdfBlobUrl = useMemo(() => {
    if (typeof window === "undefined" || !uploadedPdf?.buffer) return null;
    try {
      const blob = new Blob([uploadedPdf.buffer], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }, [uploadedPdf]);

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  const totalFields = form.sections.reduce(
    (count, section) => count + section.fields.length,
    0,
  );

  return (
    <div className="preview">
      <div className="preview-toolbar">
        <span
          style={{
            maxWidth: 220,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Icon name="file" />
          {form.filename}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginLeft: "auto",
          }}
        >
          {pdfBlobUrl && !isSample && (
            <div style={{ display: "inline-flex", gap: 4 }}>
              <button
                type="button"
                className={cn("pill", viewTab === "outline" ? "blue" : "gray")}
                style={{
                  cursor: "pointer",
                  border: "none",
                  fontSize: 10,
                  padding: "2px 8px",
                }}
                onClick={() => setViewTab("outline")}
                aria-pressed={viewTab === "outline"}
              >
                Outline view
              </button>
              <button
                type="button"
                className={cn("pill", viewTab === "document" ? "blue" : "gray")}
                style={{
                  cursor: "pointer",
                  border: "none",
                  fontSize: 10,
                  padding: "2px 8px",
                }}
                onClick={() => setViewTab("document")}
                aria-pressed={viewTab === "document"}
              >
                Original PDF
              </button>
            </div>
          )}
          <Badge tone="neutral">Original PDF</Badge>
        </div>
      </div>

      {viewTab === "document" && pdfBlobUrl && !isSample ? (
        <div className="paper-stage" style={{ padding: 12 }}>
          <iframe
            src={`${pdfBlobUrl}#toolbar=0`}
            title={`Original PDF: ${form.filename}`}
            style={{
              width: "100%",
              height: 540,
              border: "1px solid var(--border-neutral)",
              borderRadius: "var(--radius-sm)",
              background: "#ffffff",
            }}
          />
        </div>
      ) : (
        <div className="paper-stage">
          <article
            className="paper"
            suppressHydrationWarning
            aria-label={
              isSample
                ? "Illustrated sample application PDF"
                : `Interactive outline of ${form.filename}`
            }
            style={{ zoom: enlarged ? 1.15 : 1 }}
          >
            {isSample ? (
              <>
                <div className="crest">
                  <Icon name="shield" />
                  <div>
                    <div className="college">
                      NORTHBRIDGE
                      <br />
                      UNIVERSITY
                    </div>
                    <span className="doc-caption">
                      OFFICE OF UNDERGRADUATE ADMISSIONS
                    </span>
                  </div>
                </div>
                <h3>{form.title}</h3>
                <p className="doc-caption">
                  Academic year {form.academicYear} &nbsp; | &nbsp; Form{" "}
                  {form.reference}
                </p>
                <p style={{ marginTop: 13, fontSize: 8, lineHeight: 1.7 }}>
                  Please complete all required fields. Provide your details as they
                  appear on official documents. Review your information before
                  submitting.
                </p>
              </>
            ) : (
              <>
                <div className="crest">
                  <Icon name="file" />
                  <div>
                    <div
                      className="college"
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        fontSize: 11,
                      }}
                    >
                      {form.filename.replace(/\.pdf$/i, "")}
                    </div>
                    <span className="doc-caption">
                      OFFICIAL FILLABLE DOCUMENT · {form.pageCount}{" "}
                      {form.pageCount === 1 ? "PAGE" : "PAGES"}
                    </span>
                  </div>
                </div>
                <h3 style={{ textTransform: "capitalize" }}>{form.title}</h3>
                <p className="doc-caption">
                  Detected fillable form &nbsp; | &nbsp; {totalFields} interactive fields
                </p>
                <p style={{ marginTop: 13, fontSize: 8, lineHeight: 1.7 }}>
                  Original PDF structure identified and parsed by FormFlow AI. Fields below map directly to the corresponding interactive fields in your document.
                </p>
              </>
            )}

            {form.sections.map((section, index) => {
              const isDeclarations =
                section.id === "declarations" ||
                section.fields.every((f) => f.type === "checkbox");

              return (
                <section key={section.id}>
                  <h4>
                    {String(index + 1).padStart(2, "0")} &nbsp; {section.title}
                  </h4>
                  {isDeclarations ? (
                    <div style={{ lineHeight: 1.8, fontSize: 8 }}>
                      {section.fields.map((field, fieldIndex) => {
                        const isChecked = Boolean(currentAnswers[field.id]);
                        const isHighlighted = highlightedFieldId === field.id;
                        return (
                          <p
                            key={field.id}
                            data-pdf-field={field.id}
                            suppressHydrationWarning
                            style={{
                              marginTop: fieldIndex ? 6 : 0,
                              backgroundColor: isHighlighted
                                ? "var(--secondary-50)"
                                : undefined,
                              borderRadius: 3,
                              padding: isHighlighted ? "1px 4px" : undefined,
                            }}
                          >
                            <span aria-hidden="true" suppressHydrationWarning>
                              {filled && isChecked ? "☑ " : "☐ "}
                            </span>
                            {field.label}
                            {field.required ? " *" : ""}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="pdf-grid">
                      {section.fields.map((field) => {
                        const val = currentAnswers[field.id];
                        const isHighlighted = highlightedFieldId === field.id;
                        return (
                          <div
                            className={cn(
                              "pdf-field",
                              isHighlighted && "highlight",
                            )}
                            data-pdf-field={field.id}
                            key={field.id}
                          >
                            <span>
                              {field.label}
                              {field.required ? " *" : ""}
                            </span>
                            <div
                              className="pdf-value"
                              suppressHydrationWarning
                              aria-label={`${field.label}: ${filled && val ? displayValue(val) : "blank"}`}
                            >
                              {filled && val !== undefined && val !== ""
                                ? displayValue(val)
                                : "\u00A0"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}

            <div className="pdf-foot">
              <span>
                {isSample
                  ? "FICTIONAL SAMPLE · FOR DEMONSTRATION ONLY"
                  : `ORIGINAL STRUCTURE PRESERVED · ${form.filename}`}
              </span>
              <span>Page 1 of {form.pageCount}</span>
            </div>
          </article>
        </div>
      )}

      <div className="preview-bottom">
        <span>Page 1 / {form.pageCount}</span>
        <span>
          {isSample
            ? "Illustrated document preview"
            : viewTab === "document"
              ? "Original PDF view"
              : "Form outline preview"}
        </span>
        <IconButton
          label={`PDF preview zoom ${enlarged ? "115" : "100"}%. Click to toggle.`}
          style={{ width: 48, fontSize: 10 }}
          onClick={() => setEnlarged((value) => !value)}
          aria-pressed={enlarged}
        >
          {enlarged ? "115%" : "100%"}
        </IconButton>
      </div>
    </div>
  );
}
