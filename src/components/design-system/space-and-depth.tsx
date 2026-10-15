export function SpaceAndDepth() {
  return (
    <section id="ds-space" className="ds-section">
      <div className="section-heading">
        <h2>03 / Room to breathe</h2>
        <span>4 px base unit</span>
      </div>
      <div className="card panel-pad">
        <div className="space-demo">
          <div>
            <i style={{ height: "4px" }}></i>4
          </div>
          <div>
            <i style={{ height: "8px" }}></i>8
          </div>
          <div>
            <i style={{ height: "12px" }}></i>12
          </div>
          <div>
            <i style={{ height: "16px" }}></i>16
          </div>
          <div>
            <i style={{ height: "20px" }}></i>20
          </div>
          <div>
            <i style={{ height: "24px" }}></i>24
          </div>
          <div>
            <i style={{ height: "32px" }}></i>32
          </div>
          <div>
            <i style={{ height: "40px" }}></i>40
          </div>
          <div>
            <i style={{ height: "48px" }}></i>48
          </div>
          <div>
            <i style={{ height: "64px" }}></i>64
          </div>
          <div>
            <i style={{ height: "80px" }}></i>80
          </div>
        </div>
        <p className="small muted" style={{ marginTop: "20px" }}>
          8–12 px within components · 24 px within cards · 32–48 px between
          sections · 64–80 px for major breathing room.
        </p>
      </div>
      <div className="shadow-samples">
        <div
          style={{
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--neutral-200)",
          }}
        >
          <strong>Subtle</strong>
          <br />
          Shadow sm · 8 px radius
        </div>
        <div style={{ boxShadow: "var(--shadow-md)" }}>
          <strong>Raised</strong>
          <br />
          Shadow md · 14 px radius
        </div>
        <div style={{ boxShadow: "var(--shadow-lg)", borderRadius: "22px" }}>
          <strong>Floating</strong>
          <br />
          Shadow lg · 22 px radius
        </div>
      </div>
    </section>
  );
}
