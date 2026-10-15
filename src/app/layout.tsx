import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { IntakeProvider } from "@/features/intake/intake-provider";
import { FormProvider } from "@/features/form/form-context";
import type { ReactNode } from "react";
import "./globals.css";
import "@/styles/design.css";
import "@/styles/foundation.css";

export const metadata: Metadata = {
  title: "FormFlow — Less paperwork. More possibility.",
  description:
    "Turn complicated PDF forms into a clearer next step. Start with your PDF or explore a sample university application.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <IntakeProvider>
          <FormProvider>
            <AppShell>{children}</AppShell>
          </FormProvider>
        </IntakeProvider>
      </body>
    </html>
  );
}
