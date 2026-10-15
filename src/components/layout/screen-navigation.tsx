import { screenItems, type ScreenId } from "@/lib/navigation";

export type ScreenNavigationProps = {
  current: ScreenId;
  onNavigate: (screen: ScreenId) => void;
};

export function ScreenNavigation({
  current,
  onNavigate,
}: ScreenNavigationProps) {
  return (
    <header className="labbar">
      <div className="labinner">
        <span className="lab-label">FormFlow · AI PDF Form Engine</span>
        <nav className="viewnav" aria-label="Application screens">
          {screenItems.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={current === item.id ? "page" : undefined}
              disabled={!item.available}
              title={item.label}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <span className="version">PRODUCTION · GEMINI 3.6 FLASH</span>
      </div>
    </header>
  );
}
