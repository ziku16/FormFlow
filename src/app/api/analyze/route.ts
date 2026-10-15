import { NextResponse } from "next/server";

export type FieldAnalysisRequest = {
  filename: string;
  fields: Array<{
    name: string;
    type: "text" | "checkbox" | "dropdown";
    required?: boolean;
    options?: readonly string[];
  }>;
};

export type FieldAnalysisResponse = {
  success: boolean;
  sections: Array<{
    id: string;
    title: string;
    fields: Array<{
      id: string;
      pdfName: string;
      label: string;
      type: "text" | "checkbox" | "dropdown";
      required: boolean;
      options?: readonly string[];
      hint?: string;
    }>;
  }>;
  aiEnhanced: boolean;
  model?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FieldAnalysisRequest;
    if (!body || !Array.isArray(body.fields)) {
      return NextResponse.json(
        { error: "Invalid request payload. 'fields' array is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    const primaryModel = process.env.GEMINI_MODEL || "gemini-3.6-flash";

    // Try Gemini API with fast 4s timeout and zero thinking delay
    if (apiKey) {
      try {
        const prompt = `You are FormFlow AI. Convert these raw PDF field identifiers into a user-friendly, structured form schema.
Document filename: "${body.filename}"
Raw fields: ${JSON.stringify(body.fields)}

Respond ONLY with valid JSON with this exact schema:
{
  "sections": [
    {
      "id": "section-id",
      "title": "Section Title",
      "fields": [
        {
          "id": "exact_raw_field_name",
          "pdfName": "exact_raw_field_name",
          "label": "Friendly Label",
          "type": "text" | "checkbox" | "dropdown",
          "required": boolean,
          "options": ["Option 1"] (if dropdown),
          "hint": "Helpful guidance or explanation if needed"
        }
      ]
    }
  ]
}
Rule: You must preserve each field's exact raw name in both 'id' and 'pdfName'.`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${primaryModel}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(4500),
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                thinkingConfig: {
                  thinkingBudget: 0,
                },
              },
            }),
          },
        );

        if (res.ok) {
          const data = await res.json();
          const textPart =
            data?.candidates?.[0]?.content?.parts?.find(
              (p: { text?: string }) => Boolean(p.text),
            )?.text ?? "";

          if (textPart) {
            const parsed = JSON.parse(
              textPart.replace(/```json/g, "").replace(/```/g, "").trim(),
            );

            if (parsed && Array.isArray(parsed.sections) && parsed.sections.length > 0) {
              return NextResponse.json({
                success: true,
                sections: parsed.sections,
                aiEnhanced: true,
                model: primaryModel,
              });
            }
          }
        }
      } catch {
        // Fallback directly to deterministic local enrichment without slow cascade
      }
    }

    // Deterministic intelligent local field transformation fallback
    const enrichedFields = body.fields.map((f) => {
      const label = formatLabel(f.name);
      return {
        id: f.name,
        pdfName: f.name,
        label,
        type: f.type,
        required: Boolean(f.required),
        options: f.options,
        hint: generateHint(f.name, f.type),
      };
    });

    const chunkSize = Math.max(1, Math.ceil(enrichedFields.length / 3));
    const sections = [
      {
        id: "section-1",
        title: "Personal & General Information",
        fields: enrichedFields.slice(0, chunkSize),
      },
    ];

    if (enrichedFields.length > chunkSize) {
      sections.push({
        id: "section-2",
        title: "Preferences & Requirements",
        fields: enrichedFields.slice(chunkSize, chunkSize * 2),
      });
    }

    if (enrichedFields.length > chunkSize * 2) {
      sections.push({
        id: "section-3",
        title: "Confirmations & Declarations",
        fields: enrichedFields.slice(chunkSize * 2),
      });
    }

    return NextResponse.json({
      success: true,
      sections,
      aiEnhanced: false,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process form analysis request." },
      { status: 500 },
    );
  }
}

function formatLabel(name: string): string {
  const last = name.split(".").pop() ?? name;
  return last
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function generateHint(name: string, type: string): string | undefined {
  const lower = name.toLowerCase();
  if (lower.includes("email")) return "We'll use this for official correspondence.";
  if (lower.includes("phone") || lower.includes("tel"))
    return "Include country code and area code.";
  if (lower.includes("address"))
    return "Enter your current mailing or residential address.";
  if (type === "checkbox") return "Select to confirm or express interest.";
  return undefined;
}
