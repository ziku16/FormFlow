"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, Icon, Notice, useToast } from "@/components/ui";
import { PageHeading } from "@/components/layout/page-heading";
import { Stepper } from "@/components/layout/stepper";
import { SampleDocumentPreview } from "@/components/pdf/sample-document-preview";
import {
  useForm,
  sampleFieldLabels,
  displayValue,
  getFormErrors,
} from "@/features/form/form-context";

export function ReviewScreen() {
  const router = useRouter();
  const showToast = useToast();
  const {
    activeForm,
    answers,
    mode,
    setActiveSection,
    validateAll,
  } = useForm();

  // Review groups based on active form
  const reviewGroups = useMemo(() => {
    return activeForm.sections.map((section) => ({
      title: section.title,
      fields: section.fields.map((f) => ({
        id: f.id,
        label: sampleFieldLabels[f.id] ?? f.label,
        value: answers[f.id],
      })),
    }));
  }, [activeForm, answers]);

  // Purely calculate remaining invalid required fields without calling setState during render
  const remainingCount = useMemo(() => {
    return Object.keys(getFormErrors(answers, activeForm.sections)).length;
  }, [answers, activeForm.sections]);

  function handleEditSection(index: number) {
    setActiveSection(index);
    router.push("/fill");
  }

  function handlePreparePdf() {
    const res = validateAll();
    if (!res.valid) {
      if (res.firstErrorSection !== undefined) {
        setActiveSection(res.firstErrorSection);
      }
      showToast("Complete the highlighted fields before preparing your sample.");
      router.push("/fill");
      setTimeout(() => {
        if (res.firstErrorFieldId) {
          document.getElementById(res.firstErrorFieldId)?.focus();
        }
      }, 100);
      return;
    }

    router.push("/download");
  }

  return (
    <section id="view-review" className="view" aria-labelledby="review-heading">
      <Stepper current={3} />
      <PageHeading
        titleId="review-heading"
        eyebrow="The final once-over"
        title="Looks like you. Reads like you."
        description="Take a moment to check every detail before preparing your PDF."
        action={
          <Badge tone={remainingCount > 0 ? "warning" : "success"}>
            <Icon name="check" />
            {remainingCount > 0
              ? `${remainingCount} required ${remainingCount === 1 ? "answer" : "answers"} to check`
              : "All required fields complete"}
          </Badge>
        }
      />

      <div className="workspace">
        <SampleDocumentPreview form={activeForm} filled answers={answers} />

        <div>
          <Notice
            tone="success"
            icon="shield"
            title="Your original document stays intact"
            style={{ marginBottom: 16 }}
          >
            Answers map to existing PDF fields. No rearranged pages or
            recreated layouts.
          </Notice>

          <Card id="review-content">
            {reviewGroups.map((group, groupIndex) => (
              <section className="review-group" key={group.title}>
                <div className="review-group-head">
                  <h3>{group.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSection(groupIndex)}
                    aria-label={`Edit ${group.title}`}
                  >
                    <Icon name="edit" />
                    Edit
                  </Button>
                </div>
                <dl>
                  {group.fields.map((field) => (
                    <div className="review-row" key={field.id}>
                      <dt>{field.label}</dt>
                      <dd>{displayValue(field.value)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </Card>

          <Notice tone="warning" style={{ marginTop: 17 }}>
            Double-check names, dates, and program choices. Format checks can’t
            confirm that your personal details are correct.
          </Notice>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 22,
              gap: 12,
            }}
          >
            <Button variant="secondary" onClick={() => router.push("/fill")}>
              Back to form
            </Button>
            <Button
              variant="primary"
              id="prepare-pdf"
              onClick={handlePreparePdf}
            >
              Prepare my PDF
              <Icon name="arrow" />
            </Button>
          </div>

          <p className="prototype-note">
            {mode === "uploaded"
              ? "Completed PDF will preserve all original vector formatting and fillable AcroForm fields."
              : "Prototype: export creates a labeled sample PDF, not a filled uploaded document."}
          </p>
        </div>
      </div>
    </section>
  );
}
