import type { Metadata } from "next";
import { DownloadScreen } from "@/components/form/download-screen";

export const metadata: Metadata = {
  title: "Download completed PDF — FormFlow",
  description:
    "Your sample form is ready. Download it, give it a final look, and take your next step.",
};

export default function DownloadPage() {
  return <DownloadScreen />;
}
