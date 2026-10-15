import type { Metadata } from "next";
import { ReviewScreen } from "@/components/form/review-screen";

export const metadata: Metadata = {
  title: "Review answers — FormFlow",
  description:
    "Review your answers and check every detail before preparing and downloading your completed PDF.",
};

export default function ReviewPage() {
  return <ReviewScreen />;
}
