import { Fragment } from "react";
import { cn } from "@/lib/cn";

export type WorkflowStep = 1 | 2 | 3 | 4;
const steps = ["Upload", "Fill form", "Review", "Download"] as const;

export function Stepper({ current }: { current: WorkflowStep }) {
  return (
    <nav className="flowsteps" aria-label="Application progress">
      {steps.map((label, index) => (
        <Fragment key={label}>
          {index > 0 && <span className="step-line" aria-hidden="true" />}
          <span
            className={cn(
              "step",
              index + 1 === current && "active",
              index + 1 < current && "done",
            )}
            aria-current={index + 1 === current ? "step" : undefined}
          >
            <b aria-hidden="true">{index + 1 < current ? "✓" : index + 1}</b>
            <span className="sr-only">
              {index + 1 < current ? "Completed: " : ""}
            </span>
            {label}
          </span>
        </Fragment>
      ))}
    </nav>
  );
}
