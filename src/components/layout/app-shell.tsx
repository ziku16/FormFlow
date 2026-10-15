"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { screenItems, type ScreenId } from "@/lib/navigation";
import {
  Badge,
  Button,
  Icon,
  Modal,
  Notice,
  ToastProvider,
} from "@/components/ui";
import { ScreenNavigation } from "./screen-navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const current =
    screenItems.find((item) => item.href === pathname)?.id ?? "upload";

  useEffect(() => {
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);

  function navigate(screen: ScreenId) {
    const destination = screenItems.find((item) => item.id === screen)?.href;
    if (!destination) return;
    setHelpOpen(false);
    if (destination === pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("main")?.focus({ preventScroll: true });
    } else {
      router.push(destination);
    }
  }
  return (
    <ToastProvider>
      <a className="skip" href="#main">
        Skip to main content
      </a>
      <ScreenNavigation current={current} onNavigate={navigate} />
      <div className="shell">
        <header className="appheader">
          <button
            type="button"
            className="logo"
            onClick={() => navigate("upload")}
            aria-label="FormFlow home"
          >
            <span className="logomark">
              <Icon name="logo" />
            </span>
            formflow<span style={{ color: "var(--primary-500)" }}>.</span>
          </button>
          <div className="header-right">
            <Badge tone="neutral">A little less paperwork.</Badge>
            <Button variant="ghost" size="sm" onClick={() => setHelpOpen(true)}>
              <Icon name="info" />
              How it works
            </Button>
            <span className="avatar" aria-label="Demo user Ayesha Khan">
              AK
            </span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="footer">
          <span>© 2026 FormFlow · Designed to move you forward.</span>
          <span>
            <Icon name="lock" />
            Interactive design prototype · fictional institution &amp; sample
            data
          </span>
        </footer>
      </div>
      <Modal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="A simpler path through."
      >
        <ol
          style={{
            paddingLeft: 20,
            margin: "24px 0",
            display: "grid",
            gap: 15,
          }}
        >
          <li>
            <strong>Start with a PDF.</strong> The production app will read
            existing fillable fields.
          </li>
          <li>
            <strong>Answer clear questions.</strong> See answers alongside the
            original document.
          </li>
          <li>
            <strong>Review, then download.</strong> Check your details before
            exporting the completed form.
          </li>
        </ol>
        <Notice title="What you can try now">
          Select a PDF to check its file type, size, and signature, or open the
          prepared university sample. Your file stays in this tab. Live PDF
          field extraction, AI analysis, and guided form entry are not enabled
          yet.
        </Notice>
      </Modal>
    </ToastProvider>
  );
}
