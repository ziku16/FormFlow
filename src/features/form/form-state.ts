export const defaultSampleAnswers: Record<string, string | boolean> = {
  firstName: "Ayesha",
  lastName: "Khan",
  email: "ayesha.khan@example.com",
  dob: "2005-04-18",
  phone: "+92 300 555 0142",
  address: "42 Garden Road, Lahore, Pakistan",
  program: "Computer Science",
  intake: "Autumn 2027",
  studentId: "",
  scholarship: true,
  accurate: false,
  consent: false,
};

export const sampleFieldLabels: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email address",
  dob: "Date of birth",
  phone: "Phone number",
  address: "Postal address",
  program: "Preferred program",
  intake: "Entry term",
  studentId: "Existing student ID",
  scholarship: "Merit scholarship",
  accurate: "Details confirmed",
  consent: "Processing consent",
};

export const originalSampleNames: Record<string, string> = {
  firstName: "applicant.first_name",
  lastName: "applicant.last_name",
  email: "contact.email",
  dob: "applicant.date_of_birth",
  phone: "contact.telephone",
  address: "contact.postal_address",
  program: "study.program",
  intake: "study.entry_term",
  studentId: "applicant.student_id",
  scholarship: "study.scholarship",
  accurate: "declaration.accurate",
  consent: "declaration.consent",
};

export function displayValue(
  val: string | boolean | undefined,
): string {
  if (typeof val === "boolean") return val ? "Yes" : "Not selected";
  return val && String(val).trim() ? String(val).trim() : "Not provided";
}

export function validateFieldValue(
  id: string,
  value: string | boolean | undefined,
  required: boolean,
  label: string,
): { valid: boolean; message?: string } {
  if (typeof value === "boolean") {
    if (required && !value) {
      return {
        valid: false,
        message: "Please confirm this declaration to continue.",
      };
    }
    return { valid: true };
  }
  const str = String(value ?? "").trim();
  if (required && !str) {
    return { valid: false, message: `${label} is required.` };
  }
  if (!str) return { valid: true };
  if (id === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(str)) {
      return {
        valid: false,
        message: "Enter a complete email address, such as ayesha@example.com.",
      };
    }
  }
  if (id === "phone") {
    const isPhone =
      /^\+?[\d\s().-]+$/.test(str) && str.replace(/\D/g, "").length >= 7;
    if (!isPhone) {
      return {
        valid: false,
        message:
          "Enter a phone number with at least 7 digits and a country code.",
      };
    }
  }
  if (id === "dob") {
    if (str >= "2026-10-15") {
      return {
        valid: false,
        message: "Enter a valid birth date before 15 October 2026.",
      };
    }
  }
  return { valid: true };
}

export function getFormErrors(
  answers: Record<string, string | boolean>,
  sections: readonly {
    readonly fields: readonly {
      readonly id: string;
      readonly label: string;
      readonly required: boolean;
    }[];
  }[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const section of sections) {
    for (const field of section.fields) {
      const val = answers[field.id];
      const res = validateFieldValue(field.id, val, field.required, field.label);
      if (!res.valid && res.message) {
        errors[field.id] = res.message;
      }
    }
  }
  return errors;
}
