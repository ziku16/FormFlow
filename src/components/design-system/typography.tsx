export function Typography() {
  return (
    <section id="ds-type" className="ds-section">
      <div className="section-heading">
        <h2>02 / A clear hierarchy</h2>
        <span>Manrope + DM Sans</span>
      </div>
      <div className="card panel-pad" style={{ marginBottom: "8px" }}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <span className="eyebrow">Headings · Manrope</span>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "32px",
                fontWeight: "700",
                margin: "9px 0",
              }}
            >
              Aa Bb Cc 0123
            </p>
            <p className="small muted">
              Distinctive, friendly, and confident. Weight 700; tight tracking.
            </p>
          </div>
          <div>
            <span className="eyebrow">Body & interface · DM Sans</span>
            <p style={{ fontSize: "32px", margin: "9px 0" }}>Aa Bb Cc 0123</p>
            <p className="small muted">
              Designed for readable questions and comfortable long-form input.
            </p>
          </div>
        </div>
      </div>
      <div className="type-row">
        <span>Display</span>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "48px",
            fontWeight: "700",
            lineHeight: "1.1",
            letterSpacing: "-2px",
          }}
        >
          Less paperwork.
        </p>
        <span>48 / 53 · 700</span>
      </div>
      <div className="type-row">
        <span>Heading 1</span>
        <h1>Make it yours.</h1>
        <span>44 / 53 · 700</span>
      </div>
      <div className="type-row">
        <span>Heading 2</span>
        <h2>A clearer next step.</h2>
        <span>30 / 36 · 700</span>
      </div>
      <div className="type-row">
        <span>Heading 3</span>
        <h3>Personal details</h3>
        <span>22 / 26.4 · 700</span>
      </div>
      <div className="type-row">
        <span>Heading 4</span>
        <h4>Start with your PDF</h4>
        <span>18 / 21.6 · 700</span>
      </div>
      <div className="type-row">
        <span>Heading 5</span>
        <h5>Your original document</h5>
        <span>16 / 19.2 · 700</span>
      </div>
      <div className="type-row">
        <span>Heading 6</span>
        <h6>A little clarity</h6>
        <span>14 / 16.8 · 700</span>
      </div>
      <div className="type-row">
        <span>Body large</span>
        <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
          Every form is the start of something.
        </p>
        <span>16 / 28.8 · 400</span>
      </div>
      <div className="type-row">
        <span>Body</span>
        <p>Your answers belong in the original form.</p>
        <span>14 / 22.4 · 400</span>
      </div>
      <div className="type-row">
        <span>Caption</span>
        <p className="small muted">Fillable PDF · 1 page · 12 fields</p>
        <span>12 / 19.2 · 400</span>
      </div>
      <div className="type-row">
        <span>Button</span>
        <span
          style={{ fontSize: "13px", fontWeight: "600", lineHeight: "1.4" }}
        >
          Continue to review →
        </span>
        <span>13 / 18.2 · 600</span>
      </div>
      <div className="type-row">
        <span>Eyebrow</span>
        <p className="eyebrow">A little less paperwork</p>
        <span>11 / 17.6 · 700</span>
      </div>
    </section>
  );
}
