"use client";

import { useState } from "react";
import { Badge, Icon, IconButton } from "@/components/ui";
import type { SampleForm } from "@/data/sample-form";

export function SampleDocumentPreview({ form }: { form: SampleForm }) {
  const [enlarged, setEnlarged] = useState(false);
  return (
    <div className="preview">
      <div className="preview-toolbar">
        <span>
          <Icon name="file" />
          {form.filename}
        </span>
        <Badge tone="neutral">Original PDF</Badge>
      </div>
      <div className="paper-stage">
        <article
          className="paper"
          aria-label="Illustrated sample application PDF"
          style={{ zoom: enlarged ? 1.15 : 1 }}
        >
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
          {form.sections.map((section, index) => (
            <section key={section.id}>
              <h4>
                {String(index + 1).padStart(2, "0")} &nbsp; {section.title}
              </h4>
              {section.id === "declarations" ? (
                <div style={{ lineHeight: 1.8, fontSize: 8 }}>
                  {section.fields.map((field, fieldIndex) => (
                    <p key={field.id} style={{ marginTop: fieldIndex ? 6 : 0 }}>
                      <span aria-hidden="true">☐ </span>
                      {field.label}
                      {field.required ? " *" : ""}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="pdf-grid">
                  {section.fields.map((field) => (
                    <div className="pdf-field" key={field.id}>
                      <span>
                        {field.label}
                        {field.required ? " *" : ""}
                      </span>
                      <div
                        className="pdf-value"
                        aria-label={`${field.label}: blank`}
                      >
                        &nbsp;
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
          <div className="pdf-foot">
            <span>FICTIONAL SAMPLE · FOR DEMONSTRATION ONLY</span>
            <span>Page 1 of {form.pageCount}</span>
          </div>
        </article>
      </div>
      <div className="preview-bottom">
        <span>Page 1 / {form.pageCount}</span>
        <span>Illustrated document preview</span>
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
