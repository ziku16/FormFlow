import type { SVGProps } from "react";

const paths = {
  logo: (
    <>
      <path d="M5 19V5h14M5 12h10M11 19l8-8M14 11h5v5" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4 4L19 6" />
    </>
  ),
  file: (
    <>
      <path d="M14 3H5v18h14V8l-5-5Z M14 3v5h5M8 12h8M8 16h6" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3ZM20 2v4m-2-2h4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7v.1" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v13m-5-5 5 5 5-5M4 16v5h16v-5" />
    </>
  ),
  edit: (
    <>
      <path d="m15 4 5 5M4 20l5-1L21 7l-4-4L5 15l-1 5Z" />
    </>
  ),
  shield: (
    <>
      <path d="m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5l8-3Z M8 11l3 3 5-6" />
    </>
  ),
  book: (
    <>
      <path d="M12 6C8 3 4 4 2 5v15c3-2 7-2 10 0 3-2 7-2 10 0V5c-3-2-7-2-10 1Zm0 0v14" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M6 18 18 6" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;
export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  name: IconName;
};

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}
