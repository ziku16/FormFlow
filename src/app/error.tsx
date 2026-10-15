"use client";

import Link from "next/link";
import { Button, Card, Icon } from "@/components/ui";

export default function ApplicationError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="state-card" role="alert" style={{ marginTop: 36 }}>
      <div className="state-icon">
        <Icon name="info" />
      </div>
      <h2>We couldn’t open this screen.</h2>
      <p>
        Your selected file hasn’t been sent anywhere. Try loading the screen
        again, or return to the upload page.
      </p>
      <div className="demo-row">
        <Button onClick={reset}>Try again</Button>
        <Link className="btn btn-secondary" href="/">
          Back to upload
        </Link>
      </div>
    </Card>
  );
}
