import type { ReactNode } from "react";

export type PageHeadingProps = {
  titleId?: string;
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeading({
  titleId,
  eyebrow,
  title,
  description,
  action,
}: PageHeadingProps) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1 id={titleId}>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
