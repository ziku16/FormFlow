"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, Icon, useToast } from "@/components/ui";
import { Stepper } from "@/components/layout/stepper";
import { useForm } from "@/features/form/form-context";

export function DownloadScreen() {
  const router = useRouter();
  const showToast = useToast();
  const {
    mode,
    activeForm,
    uploadedPdf,
    downloadStatus,
    generatePdfDownload,
    resetToDefaults,
  } = useForm();

  const [downloading, setDownloading] = useState(false);

  const filename =
    mode === "uploaded" && uploadedPdf
      ? uploadedPdf.filename.replace(/\.pdf$/i, "_completed.pdf")
      : "northbridge_application_demo.pdf";

  async function handleDownload() {
    setDownloading(true);
    try {
      const { blob, filename: outFilename } = await generatePdfDownload();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = outFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);

      showToast(
        mode === "uploaded"
          ? "Your completed PDF is downloading."
          : "Your labeled sample PDF is downloading.",
      );
    } catch {
      showToast("We couldn’t prepare the PDF. Try downloading again.");
    } finally {
      setDownloading(false);
    }
  }

  function handleTryAnother() {
    resetToDefaults();
    router.push("/");
  }

  return (
    <section
      id="view-download"
      className="view"
      aria-labelledby="download-heading"
    >
      <Stepper current={4} />

      <div className="success-layout">
        <div className="success-icon">
          <Icon name="check" />
        </div>

        <span className="eyebrow" style={{ display: "block", marginTop: 25 }}>
          One less thing on your list
        </span>

        <h1 id="download-heading">Paperwork, handled.</h1>

        <p className="muted">
          Your sample form is ready. Download it, give it a final look,
          <br />
          and take your next step.
        </p>

        <Card className="download-card">
          <div className="download-file">
            <span
              className="file-icon"
              style={{ width: 44, height: 52 }}
              aria-hidden="true"
            >
              <Icon name="file" />
            </span>
            <div>
              <strong style={{ fontSize: 13 }}>{filename}</strong>
              <p className="small muted">
                {activeForm.pageCount} page ·{" "}
                {mode === "uploaded"
                  ? "Completed original document"
                  : "Generated design sample"}
              </p>
            </div>
            <Badge tone="neutral">
              {mode === "uploaded" ? "Completed PDF" : "Demo export"}
            </Badge>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--neutral-200)",
              paddingTop: 17,
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              fontSize: 11,
              color: "var(--neutral-600)",
            }}
          >
            <span>✓ Includes current sample answers</span>
            <span>✓ Clearly labeled prototype</span>
          </div>

          <Button
            variant="primary"
            id="download-pdf"
            loading={downloading}
            onClick={handleDownload}
          >
            <Icon name="download" />
            {mode === "uploaded" ? "Download completed PDF" : "Download sample PDF"}
          </Button>

          <p className="prototype-note" id="download-status" role="status">
            {downloadStatus}
          </p>
        </Card>

        <div className="next-grid">
          <article className="card next-card">
            <Icon name="book" style={{ color: "var(--primary-500)" }} />
            <h3>Your next step</h3>
            <p>
              In the finished app, you’ll submit the completed original PDF
              through your institution’s preferred channel.
            </p>
          </article>

          <article className="card next-card">
            <Icon name="lock" style={{ color: "var(--primary-500)" }} />
            <h3>Your session, your control</h3>
            <p>
              Answers are saved in this browser’s local storage. You can review,
              update, or clear them anytime.
            </p>
          </article>
        </div>

        <div className="demo-row" style={{ justifyContent: "center" }}>
          <Button
            variant="secondary"
            onClick={() => router.push("/review")}
          >
            <Icon name="edit" />
            Review my answers
          </Button>
          <Button variant="ghost" onClick={handleTryAnother}>
            Try another form
            <Icon name="arrow" />
          </Button>
        </div>
      </div>
    </section>
  );
}
