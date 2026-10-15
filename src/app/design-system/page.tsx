import type { Metadata } from "next";
import { DesignSystem } from "@/components/design-system/design-system";

export const metadata: Metadata = { title: "Design system — FormFlow" };

export default function DesignSystemPage() {
  return <DesignSystem />;
}
