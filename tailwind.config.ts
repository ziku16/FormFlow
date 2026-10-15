import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-50": "var(--primary-50)",
        "primary-100": "var(--primary-100)",
        "primary-500": "var(--primary-500)",
        "primary-700": "var(--primary-700)",
        "primary-900": "var(--primary-900)",
        "secondary-50": "var(--secondary-50)",
        "secondary-500": "var(--secondary-500)",
        "neutral-0": "var(--neutral-0)",
        "neutral-50": "var(--neutral-50)",
        "neutral-100": "var(--neutral-100)",
        "neutral-200": "var(--neutral-200)",
        "neutral-400": "var(--neutral-400)",
        "neutral-600": "var(--neutral-600)",
        "neutral-900": "var(--neutral-900)",
        success: "var(--success)",
        "success-bg": "var(--success-bg)",
        warning: "var(--warning)",
        "warning-bg": "var(--warning-bg)",
        error: "var(--error)",
        "error-bg": "var(--error-bg)",
        info: "var(--info)",
        "info-bg": "var(--info-bg)",
      },
      spacing: {
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "5": "var(--space-5)",
        "6": "var(--space-6)",
        "8": "var(--space-8)",
        "10": "var(--space-10)",
        "12": "var(--space-12)",
        "16": "var(--space-16)",
        "20": "var(--space-20)",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
    },
  },
  plugins: [],
};

export default config;
