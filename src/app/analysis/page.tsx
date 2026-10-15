import type { Metadata } from "next";
import { AnalysisScreen } from "@/components/onboarding/analysis-screen";

export const metadata: Metadata = { title: "Sample form analysis — FormFlow" };

export default function AnalysisPage() {
  return <AnalysisScreen />;
}
