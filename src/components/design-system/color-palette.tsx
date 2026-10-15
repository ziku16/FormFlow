export function ColorPalette() {
  return (
    <section id="ds-colors" className="ds-section">
      <div className="section-heading">
        <h2>01 / Color with purpose</h2>
        <span>Quiet surfaces. Clear actions.</span>
      </div>
      <div className="swatches">
        <div className="swatch">
          <div className="swatch-color" style={{ background: "#183c2b" }}></div>
          <div className="swatch-label">
            <strong>Forest / Primary 900</strong>#183C2B · Primary actions
          </div>
        </div>
        <div className="swatch">
          <div className="swatch-color" style={{ background: "#356f50" }}></div>
          <div className="swatch-label">
            <strong>Fern / Primary 500</strong>#356F50 · Accents & progress
          </div>
        </div>
        <div className="swatch">
          <div className="swatch-color" style={{ background: "#dbeadd" }}></div>
          <div className="swatch-label">
            <strong>Sage / Primary 100</strong>#DBEADD · Subtle emphasis
          </div>
        </div>
        <div className="swatch">
          <div className="swatch-color" style={{ background: "#e9b65f" }}></div>
          <div className="swatch-label">
            <strong>Honey / Secondary 500</strong>#E9B65F · Warm accents
          </div>
        </div>
        <div className="swatch">
          <div className="swatch-color" style={{ background: "#faf1df" }}></div>
          <div className="swatch-label">
            <strong>Oat / Secondary 50</strong>#FAF1DF · Supporting surfaces
          </div>
        </div>
      </div>
      <div className="swatches" style={{ marginTop: "12px" }}>
        <div className="swatch">
          <div className="swatch-color" style={{ background: "#26352b" }}></div>
          <div className="swatch-label">
            <strong>Ink / Neutral 900</strong>#26352B · Main text
          </div>
        </div>
        <div className="swatch">
          <div className="swatch-color" style={{ background: "#5e695f" }}></div>
          <div className="swatch-label">
            <strong>Stone / Neutral 600</strong>#5E695F · Secondary text
          </div>
        </div>
        <div className="swatch">
          <div className="swatch-color" style={{ background: "#e1e4db" }}></div>
          <div className="swatch-label">
            <strong>Mist / Neutral 200</strong>#E1E4DB · Dividers
          </div>
        </div>
        <div className="swatch">
          <div className="swatch-color" style={{ background: "#f8f8f3" }}></div>
          <div className="swatch-label">
            <strong>Canvas / Neutral 50</strong>#F8F8F3 · Page background
          </div>
        </div>
        <div className="swatch">
          <div className="swatch-color" style={{ background: "#fff" }}></div>
          <div className="swatch-label">
            <strong>Paper / Neutral 0</strong>#FFFFFF · Cards & fields
          </div>
        </div>
      </div>
      <div className="semantic-swatches">
        <div
          className="semantic-swatch"
          style={{ background: "var(--success-bg)", color: "var(--success)" }}
        >
          <strong>✓ Success</strong>
          <br />
          #2D6A45 / #EAF4ED
        </div>
        <div
          className="semantic-swatch"
          style={{ background: "var(--warning-bg)", color: "var(--warning)" }}
        >
          <strong>! Warning</strong>
          <br />
          #815A16 / #FFF4DC
        </div>
        <div
          className="semantic-swatch"
          style={{ background: "var(--error-bg)", color: "var(--error)" }}
        >
          <strong>× Error</strong>
          <br />
          #AE3F38 / #FFF0ED
        </div>
        <div
          className="semantic-swatch"
          style={{ background: "var(--info-bg)", color: "var(--info)" }}
        >
          <strong>i Information</strong>
          <br />
          #38637B / #EDF4F8
        </div>
      </div>
    </section>
  );
}
