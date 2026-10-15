import { Badge } from "@/components/ui";
import { foundationSections } from "@/lib/navigation";
import { ColorPalette } from "./color-palette";
import { Typography } from "./typography";
import { SpaceAndDepth } from "./space-and-depth";
import { ComponentGallery } from "./component-gallery";
import { NavigationPreview } from "./navigation-preview";
import { VoiceAndBehavior } from "./voice-and-behavior";

export function DesignSystem() {
  return (
    <section id="view-system" className="view" aria-labelledby="system-heading">
      <div className="ds-hero">
        <span className="eyebrow">FormFlow / Design foundations / 1.0</span>
        <h1 id="system-heading">Clarity is a kindness.</h1>
        <p>
          A calm, human interface for the paperwork that matters. Built on
          generous space, purposeful color, and words that make the next step
          obvious.
        </p>
        <div className="demo-row" style={{ marginTop: 22 }}>
          <Badge>Warm &amp; reassuring</Badge>
          <Badge tone="neutral">Accessible by design</Badge>
          <Badge tone="warning">A little editorial</Badge>
        </div>
      </div>
      <div className="ds-layout">
        <aside className="ds-aside" aria-label="Design system sections">
          <span className="eyebrow">Foundations</span>
          {foundationSections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </aside>
        <div>
          <ColorPalette />
          <Typography />
          <SpaceAndDepth />
          <ComponentGallery />
          <NavigationPreview />
          <VoiceAndBehavior />
        </div>
      </div>
    </section>
  );
}
