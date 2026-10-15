import { cn } from "@/lib/cn";

export type SectionItem = { id: string; label: string; disabled?: boolean };
export type SectionTabsProps = {
  items: readonly SectionItem[];
  current: string;
  onChange: (id: string) => void;
  label?: string;
};

export function SectionTabs({
  items,
  current,
  onChange,
  label = "Form sections",
}: SectionTabsProps) {
  return (
    <nav className="section-tabs" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={cn(current === item.id && "active")}
          aria-current={current === item.id ? "step" : undefined}
          disabled={item.disabled}
          onClick={() => onChange(item.id)}
        >
          <b>{index + 1}</b>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
