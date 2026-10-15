import type { Metadata } from "next";
import { GuidedFormScreen } from "@/components/form/guided-form-screen";

export const metadata: Metadata = {
  title: "Fill form — FormFlow",
  description:
    "Answer clear questions step by step and see answers appear directly in the original form.",
};

export default function FillPage() {
  return <GuidedFormScreen />;
}
