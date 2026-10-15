import { Badge, Icon, Notice } from "@/components/ui";
import { UploadCard } from "./upload-card";

const features = [
  {
    number: "01",
    title: "Bring the form you already have",
    description:
      "Start with a PDF that has fillable fields. No rebuilding documents from scratch.",
  },
  {
    number: "02",
    title: "One clear question at a time",
    description:
      "Friendly labels, helpful explanations, and checks that catch the little things.",
  },
  {
    number: "03",
    title: "Same document. All filled in.",
    description:
      "Review your answers and export them into the original form’s existing fields.",
  },
] as const;

export function UploadScreen() {
  return (
    <section id="view-upload" className="view" aria-labelledby="upload-heading">
      <div className="hero">
        <div>
          <Badge>
            <Icon name="spark" />
            OLD FORMS. A NEW WAY FORWARD.
          </Badge>
          <h1 id="upload-heading">
            Less paperwork.
            <br />
            More <em>possibility.</em>
          </h1>
          <p className="hero-copy">
            Turn a complicated PDF into a simple conversation. Upload your form,
            fill it with confidence, and get your original PDF back—completed.
          </p>
          <div className="hero-checks">
            {[
              "No account needed",
              "Your original layout",
              "One easy download",
            ].map((text) => (
              <span key={text}>
                <Icon name="check" />
                {text}
              </span>
            ))}
          </div>
          <div
            style={{
              marginTop: 34,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                height: 34,
                width: 3,
                background: "var(--secondary-500)",
              }}
            />
            <p className="small muted">
              Made for applications, registrations,
              <br />
              and the forms standing between you and what’s next.
            </p>
          </div>
        </div>
        <UploadCard />
      </div>
      <div className="features">
        {features.map((feature) => (
          <article className="feature" key={feature.number}>
            <span className="feature-number">{feature.number}</span>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </article>
        ))}
      </div>
      <Notice
        title="Built for fillable PDFs, first."
        style={{ marginBottom: 12 }}
      >
        Scans and flat PDFs aren’t supported in the MVP. Try the sample to
        explore the onboarding experience.
      </Notice>
    </section>
  );
}
