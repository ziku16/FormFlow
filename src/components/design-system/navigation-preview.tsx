import { Badge, Card, Progress } from "@/components/ui";
import { Stepper } from "@/components/layout/stepper";

export function NavigationPreview() {
  return (
    <section id="ds-navigation" className="ds-section">
      <div className="section-heading">
        <h2>05 / A path, not a puzzle</h2>
        <span>Navigation &amp; progress</span>
      </div>
      <Card className="panel-pad">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="logo" style={{ fontSize: 20 }}>
            formflow.
          </span>
          <Badge tone="neutral">Application workspace</Badge>
        </div>
        <Stepper current={2} />
        <Progress value={60} label="Example application completion" />
        <p className="hint" style={{ marginTop: 12 }}>
          Progress is determined by required fields. Optional answers never
          block completion.
        </p>
      </Card>
    </section>
  );
}
