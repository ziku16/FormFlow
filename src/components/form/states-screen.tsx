"use client";

import { useRouter } from "next/navigation";
import { Badge, Button, Icon, Notice, Progress, useToast } from "@/components/ui";
import { PageHeading } from "@/components/layout/page-heading";
import { useForm } from "@/features/form/form-context";

export function StatesScreen() {
  const router = useRouter();
  const showToast = useToast();
  const { setUseOriginalLabels, switchToSample } = useForm();

  function handleUseOriginalLabels() {
    setUseOriginalLabels((prev) => !prev);
    showToast("Toggled original PDF field names.");
  }

  return (
    <section id="view-states" className="view" aria-labelledby="states-heading">
      <PageHeading
        titleId="states-heading"
        eyebrow="Considered at every step"
        title="When things need a little help."
        description="Clear feedback, useful next steps, and no dead ends."
        action={<Badge tone="neutral">Product states</Badge>}
      />

      <div className="state-grid">
        {/* State 1: No fillable fields */}
        <article className="card state-card">
          <div className="state-icon">
            <Icon name="file" />
          </div>
          <h2>This PDF doesn’t have fillable fields.</h2>
          <p>
            We couldn’t find interactive fields in{" "}
            <strong>admission_scan.pdf</strong>. It may be a scan or a flattened
            document. Ask the institution for a fillable version, or explore our
            sample.
          </p>
          <div className="demo-row">
            <Button variant="primary" onClick={() => router.push("/")}>
              Choose another PDF
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                switchToSample();
                router.push("/analysis");
              }}
            >
              Try the sample
            </Button>
          </div>
        </article>

        {/* State 2: Password protected */}
        <article className="card state-card">
          <div
            className="state-icon"
            style={{ background: "var(--error-bg)", color: "var(--error)" }}
          >
            <Icon name="lock" />
          </div>
          <h2>This document is password-protected.</h2>
          <p>
            FormFlow can’t read the fields in{" "}
            <strong>protected_registration.pdf</strong>. If you have permission,
            save an unlocked copy in your PDF editor and upload that version.
          </p>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Choose an unlocked PDF
          </Button>
        </article>

        {/* State 3: Too large */}
        <article className="card state-card">
          <div className="state-icon">
            <Icon name="info" />
          </div>
          <h2>A little too large for now.</h2>
          <p>
            <strong>application_pack.pdf</strong> is 14.2 MB. The current limit
            is 10 MB. Try a smaller fillable copy and keep its interactive fields
            intact.
          </p>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Choose a smaller file
          </Button>
        </article>

        {/* State 4: AI service offline */}
        <article className="card state-card">
          <div
            className="state-icon"
            style={{ background: "var(--info-bg)", color: "var(--info)" }}
          >
            <Icon name="spark" />
          </div>
          <h2>Friendly labels are taking a break.</h2>
          <p>
            The AI service couldn’t respond. Your document is still available.
            Retry the analysis, or continue with the original field labels.
          </p>
          <div className="demo-row">
            <Button
              variant="primary"
              onClick={() => router.push("/analysis")}
            >
              Retry analysis
            </Button>
            <Button variant="secondary" onClick={handleUseOriginalLabels}>
              Use original labels
            </Button>
          </div>
        </article>

        {/* State 5: Analyzing progress state */}
        <article className="card state-card">
          <Badge tone="neutral">ANALYZING · DISPLAY STATE</Badge>
          <h2>Finding a simpler way through.</h2>
          <p>Reading the original field names and organizing your questions.</p>
          <div style={{ margin: "23px 0 13px" }}>
            <Progress value={65} label="Illustrative analysis progress" />
          </div>
          <div
            className="small muted"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Step 2 of 3 · Organizing fields</span>
            <span>65%</span>
          </div>
          <Button variant="ghost" onClick={() => router.push("/")}>
            Cancel and go back
          </Button>
        </article>

        {/* State 6: Validation error state */}
        <article className="card state-card">
          <Badge tone="error">VALIDATION · DISPLAY STATE</Badge>
          <h2>Almost there. Check this detail.</h2>
          <div className="field" style={{ marginTop: 20 }}>
            <label htmlFor="state-email">Email address</label>
            <input
              id="state-email"
              type="email"
              defaultValue="ayesha.khan@"
              aria-invalid="true"
              aria-describedby="state-email-error"
            />
            <span id="state-email-error" className="field-error">
              Enter a complete email address, such as ayesha@example.com.
            </span>
          </div>
          <p style={{ fontSize: 11, marginTop: 15 }}>
            Keep the answer in place. Explain the issue next to the field. Let
            the person fix it without losing their work.
          </p>
        </article>

        {/* State 7: Export failure full card */}
        <article className="card state-card full">
          <Notice tone="error" title="We couldn’t prepare the PDF.">
            Your answers are still here. Try the export again. If the problem
            continues, review the original file in a PDF editor.
          </Notice>
          <Button
            variant="secondary"
            onClick={() => router.push("/review")}
            style={{ marginTop: 16 }}
          >
            Return to review
          </Button>
        </article>
      </div>
    </section>
  );
}
