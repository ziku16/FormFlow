export const screenItems = [
  {
    id: "system",
    label: "Design system",
    available: true,
    href: "/design-system",
  },
  { id: "upload", label: "01 Upload", available: true, href: "/" },
  { id: "analysis", label: "02 Analysis", available: true, href: "/analysis" },
  { id: "fill", label: "03 Fill form", available: false, href: null },
  { id: "review", label: "04 Review", available: false, href: null },
  { id: "download", label: "05 Download", available: false, href: null },
  { id: "states", label: "States & feedback", available: false, href: null },
] as const;

export type ScreenId = (typeof screenItems)[number]["id"];

export const foundationSections = [
  { id: "ds-colors", label: "01 Color palette" },
  { id: "ds-type", label: "02 Typography" },
  { id: "ds-space", label: "03 Space & depth" },
  { id: "ds-components", label: "04 Components" },
  { id: "ds-navigation", label: "05 Navigation" },
  { id: "ds-voice", label: "06 Voice & behavior" },
] as const;
