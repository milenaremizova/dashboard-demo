import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { COLOR } from "../config/theme";

interface MetricOption {
  id: string;
  label: string;
}

interface Props {
  metrics: MetricOption[];
  active: string;
  onChange: (id: string) => void;
}

export function MetricSwitcher({ metrics, active, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeLabel = metrics.find((m) => m.id === active)?.label ?? "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (metrics.length <= 1) return null;

  return (
    <div ref={ref} style={styles.wrapper}>
      <button
        className="metric-switcher-trigger"
        onClick={() => setIsOpen((v) => !v)}
      >
        {activeLabel}
        <ChevronDown size={20} style={{ opacity: 0.6 }} />
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          {metrics.map((m) => (
            <button
              key={m.id}
              className={`dropdown-item${active === m.id ? " active" : ""}`}
              onClick={() => {
                onChange(m.id);
                setIsOpen(false);
              }}
            >
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: { position: "relative" },
  dropdown: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: "100%",
    width: "max-content",
    maxWidth: 320,
    top: "calc(100% + 6px)",
    left: 0,
    background: "var(--color-panel)",
    border: `1px solid ${COLOR.brand}`,
    borderRadius: 10,
    padding: 4,
    zIndex: 10,
    boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
  },
};
