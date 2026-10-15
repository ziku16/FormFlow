import assert from "node:assert/strict";
import test from "node:test";
import {
  displayValue,
  validateFieldValue,
  defaultSampleAnswers,
  sampleFieldLabels,
} from "../src/features/form/form-state.ts";
import {
  createDemoPdfBlob,
  parsePdfFile,
} from "../src/features/pdf/pdf-engine.ts";
import { PDFDocument } from "pdf-lib";

test("displayValue formats booleans and strings correctly", () => {
  assert.equal(displayValue(true), "Yes");
  assert.equal(displayValue(false), "Not selected");
  assert.equal(displayValue("Ayesha"), "Ayesha");
  assert.equal(displayValue(""), "Not provided");
  assert.equal(displayValue("   "), "Not provided");
  assert.equal(displayValue(undefined), "Not provided");
});

test("validateFieldValue enforces required text fields", () => {
  const empty = validateFieldValue("firstName", "", true, "First name");
  assert.equal(empty.valid, false);
  assert.equal(empty.message, "First name is required.");

  const valid = validateFieldValue("firstName", "Ayesha", true, "First name");
  assert.equal(valid.valid, true);

  const optionalEmpty = validateFieldValue("studentId", "", false, "Student ID");
  assert.equal(optionalEmpty.valid, true);
});

test("validateFieldValue enforces email format", () => {
  assert.equal(
    validateFieldValue("email", "not-an-email", true, "Email").valid,
    false,
  );
  assert.equal(
    validateFieldValue("email", "ayesha@", true, "Email").valid,
    false,
  );
  assert.equal(
    validateFieldValue("email", "ayesha@domain", true, "Email").valid,
    false,
  );
  assert.equal(
    validateFieldValue("email", "ayesha@example.com", true, "Email").valid,
    true,
  );
});

test("validateFieldValue enforces phone format with country code and min 7 digits", () => {
  assert.equal(
    validateFieldValue("phone", "123", true, "Phone").valid,
    false,
  );
  assert.equal(
    validateFieldValue("phone", "+92 300 555 0142", true, "Phone").valid,
    true,
  );
  assert.equal(
    validateFieldValue("phone", "+1 (555) 123-4567", true, "Phone").valid,
    true,
  );
});

test("validateFieldValue enforces birth date before 15 October 2026", () => {
  assert.equal(
    validateFieldValue("dob", "2005-04-18", true, "Date of birth").valid,
    true,
  );
  assert.equal(
    validateFieldValue("dob", "2026-10-15", true, "Date of birth").valid,
    false,
  );
  assert.equal(
    validateFieldValue("dob", "2027-01-01", true, "Date of birth").valid,
    false,
  );
});

test("validateFieldValue enforces required checkbox confirmation", () => {
  assert.equal(
    validateFieldValue("accurate", false, true, "Confirmation").valid,
    false,
  );
  assert.equal(
    validateFieldValue("accurate", true, true, "Confirmation").valid,
    true,
  );
  assert.equal(
    validateFieldValue("scholarship", false, false, "Scholarship").valid,
    true,
  );
});

test("createDemoPdfBlob produces a valid PDF stream matching design specification", async () => {
  const blob = createDemoPdfBlob(defaultSampleAnswers, sampleFieldLabels);
  assert.equal(blob.type, "application/pdf");
  assert.ok(blob.size > 500);

  const text = await blob.text();
  assert.ok(text.startsWith("%PDF-1.4"));
  assert.ok(text.includes("%%EOF"));
  assert.ok(text.includes("NORTHBRIDGE UNIVERSITY"));
  assert.ok(text.includes("First name: Ayesha"));
});

test("parsePdfFile rejects flat PDFs with no interactive fields", async () => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([600, 400]);
  const pdfBytes = await pdfDoc.save();

  const file = new File([pdfBytes], "flat.pdf", { type: "application/pdf" });
  const result = await parsePdfFile(file);
  assert.equal(result.ok, false);
  assert.equal(result.error, "no-fields");
});

test("parsePdfFile extracts interactive fields from fillable PDFs", async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const form = pdfDoc.getForm();

  const nameField = form.createTextField("applicant_name");
  nameField.setText("John Doe");
  nameField.addToPage(page, { x: 50, y: 300, width: 200, height: 25 });

  const agreeCheck = form.createCheckBox("agree_terms");
  agreeCheck.addToPage(page, { x: 50, y: 250, width: 20, height: 20 });

  const pdfBytes = await pdfDoc.save();
  const file = new File([pdfBytes], "fillable.pdf", { type: "application/pdf" });

  const result = await parsePdfFile(file);
  const totalFields = result.formSchema.sections.reduce(
    (acc, s) => acc + s.fields.length,
    0,
  );
  assert.equal(totalFields, 2);
});
