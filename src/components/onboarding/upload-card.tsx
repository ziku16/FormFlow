"use client";

import { useRef, useState, type DragEvent } from "react";
import Link from "next/link";
import { Badge, Button, Card, Icon, Notice } from "@/components/ui";
import { useIntake } from "@/features/intake/intake-provider";
import { formatFileSize } from "@/features/intake/validate-file";
import { cn } from "@/lib/cn";

export function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const { state, selectFiles, clearSelection } = useIntake();

  function enterDropzone(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!event.dataTransfer.types.includes("Files")) return;
    dragDepth.current += 1;
    setDragging(true);
  }

  function leaveDropzone(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  }

  function dropFiles(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    void selectFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <Card className="upload-card">
      <div className="upload-title">
        <h2 style={{ fontSize: 17 }}>Start with your PDF</h2>
        <Badge tone="neutral">Step 1 of 4</Badge>
      </div>
      <div
        className={cn("dropzone", dragging && "drag")}
        onDragEnter={enterDropzone}
        onDragLeave={leaveDropzone}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }}
        onDrop={dropFiles}
        aria-busy={state.status === "validating"}
      >
        <div className="icon-tile">
          <Icon name="upload" />
        </div>
        <h3>
          {dragging ? "Drop your PDF to select it" : "Drop your form here"}
        </h3>
        <p className="small muted">A small upload. A much simpler process.</p>
        <Button
          onClick={() => inputRef.current?.click()}
          aria-describedby="upload-requirements"
        >
          <Icon name="upload" />
          Choose a PDF
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          aria-label="Choose a PDF"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (files.length) void selectFiles(files);
          }}
        />
        <p id="upload-requirements" style={{ fontSize: 10 }} className="muted">
          Fillable PDF only · Up to 10 MB
        </p>
      </div>
      {state.status === "validating" && (
        <Notice role="status" style={{ marginTop: 12 }}>
          <span className="file-name">Checking {state.name}…</span>
          <Button variant="ghost" size="sm" onClick={clearSelection}>
            Cancel
          </Button>
        </Notice>
      )}
      {state.status === "error" && (
        <Notice
          tone="error"
          role="alert"
          title={state.error.title}
          style={{ marginTop: 12 }}
        >
          <p className="file-name">{state.error.message}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => inputRef.current?.click()}
            style={{ marginTop: 8 }}
          >
            Choose another PDF
          </Button>
        </Notice>
      )}
      {state.status === "selected" && (
        <Notice
          role="status"
          title="Your PDF is selected."
          style={{ marginTop: 12 }}
        >
          <p className="file-name">
            <strong>{state.file.name}</strong>
            {formatFileSize(state.file.size)} · Kept in this tab
          </p>
          <p style={{ marginTop: 8 }}>
            The file type, size, and PDF signature passed our checks. Reading
            its fields is not enabled yet. Try the sample below to explore the
            onboarding experience.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            style={{ marginTop: 8 }}
          >
            Remove selected file
          </Button>
        </Notice>
      )}
      <div className="divider">JUST EXPLORING?</div>
      <Link className="sample" href="/analysis">
        <span className="file-icon">
          <Icon name="file" />
        </span>
        <span>
          <strong style={{ fontSize: 12 }}>Try a university application</strong>
          <span
            style={{
              display: "block",
              fontSize: 10,
              color: "var(--neutral-600)",
            }}
          >
            Sample form · 1 page · 12 fields
          </span>
        </span>
        <Icon className="arrow" name="arrow" />
      </Link>
      <div className="trustline">
        <Icon name="lock" />
        Your file stays in this browser tab · no account needed
      </div>
    </Card>
  );
}
