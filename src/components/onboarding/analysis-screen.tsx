import Link from "next/link";
import {
  Badge,
  Button,
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
import { sampleForm } from "@/data/sample-form";

const fieldCount = sampleForm.sections.reduce(
  (count, section) => count + section.fields.length,
  0,
);
const analysisItems = [
  {
    title: "Original form fields detected",
    description: `${fieldCount} editable fields, mapped to their original identifiers.`,
  },
  {
    title: `Questions organized into ${sampleForm.sections.length} sections`,
    description: "Personal details, study plans, and final declarations.",
  },
  {
    title: "Clearer labels and helpful guidance",
    description: "Plain-language explanations alongside the original PDF.",
  },
];

export function AnalysisScreen() {
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
            Sample analysis complete
          </Badge>
        }
      />
      <div className="workspace">
        <SampleDocumentPreview form={sampleForm} />
        <Card>
          <CardHeader>
            <span className="eyebrow">Form intelligence</span>
            <h2>A little structure goes a long way.</h2>
            <p>Undergraduate application · Autumn 2027 entry</p>
          </CardHeader>
          <CardBody>
            <Progress value={100} label="Prepared sample analysis complete" />
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
                <strong>{sampleForm.sections.length}</strong>
                <span>simple sections</span>
              </div>
              <div className="stat">
                <strong>~{sampleForm.estimatedMinutes} min</strong>
                <span>to complete</span>
              </div>
            </div>
            <Notice tone="warning" title="A suggestion, not a new requirement">
              “Student ID” is interpreted as optional for new applicants.
              Confirm the institution’s instructions before submitting.
            </Notice>
            <p className="small muted" style={{ marginTop: 16 }}>
              AI improves the wording; the PDF’s field names and options stay
              intact. This preview uses a prepared sample analysis.
            </p>
          </CardBody>
          <CardFooter>
            <Link className="btn btn-ghost btn-sm" href="/">
              Change document
            </Link>
            <Button disabled aria-describedby="phase-boundary">
              Let’s fill it in
              <Icon name="arrow" />
            </Button>
          </CardFooter>
          <p
            id="phase-boundary"
            className="prototype-note"
            style={{ padding: "0 24px" }}
          >
            The guided form begins in Phase 3. This sample completes the
            onboarding preview.
          </p>
        </Card>
      </div>
    </section>
  );
}
