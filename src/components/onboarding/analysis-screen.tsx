"use client";

import Link from "next/link";
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  Notice,
  Progress,
} from "@/components/ui";
import { PageHeading } from "@/components/layout/page-heading";
import { Stepper } from "@/components/layout/stepper";
import { SampleDocumentPreview } from "@/components/pdf/sample-document-preview";
import { useForm } from "@/features/form/form-context";

export function AnalysisScreen() {
  const { activeForm, mode } = useForm();

  const fieldCount = activeForm.sections.reduce(
    (count, section) => count + section.fields.length,
    0,
  );

  const analysisItems = [
    {
      title: "Original form fields detected",
      description: `${fieldCount} editable fields, mapped to their original identifiers.`,
    },
    {
      title: `Questions organized into ${activeForm.sections.length} sections`,
      description: activeForm.sections.map((s) => s.title).join(", "),
    },
    {
      title: "Clearer labels and helpful guidance",
      description: "Plain-language explanations alongside the original PDF.",
    },
  ];

  return (
    <section
      id="view-analysis"
      className="view"
      aria-labelledby="analysis-heading"
    >
      <Stepper current={1} />
      <PageHeading
        titleId="analysis-heading"
        eyebrow="From document to direction"
        title="Your form, made clear."
        description="We found the fields. You bring the answers."
        action={
          <Badge>
            <Icon name="check" />
            {mode === "uploaded"
              ? "Document analysis complete"
              : "Sample analysis complete"}
          </Badge>
        }
      />
      <div className="workspace">
        <SampleDocumentPreview form={activeForm} />
        <Card>
          <CardHeader>
            <span className="eyebrow">Form intelligence</span>
            <h2>A little structure goes a long way.</h2>
            <p>
              {activeForm.title} · {activeForm.academicYear} entry
            </p>
          </CardHeader>
          <CardBody>
            <Progress
              value={100}
              label={
                mode === "uploaded"
                  ? "Uploaded form analysis complete"
                  : "Prepared sample analysis complete"
              }
            />
            <div className="analysis-list">
              {analysisItems.map((item) => (
                <div className="analysis-item" key={item.title}>
                  <span className="check-circle">
                    <Icon name="check" />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="stats">
              <div className="stat">
                <strong>{fieldCount}</strong>
                <span>fillable fields</span>
              </div>
              <div className="stat">
                <strong>{activeForm.sections.length}</strong>
                <span>simple sections</span>
              </div>
              <div className="stat">
                <strong>~{activeForm.estimatedMinutes} min</strong>
                <span>to complete</span>
              </div>
            </div>
            <Notice tone="warning" title="A suggestion, not a new requirement">
              “Student ID” is interpreted as optional for new applicants.
              Confirm the institution’s instructions before submitting.
            </Notice>
            <p className="small muted" style={{ marginTop: 16 }}>
              AI improves the wording; the PDF’s field names and options stay
              intact. This preview uses {mode === "uploaded" ? "your uploaded document" : "a prepared sample analysis"}.
            </p>
          </CardBody>
          <CardFooter>
            <Link className="btn btn-ghost btn-sm" href="/">
              Change document
            </Link>
            <Link className="btn btn-primary" href="/fill">
              Let’s fill it in
              <Icon name="arrow" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
