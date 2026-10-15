"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  Notice,
} from "@/components/ui";
import { PageHeading } from "@/components/layout/page-heading";
import { Stepper } from "@/components/layout/stepper";
import { SampleDocumentPreview } from "@/components/pdf/sample-document-preview";
import { useForm, originalSampleNames } from "@/features/form/form-context";
import { cn } from "@/lib/cn";
import { useIsMounted } from "@/lib/use-mounted";

const sectionTitles = [
  "First, a little about you.",
  "What’s your next chapter?",
  "A couple of final confirmations.",
];

const sectionDescriptions = [
  "Use your details as they appear on official documents.",
  "Choose from the options in the original application.",
  "Read each declaration carefully before confirming.",
];

export function GuidedFormScreen() {
  const router = useRouter();
  const {
    mode,
    activeForm,
    answers,
    activeSection,
    highlightedField,
    useOriginalLabels,
    validationErrors,
    setAnswer,
    setActiveSection,
    setHighlightedField,
    validateSection,
    validateAll,
    clearFieldError,
  } = useForm();

  const [summaryError, setSummaryError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Dynamic calculation of required fields and completion
  const { completedCount, requiredCount } = useMemo(() => {
    const requiredFields = activeForm.sections
      .flatMap((s) => s.fields)
      .filter((f) => f.required);

    let completed = 0;
    for (const f of requiredFields) {
      const val = answers[f.id];
      if (typeof val === "boolean") {
        if (val) completed += 1;
      } else if (val && String(val).trim().length > 0) {
        // Also ensure it meets specific validation rules
        if (f.id === "email") {
          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim())) {
            completed += 1;
          }
        } else if (f.id === "phone") {
          if (
            /^\+?[\d\s().-]+$/.test(String(val).trim()) &&
            String(val).replace(/\D/g, "").length >= 7
          ) {
            completed += 1;
          }
        } else if (f.id === "dob") {
          if (String(val) < "2026-10-15") {
            completed += 1;
          }
        } else {
          completed += 1;
        }
      }
    }
    return { completedCount: completed, requiredCount: requiredFields.length };
  }, [activeForm, answers]);

  const completionPercent = useMemo(() => {
    if (requiredCount === 0) return 100;
    return Math.round((completedCount / requiredCount) * 100);
  }, [completedCount, requiredCount]);

  function handleFieldFocus(fieldId: string) {
    setHighlightedField(fieldId);
  }

  function handleFieldBlur() {
    setHighlightedField(null);
  }

  function handleInputChange(fieldId: string, value: string | boolean) {
    setAnswer(fieldId, value);
    clearFieldError(fieldId);
    if (summaryError) setSummaryError(null);
  }

  function handleTabClick(index: number) {
    setSummaryError(null);
    setActiveSection(index);
  }

  function handleBack() {
    setSummaryError(null);
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    } else {
      router.push("/analysis");
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = validateSection(activeSection);
    if (!result.valid) {
      const errCount = Object.keys(result.errors).length;
      setSummaryError(
        `Check ${errCount === 1 ? "this answer" : `these ${errCount} answers`} before continuing.`,
      );
      if (result.firstErrorFieldId) {
        const el = document.getElementById(result.firstErrorFieldId);
        el?.focus();
      }
      return;
    }

    setSummaryError(null);

    if (activeSection < activeForm.sections.length - 1) {
      setActiveSection(activeSection + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Final section completed -> validate all
      const allResult = validateAll();
      if (!allResult.valid) {
        if (allResult.firstErrorSection !== undefined) {
          setActiveSection(allResult.firstErrorSection);
          const errCount = Object.keys(allResult.errors).length;
          setSummaryError(
            `Check ${errCount === 1 ? "this answer" : `these ${errCount} answers`} before continuing.`,
          );
          if (allResult.firstErrorFieldId) {
            setTimeout(() => {
              document.getElementById(allResult.firstErrorFieldId!)?.focus();
            }, 50);
          }
        }
        return;
      }
      router.push("/review");
    }
  }

  const isMounted = useIsMounted();
  if (!isMounted) {
    return (
      <section id="view-fill" className="view" aria-labelledby="fill-heading">
        <Stepper current={2} />
        <div className="workspace" style={{ minHeight: 600 }} />
      </section>
    );
  }

  return (
    <section id="view-fill" className="view" aria-labelledby="fill-heading">
      <Stepper current={2} />
      <PageHeading
        titleId="fill-heading"
        eyebrow="A little progress, one answer at a time"
        title="Make it yours."
        description="Your answers belong right here, in the original form."
        action={
          <Badge tone="neutral">
            <Icon name="lock" />
            Kept in this tab only
          </Badge>
        }
      />

      <div className="workspace">
        <SampleDocumentPreview
          form={activeForm}
          filled
          answers={answers}
          highlightedFieldId={highlightedField}
        />

        <Card>
          <CardHeader>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="eyebrow" id="section-counter">
                Section {activeSection + 1} of {activeForm.sections.length}
              </span>
              <span className="small muted" id="completion-label">
                {completedCount} of {requiredCount} required fields complete
              </span>
            </div>
            <h2 id="section-heading">
              {mode === "uploaded"
                ? (activeForm.sections[activeSection]?.title ?? "Form Section")
                : (sectionTitles[activeSection] ?? activeForm.sections[activeSection]?.title)}
            </h2>
            <p id="section-description">
              {mode === "uploaded"
                ? `Section ${activeSection + 1} of ${activeForm.sections.length} · Fill in each field to populate your original PDF.`
                : (sectionDescriptions[activeSection] ?? "Please fill in each field as requested.")}
            </p>
            <div className="progress" style={{ marginTop: 17 }}>
              <span
                id="completion-bar"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </CardHeader>

          <nav className="section-tabs" aria-label="Form sections">
            {activeForm.sections.map((tab, idx) => (
              <button
                key={tab.id}
                type="button"
                className={cn(activeSection === idx && "active")}
                aria-current={activeSection === idx ? "step" : undefined}
                onClick={() => handleTabClick(idx)}
              >
                <b>{idx + 1}</b>
                {tab.title}
              </button>
            ))}
          </nav>

          <form
            id="application-form"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
          >
            <CardBody>
              {summaryError && (
                <Notice
                  tone="error"
                  role="alert"
                  id="validation-summary"
                  style={{ marginBottom: 20 }}
                >
                  {summaryError}
                </Notice>
              )}

              {mode === "uploaded" ? (
                activeForm.sections.map((section, sIdx) => (
                  <fieldset
                    key={section.id}
                    className="form-section"
                    data-section={sIdx}
                    hidden={activeSection !== sIdx}
                  >
                    <legend className="sr-only">{section.title}</legend>
                    <div className="form-grid">
                      {section.fields.map((field) => {
                        const val = answers[field.id];
                        const isError = Boolean(validationErrors[field.id]);
                        const errorMsg = validationErrors[field.id];
                        const isFull =
                          field.type === "checkbox" ||
                          field.label.length > 25 ||
                          field.id.toLowerCase().includes("address");

                        if (field.type === "checkbox") {
                          return (
                            <div key={field.id} className="field full">
                              <label className="choice" htmlFor={field.id}>
                                <input
                                  id={field.id}
                                  name={field.id}
                                  type="checkbox"
                                  checked={Boolean(val)}
                                  onFocus={() => handleFieldFocus(field.id)}
                                  onBlur={handleFieldBlur}
                                  onChange={(e) =>
                                    handleInputChange(field.id, e.target.checked)
                                  }
                                />
                                <span>
                                  <strong style={{ fontSize: 12 }}>
                                    {useOriginalLabels ? field.pdfName : field.label}
                                    {field.required && (
                                      <span className="required">*</span>
                                    )}
                                  </strong>
                                  {field.hint && (
                                    <span className="hint">{field.hint}</span>
                                  )}
                                </span>
                              </label>
                              {isError && (
                                <p id={`${field.id}-error`} className="field-error">
                                  {errorMsg}
                                </p>
                              )}
                            </div>
                          );
                        }

                        if (
                          field.type === "dropdown" &&
                          field.options &&
                          field.options.length > 0
                        ) {
                          return (
                            <div
                              key={field.id}
                              className={cn("field", isFull && "full")}
                            >
                              <label htmlFor={field.id}>
                                {useOriginalLabels ? field.pdfName : field.label}
                                {field.required && (
                                  <span className="required">*</span>
                                )}
                              </label>
                              <select
                                id={field.id}
                                name={field.id}
                                value={String(val ?? "")}
                                required={field.required}
                                aria-invalid={isError}
                                aria-describedby={
                                  field.hint ? `${field.id}-hint` : undefined
                                }
                                onFocus={() => handleFieldFocus(field.id)}
                                onBlur={handleFieldBlur}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                              >
                                <option value="">Select an option…</option>
                                {field.options.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                              {field.hint && (
                                <span id={`${field.id}-hint`} className="hint">
                                  {field.hint}
                                </span>
                              )}
                              {isError && (
                                <p
                                  id={`${field.id}-error`}
                                  className="field-error"
                                >
                                  {errorMsg}
                                </p>
                              )}
                            </div>
                          );
                        }

                        const inputType =
                          field.id.toLowerCase().includes("date") ||
                          field.id.toLowerCase().includes("dob")
                            ? "date"
                            : field.id.toLowerCase().includes("email")
                              ? "email"
                              : field.id.toLowerCase().includes("phone") ||
                                  field.id.toLowerCase().includes("tel")
                                ? "tel"
                                : "text";

                        return (
                          <div
                            key={field.id}
                            className={cn("field", isFull && "full")}
                          >
                            <label htmlFor={field.id}>
                              {useOriginalLabels ? field.pdfName : field.label}
                              {field.required && (
                                <span className="required">*</span>
                              )}
                            </label>
                            <input
                              id={field.id}
                              name={field.id}
                              type={inputType}
                              value={String(val ?? "")}
                              required={field.required}
                              aria-invalid={isError}
                              aria-describedby={
                                field.hint ? `${field.id}-hint` : undefined
                              }
                              onFocus={() => handleFieldFocus(field.id)}
                              onBlur={handleFieldBlur}
                              onChange={(e) =>
                                handleInputChange(field.id, e.target.value)
                              }
                            />
                            {field.hint && (
                              <span id={`${field.id}-hint`} className="hint">
                                {field.hint}
                              </span>
                            )}
                            {isError && (
                              <p
                                id={`${field.id}-error`}
                                className="field-error"
                              >
                                {errorMsg}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                ))
              ) : (
                <>
                  {/* Section 0: Personal details */}
                  <fieldset
                    className="form-section"
                    data-section="0"
                    hidden={activeSection !== 0}
                  >
                <legend className="sr-only">Personal details</legend>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="firstName">
                      {useOriginalLabels
                        ? originalSampleNames.firstName
                        : "First name"}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={String(answers.firstName ?? "")}
                      autoComplete="given-name"
                      required
                      maxLength={40}
                      aria-invalid={Boolean(validationErrors.firstName)}
                      aria-describedby="firstName-error"
                      onFocus={() => handleFieldFocus("firstName")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                    {validationErrors.firstName && (
                      <p id="firstName-error" className="field-error">
                        {validationErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="lastName">
                      {useOriginalLabels
                        ? originalSampleNames.lastName
                        : "Last name"}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={String(answers.lastName ?? "")}
                      autoComplete="family-name"
                      required
                      maxLength={40}
                      aria-invalid={Boolean(validationErrors.lastName)}
                      aria-describedby="lastName-error"
                      onFocus={() => handleFieldFocus("lastName")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                    {validationErrors.lastName && (
                      <p id="lastName-error" className="field-error">
                        {validationErrors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="field full">
                    <label htmlFor="email">
                      {useOriginalLabels
                        ? originalSampleNames.email
                        : "Email address"}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={String(answers.email ?? "")}
                      autoComplete="email"
                      required
                      maxLength={80}
                      aria-invalid={Boolean(validationErrors.email)}
                      aria-describedby="email-hint email-error"
                      onFocus={() => handleFieldFocus("email")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                    <span id="email-hint" className="hint">
                      The university will use this for application updates.
                    </span>
                    {validationErrors.email && (
                      <p id="email-error" className="field-error">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="dob">
                      {useOriginalLabels
                        ? originalSampleNames.dob
                        : "Date of birth"}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      value={String(answers.dob ?? "")}
                      required
                      aria-invalid={Boolean(validationErrors.dob)}
                      aria-describedby="dob-error"
                      onFocus={() => handleFieldFocus("dob")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("dob", e.target.value)
                      }
                    />
                    {validationErrors.dob && (
                      <p id="dob-error" className="field-error">
                        {validationErrors.dob}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="phone">
                      {useOriginalLabels
                        ? originalSampleNames.phone
                        : "Phone number"}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={String(answers.phone ?? "")}
                      autoComplete="tel"
                      required
                      maxLength={25}
                      aria-invalid={Boolean(validationErrors.phone)}
                      aria-describedby="phone-hint phone-error"
                      onFocus={() => handleFieldFocus("phone")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                    <span id="phone-hint" className="hint">
                      Include your country code.
                    </span>
                    {validationErrors.phone && (
                      <p id="phone-error" className="field-error">
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="field full">
                    <label htmlFor="address">
                      {useOriginalLabels
                        ? originalSampleNames.address
                        : "Postal address"}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="address"
                      name="address"
                      value={String(answers.address ?? "")}
                      autoComplete="street-address"
                      required
                      maxLength={100}
                      aria-invalid={Boolean(validationErrors.address)}
                      aria-describedby="address-error"
                      onFocus={() => handleFieldFocus("address")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                    />
                    {validationErrors.address && (
                      <p id="address-error" className="field-error">
                        {validationErrors.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="helpbox">
                  <strong>
                    <Icon name="spark" />
                    A little clarity
                  </strong>
                  “Postal address” means where you can receive letters. Use your
                  current address, even if it differs from your permanent one.
                  <span
                    style={{
                      display: "block",
                      marginTop: 5,
                      fontSize: 10,
                    }}
                  >
                    Sample AI explanation · always check the original
                    instructions.
                  </span>
                </div>
              </fieldset>

              {/* Section 1: Study plans */}
              <fieldset
                className="form-section"
                data-section="1"
                hidden={activeSection !== 1}
              >
                <legend className="sr-only">Study plans</legend>
                <div className="form-grid">
                  <div className="field full">
                    <label htmlFor="program">
                      {useOriginalLabels
                        ? originalSampleNames.program
                        : "Preferred program"}
                      <span className="required">*</span>
                    </label>
                    <select
                      id="program"
                      name="program"
                      value={String(answers.program ?? "Computer Science")}
                      required
                      aria-invalid={Boolean(validationErrors.program)}
                      aria-describedby="program-error"
                      onFocus={() => handleFieldFocus("program")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("program", e.target.value)
                      }
                    >
                      <option value="Computer Science">
                        BSc Computer Science
                      </option>
                      <option value="Business Administration">
                        BBA Business Administration
                      </option>
                      <option value="Environmental Science">
                        BSc Environmental Science
                      </option>
                    </select>
                    <span className="hint">
                      Options come directly from the original PDF.
                    </span>
                    {validationErrors.program && (
                      <p id="program-error" className="field-error">
                        {validationErrors.program}
                      </p>
                    )}
                  </div>

                  <div className="field full">
                    <label htmlFor="intake">
                      {useOriginalLabels
                        ? originalSampleNames.intake
                        : "Entry term"}
                      <span className="required">*</span>
                    </label>
                    <select
                      id="intake"
                      name="intake"
                      value={String(answers.intake ?? "Autumn 2027")}
                      required
                      aria-invalid={Boolean(validationErrors.intake)}
                      aria-describedby="intake-error"
                      onFocus={() => handleFieldFocus("intake")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("intake", e.target.value)
                      }
                    >
                      <option value="Autumn 2027">Autumn 2027</option>
                      <option value="Spring 2028">Spring 2028</option>
                    </select>
                    {validationErrors.intake && (
                      <p id="intake-error" className="field-error">
                        {validationErrors.intake}
                      </p>
                    )}
                  </div>

                  <div className="field full">
                    <label htmlFor="studentId">
                      {useOriginalLabels
                        ? originalSampleNames.studentId
                        : "Existing student ID"}{" "}
                      <span className="muted" style={{ fontWeight: 400 }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      id="studentId"
                      name="studentId"
                      value={String(answers.studentId ?? "")}
                      maxLength={20}
                      aria-describedby="student-hint"
                      onFocus={() => handleFieldFocus("studentId")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("studentId", e.target.value)
                      }
                    />
                    <span id="student-hint" className="hint">
                      Already enrolled? Enter your university ID. New applicants
                      can leave this empty.
                    </span>
                  </div>

                  <div className="field full">
                    <label className="choice" htmlFor="scholarship">
                      <input
                        id="scholarship"
                        name="scholarship"
                        type="checkbox"
                        checked={Boolean(answers.scholarship)}
                        onFocus={() => handleFieldFocus("scholarship")}
                        onBlur={handleFieldBlur}
                        onChange={(e) =>
                          handleInputChange("scholarship", e.target.checked)
                        }
                      />
                      <span>
                        <strong style={{ fontSize: 12 }}>
                          Consider me for a merit scholarship
                        </strong>
                        <span className="hint">
                          Select this to express interest; it does not guarantee
                          an award.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="notice warning" style={{ marginTop: 22 }}>
                  <Icon name="info" />
                  <div>
                    <strong>Review this interpretation</strong>
                    The sample treats student ID as optional for new applicants.
                    This is an AI suggestion, not a university eligibility
                    decision.
                  </div>
                </div>
              </fieldset>

              {/* Section 2: Declarations */}
              <fieldset
                className="form-section"
                data-section="2"
                hidden={activeSection !== 2}
              >
                <legend className="sr-only">Declarations</legend>
                <div className="notice" style={{ marginBottom: 22 }}>
                  <Icon name="info" />
                  <div>
                    <strong>One final check</strong>
                    Read the declarations in the PDF before confirming. These
                    confirmations will be marked on your completed form.
                  </div>
                </div>

                <div className="field">
                  <label className="choice" htmlFor="accurate">
                    <input
                      id="accurate"
                      name="accurate"
                      type="checkbox"
                      required
                      checked={Boolean(answers.accurate)}
                      aria-invalid={Boolean(validationErrors.accurate)}
                      aria-describedby="accurate-error"
                      onFocus={() => handleFieldFocus("accurate")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("accurate", e.target.checked)
                      }
                    />
                    <span>
                      <strong>
                        I confirm my details are accurate.
                        <span className="required">*</span>
                      </strong>
                      <span className="hint">
                        The information I have provided is complete and correct
                        to the best of my knowledge.
                      </span>
                    </span>
                  </label>
                  {validationErrors.accurate && (
                    <p id="accurate-error" className="field-error">
                      {validationErrors.accurate}
                    </p>
                  )}
                </div>

                <div className="field" style={{ marginTop: 16 }}>
                  <label className="choice" htmlFor="consent">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      required
                      checked={Boolean(answers.consent)}
                      aria-invalid={Boolean(validationErrors.consent)}
                      aria-describedby="consent-error"
                      onFocus={() => handleFieldFocus("consent")}
                      onBlur={handleFieldBlur}
                      onChange={(e) =>
                        handleInputChange("consent", e.target.checked)
                      }
                    />
                    <span>
                      <strong>
                        I agree to document processing.
                        <span className="required">*</span>
                      </strong>
                      <span className="hint">
                        I confirm and authorize processing these details for this document.
                      </span>
                    </span>
                  </label>
                  {validationErrors.consent && (
                    <p id="consent-error" className="field-error">
                      {validationErrors.consent}
                    </p>
                  )}
                </div>

                <div className="helpbox">
                  <strong>
                    <Icon name="shield" />
                    You’re in control
                  </strong>
                  Downloading a completed form prepares your filled PDF document.
                  You will submit the file to your organization or institution directly.
                </div>
              </fieldset>
            </>
          )}

          <p className="hint" style={{ marginTop: 20 }}>
            {mode === "uploaded"
              ? "* Required field. Your answers will populate directly into your original PDF."
              : "* Required in this sample form. Nothing is submitted from this prototype."}
          </p>
        </CardBody>

        <CardFooter>
          <Button
            variant="ghost"
            id="form-back"
            type="button"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button variant="primary" id="form-next" type="submit">
            {activeSection === activeForm.sections.length - 1
              ? "Review my answers"
              : "Continue"}
            <Icon name="arrow" />
          </Button>
        </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
}
