import { Card, CardBody, Icon } from "@/components/ui";
import { PageHeading } from "@/components/layout/page-heading";
import { Stepper } from "@/components/layout/stepper";

export default function AnalysisLoading() {
  return (
    <section aria-busy="true" aria-labelledby="analysis-loading-heading">
      <Stepper current={1} />
      <PageHeading
        titleId="analysis-loading-heading"
        eyebrow="From document to direction"
        title="Opening your sample form."
        description="Loading the prepared university application and its field descriptions."
      />
      <Card>
        <CardBody>
          <div role="status" className="analysis-item">
            <span className="check-circle">
              <Icon name="spark" className="rotate" />
            </span>
            <div>
              <strong>Loading the sample</strong>
              <p className="small muted">
                Your selected file remains in this tab.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
