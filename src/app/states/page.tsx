import type { Metadata } from "next";
import { StatesScreen } from "@/components/form/states-screen";

export const metadata: Metadata = {
  title: "States & feedback — FormFlow",
  description:
    "Clear feedback, useful next steps, and no dead ends across all application error and loading states.",
};

export default function StatesPage() {
  return <StatesScreen />;
}
