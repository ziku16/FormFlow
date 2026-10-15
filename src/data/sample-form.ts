export type SampleTextField = {
  id: string;
  pdfName: string;
  label: string;
  type: "text";
  required: boolean;
};
export type SampleCheckboxField = {
  id: string;
  pdfName: string;
  label: string;
  type: "checkbox";
  required: boolean;
};
export type SampleDropdownField = {
  id: string;
  pdfName: string;
  label: string;
  type: "dropdown";
  required: boolean;
  options: readonly string[];
};
export type SampleField =
  SampleTextField | SampleCheckboxField | SampleDropdownField;
export type SampleSection = {
  id: string;
  title: string;
  fields: readonly SampleField[];
};
export type SampleForm = {
  filename: string;
  title: string;
  academicYear: string;
  reference: string;
  pageCount: number;
  estimatedMinutes: number;
  sections: readonly SampleSection[];
};

export const sampleForm = {
  filename: "northbridge_application.pdf",
  title: "Undergraduate Application Form",
  academicYear: "2027–2028",
  reference: "NU-UG-01",
  pageCount: 1,
  estimatedMinutes: 4,
  sections: [
    {
      id: "personal",
      title: "Personal information",
      fields: [
        {
          id: "firstName",
          pdfName: "applicant.first_name",
          label: "First name",
          type: "text",
          required: true,
        },
        {
          id: "lastName",
          pdfName: "applicant.last_name",
          label: "Last name",
          type: "text",
          required: true,
        },
        {
          id: "email",
          pdfName: "contact.email",
          label: "Email address",
          type: "text",
          required: true,
        },
        {
          id: "dob",
          pdfName: "applicant.date_of_birth",
          label: "Date of birth",
          type: "text",
          required: true,
        },
        {
          id: "phone",
          pdfName: "contact.telephone",
          label: "Telephone (including country code)",
          type: "text",
          required: true,
        },
        {
          id: "address",
          pdfName: "contact.postal_address",
          label: "Postal address",
          type: "text",
          required: true,
        },
      ],
    },
    {
      id: "study",
      title: "Academic preferences",
      fields: [
        {
          id: "program",
          pdfName: "study.program",
          label: "Program of study",
          type: "dropdown",
          required: true,
          options: [
            "Computer Science",
            "Business Administration",
            "Environmental Science",
          ],
        },
        {
          id: "intake",
          pdfName: "study.entry_term",
          label: "Entry term",
          type: "dropdown",
          required: true,
          options: ["Autumn 2027", "Spring 2028"],
        },
        {
          id: "studentId",
          pdfName: "applicant.student_id",
          label: "Student ID (if applicable)",
          type: "text",
          required: false,
        },
        {
          id: "scholarship",
          pdfName: "study.scholarship",
          label: "Merit scholarship consideration",
          type: "checkbox",
          required: false,
        },
      ],
    },
    {
      id: "declarations",
      title: "Declaration",
      fields: [
        {
          id: "accurate",
          pdfName: "declaration.accurate",
          label:
            "I certify that the information provided is complete and accurate.",
          type: "checkbox",
          required: true,
        },
        {
          id: "consent",
          pdfName: "declaration.consent",
          label: "I consent to processing my details for this application.",
          type: "checkbox",
          required: true,
        },
      ],
    },
  ],
} as const satisfies SampleForm;
