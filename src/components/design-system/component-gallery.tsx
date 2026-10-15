"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Icon,
  IconButton,
  Input,
  Modal,
  Notice,
  Radio,
  Select,
  useToast,
} from "@/components/ui";

export function ComponentGallery() {
  const notify = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [documentName, setDocumentName] = useState("Northbridge application");
  const [draftName, setDraftName] = useState(documentName);
  const [nameError, setNameError] = useState("");
  function editDocument() {
    setDraftName(documentName);
    setNameError("");
    setEditOpen(true);
  }
  return (
    <section id="ds-components" className="ds-section">
      <div className="section-heading">
        <h2>04 / The everyday essentials</h2>
        <span>Reusable interface components</span>
      </div>
      <div className="component-grid">
        <Card className="component-box">
          <h3>Buttons / Emphasis &amp; states</h3>
          <div className="demo-row">
            <Button onClick={() => notify("Primary action selected")}>
              Primary
              <Icon name="arrow" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => notify("Secondary action selected")}
            >
              Secondary
            </Button>
            <Button
              variant="ghost"
              onClick={() => notify("Quiet action selected")}
            >
              Quiet action
            </Button>
            <Button disabled>Disabled</Button>
            <Button
              variant="danger"
              onClick={() =>
                notify("Destructive button preview; no data was deleted")
              }
            >
              Remove
            </Button>
            <IconButton label="Edit example" onClick={editDocument}>
              <Icon name="edit" />
            </IconButton>
          </div>
          <p className="hint" style={{ marginTop: 20 }}>
            Use one primary action per panel. Focus rings remain visible for
            keyboard navigation.
          </p>
        </Card>
        <Card className="component-box">
          <h3>Badges / Status with a label</h3>
          <div className="demo-row">
            <Badge>
              <Icon name="check" />
              Complete
            </Badge>
            <Badge tone="warning">Needs review</Badge>
            <Badge tone="error">Check this field</Badge>
            <Badge tone="neutral">Optional</Badge>
            <Badge tone="info">AI suggestion</Badge>
          </div>
          <p className="hint" style={{ marginTop: 20 }}>
            Always pair status color with meaningful text.
          </p>
        </Card>
        <Card className="component-box">
          <h3>Inputs / Default, help &amp; selection</h3>
          <Input
            id="ds-name"
            label="Full name"
            defaultValue="Ayesha Khan"
            hint="As shown on your official documents."
          />
          <Select
            id="ds-select"
            label="Program"
            wrapperClassName="mt-[17px]"
            defaultValue="computer-science"
            options={[
              { value: "computer-science", label: "Computer Science" },
              { value: "business", label: "Business Administration" },
            ]}
          />
          <Checkbox
            wrapperClassName="mt-[17px]"
            label="Consider me for a scholarship"
            defaultChecked
          />
        </Card>
        <Card className="component-box">
          <h3>Inputs / Error &amp; disabled</h3>
          <Input
            id="ds-error"
            label="Email address"
            defaultValue="ayesha@"
            error="Enter a complete email address."
          />
          <Input
            id="ds-disabled"
            label="Document reference"
            defaultValue="NU-UG-2027"
            disabled
            hint="Provided by the original document."
            wrapperClassName="mt-[17px]"
          />
          <fieldset className="form-section" style={{ marginTop: 17 }}>
            <legend className="sr-only">Study schedule</legend>
            <Radio
              name="ds-mode"
              value="full-time"
              label="Full-time study"
              defaultChecked
            />
            <Radio name="ds-mode" value="part-time" label="Part-time study" />
          </fieldset>
        </Card>
        <Card className="component-box">
          <h3>Document card</h3>
          <div className="sample" style={{ cursor: "default" }}>
            <span className="file-icon">
              <Icon name="file" />
            </span>
            <div>
              <strong className="small">{documentName}</strong>
              <p className="hint">PDF · 1 page · 12 fields</p>
            </div>
            <Badge style={{ marginLeft: "auto" }}>Ready</Badge>
          </div>
          <div className="helpbox">
            <strong>
              <Icon name="spark" />
              Helpful, never overconfident
            </strong>
            AI explanations are labeled as suggestions and can be checked
            against the original document.
          </div>
        </Card>
        <Card className="component-box">
          <h3>Feedback / Contextual messages</h3>
          <Notice tone="success">Your sample is ready to download.</Notice>
          <Notice tone="warning" style={{ marginTop: 10 }}>
            Check this interpretation before continuing.
          </Notice>
          <Notice tone="error" style={{ marginTop: 10 }}>
            We couldn’t read this file. Try another PDF.
          </Notice>
        </Card>
      </div>
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Name your document"
      >
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (!draftName.trim()) {
              setNameError("Enter a document name.");
              return;
            }
            setDocumentName(draftName.trim());
            setEditOpen(false);
            notify("Document name updated for this preview.");
          }}
        >
          <Input
            label="Document name"
            value={draftName}
            onChange={(event) => {
              setDraftName(event.target.value);
              setNameError("");
            }}
            error={nameError}
            required
            maxLength={60}
            hint="This changes only the component preview in this tab."
          />
          <div
            className="demo-row"
            style={{ justifyContent: "flex-end", marginTop: 24 }}
          >
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save name</Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
