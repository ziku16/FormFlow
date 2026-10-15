import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_PDF_BYTES,
  formatFileSize,
  validatePdfSelection,
} from "../src/features/intake/validate-file.ts";

function pdf(name = "application.pdf", size = 32, type = "application/pdf") {
  return new File(["%PDF-1.7\n", new Uint8Array(Math.max(0, size - 9))], name, {
    type,
  });
}

async function expectError(files, code) {
  const result = await validatePdfSelection(files);
  assert.equal(result.ok, false);
  assert.equal(result.error.code, code);
  assert.ok(result.error.title);
  assert.ok(result.error.message);
}

test("requires exactly one selected file", async () => {
  await expectError([], "file-count");
  await expectError([pdf(), pdf("second.pdf")], "file-count");
});

test("rejects empty files without attempting to read a signature", async () => {
  await expectError([new File([], "empty.pdf")], "empty");
});

test("rejects a file one byte over the limit", async () => {
  const files = [pdf("large.pdf", MAX_PDF_BYTES + 1)];
  await expectError(files, "too-large");
  const result = await validatePdfSelection(files);
  assert.match(result.error.message, /just over 10 MB/);
});

test("accepts exactly 10 MiB when the extension and signature match", async () => {
  const file = pdf("boundary.pdf", MAX_PDF_BYTES);
  const result = await validatePdfSelection([file]);
  assert.equal(result.ok, true);
  assert.equal(result.file, file);
});

test("rejects a renamed non-PDF even if its browser MIME type claims PDF", async () => {
  await expectError(
    [
      new File(["This is plain text."], "renamed.pdf", {
        type: "application/pdf",
      }),
    ],
    "invalid-signature",
  );
});

test("requires a PDF extension even if the file starts with the PDF header", async () => {
  await expectError([pdf("application.txt")], "wrong-type");
});

test("accepts uppercase PDF extensions and missing MIME metadata", async () => {
  const file = pdf("APPLICATION.PDF", 32, "");
  const result = await validatePdfSelection([file]);
  assert.equal(result.ok, true);
  assert.equal(result.file, file);
});

test("rejects a truncated signature", async () => {
  await expectError([new File(["%PDF"], "truncated.pdf")], "invalid-signature");
});

test("reports a read failure rather than rejecting the validation promise", async () => {
  class UnreadableFile extends File {
    slice() {
      return {
        text: async () => {
          throw new Error("File is no longer available");
        },
      };
    }
  }
  await expectError(
    [new UnreadableFile(["%PDF-1.7"], "unavailable.pdf")],
    "unreadable",
  );
});

test("displays useful sizes at byte, kilobyte, and megabyte boundaries", () => {
  assert.equal(formatFileSize(0), "0 bytes");
  assert.equal(formatFileSize(1023), "1023 bytes");
  assert.equal(formatFileSize(1024), "1.0 KB");
  assert.equal(formatFileSize(1024 * 1024), "1.00 MB");
  assert.equal(formatFileSize(MAX_PDF_BYTES), "10.00 MB");
});

test("a subsequent valid selection succeeds after a failed selection", async () => {
  await expectError([new File(["text"], "invalid.pdf")], "invalid-signature");
  assert.equal((await validatePdfSelection([pdf()])).ok, true);
});
