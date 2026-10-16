import type { CSSProperties, ReactNode } from "react";
import { X } from "lucide-react";
import { COLOR } from "../config/theme";
import { FONT_SANS } from "../config/theme";

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: Props) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>{title}</div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: FONT_SANS,
    zIndex: 100,
  },
  dialog: {
    background: COLOR.shell,
    border: `1 px solid ${COLOR.brand}`,
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    maxWidth: 1020,
    width: "90%",
    maxHeight: "85vh",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: `1px solid ${COLOR.brand}`,
    position: "sticky",
    top: 0,
    background: COLOR.shell,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: COLOR.text,
  },
  closeBtn: {
    display: "flex",
    background: "transparent",
    border: "none",
    color: COLOR.textFaint,
    cursor: "pointer",
    padding: 4,
  },
  body: {
    padding: 20,
  },
};
