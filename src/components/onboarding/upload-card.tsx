"use client";

import { useRef, useState, type DragEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, Icon, Notice } from "@/components/ui";
import { useIntake } from "@/features/intake/intake-provider";
import { formatFileSize } from "@/features/intake/validate-file";
import { useForm } from "@/features/form/form-context";
import { parsePdfFile } from "@/features/pdf/pdf-engine";
import { cn } from "@/lib/cn";

export function UploadCard() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<{
    title: string;
    message: string;
    isNoFields?: boolean;
  } | null>(null);

  const { state, selectFiles, clearSelection } = useIntake();
  const { setUploadedPdf, switchToSample } = useForm();

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
    setParseError(null);
    void selectFiles(Array.from(event.dataTransfer.files));
  }

  async function handleAnalyzeSelected() {
    if (state.status !== "selected") return;
    setParsing(true);
    setParseError(null);
    try {
      const result = await parsePdfFile(state.file);
      if (result.ok) {
        setUploadedPdf(result);
        router.push("/analysis");
      } else if (result.error === "no-fields") {
        setParseError({
          title: "This PDF doesn’t have fillable fields.",
          message: result.message,
          isNoFields: true,
        });
      } else if (result.error === "password-protected") {
        setParseError({
          title: "This document is password-protected.",
          message: result.message,
        });
      } else {
        setParseError({
          title: "We couldn’t read this file.",
          message: result.message,
        });
      }
    } catch (err) {
      setParseError({
        title: "Analysis could not complete.",
        message:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while analyzing the PDF. Please try again or use the prepared sample.",
        isNoFields: true,
      });
    } finally {
      setParsing(false);
    }
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
        aria-busy={state.status === "validating" || parsing}
      >
        <div className="icon-tile">
          <Icon name="upload" />
        </div>
        <h3>
          {dragging ? "Drop your PDF to select it" : "Drop your form here"}
        </h3>
        <p className="small muted">A small upload. A much simpler process.</p>
        <Button
          onClick={() => {
            setParseError(null);
            inputRef.current?.click();
          }}
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
            setParseError(null);
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

      {parseError && (
        <Notice
          tone="error"
          role="alert"
          title={parseError.title}
          style={{ marginTop: 12 }}
        >
          <p className="file-name">{parseError.message}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setParseError(null);
                inputRef.current?.click();
              }}
            >
              Choose another PDF
            </Button>
            {parseError.isNoFields && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  switchToSample();
                  router.push("/analysis");
                }}
              >
                Try the sample
              </Button>
            )}
          </div>
        </Notice>
      )}

      {state.status === "selected" && !parseError && (
        <Notice
          role="status"
          title="Your PDF is selected."
          style={{ marginTop: 12 }}
        >
          <p className="file-name">
            <strong>{state.file.name}</strong>{" "}
            ({formatFileSize(state.file.size)}) · Kept in this tab
          </p>
          <p style={{ marginTop: 8 }}>
            The file type, size, and PDF signature passed our checks. Ready to
            read interactive fields and begin the guided form.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="primary"
              size="sm"
              loading={parsing}
              onClick={handleAnalyzeSelected}
            >
              <Icon name="spark" />
              {parsing ? "Structuring form with Gemini…" : "Analyze this PDF"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={parsing}
              onClick={() => {
                clearSelection();
                setParseError(null);
              }}
            >
              Remove file
            </Button>
          </div>
          {parsing && (
            <p className="small muted" style={{ marginTop: 8 }}>
              Scanning fillable fields and structuring questions with Gemini 3.6 Flash…
            </p>
          )}
        </Notice>
      )}

      <div className="divider">JUST EXPLORING?</div>
      <Link
        className="sample"
        href="/analysis"
        onClick={() => switchToSample()}
      >
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
        Design demo · sample answers stay in this browser tab
      </div>
    </Card>
  );
}
