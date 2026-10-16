import type { CSSProperties, ReactNode } from "react";
import { COLOR, FONT_SANS } from "../config/theme";

interface Props {
  title: string;
  periodLabel: string;
  periodControls: ReactNode;
  loading: boolean;
  error: string | null;
  children: ReactNode;
}

export function PageShell({
  title,
  periodLabel,
  periodControls,
  loading,
  error,
  children,
}: Props) {
  return (
    <div style={styles.page}>
      <div style={styles.blobTeal} />
      <div style={styles.blobLime} />
      <div style={styles.shell}>
        <header className="page-header" style={styles.header}>
          <div style={styles.brandBlock}>
            <div className="brand-top" style={styles.brandTop}>
              <svg
                className="logo logo-svg"
                width="120"
                height="140"
                viewBox="0 0 40 40"
                fill="none"
                style={styles.logo}
              >
                <rect
                  x="4"
                  y="22"
                  width="8"
                  height="14"
                  rx="3"
                  fill="#00c7b1"
                />
                <rect
                  x="16"
                  y="14"
                  width="8"
                  height="22"
                  rx="3"
                  fill="#00e0c4"
                />
                <rect
                  x="28"
                  y="6"
                  width="8"
                  height="30"
                  rx="3"
                  fill="#bdee00"
                />
                <circle cx="32" cy="0.5" r="3" fill="#bdee00" />
              </svg>
              <div className="eyebrow-text" style={styles.eyebrow}>
                Dashboard
              </div>
            </div>
            <div style={styles.headerContainer}>
              <h1 style={styles.title}>{title}</h1>
              <div style={styles.periodLabel}>{periodLabel}</div>
            </div>
          </div>
          {periodControls}
        </header>

        {error && (
          <div style={styles.errorBanner}>
            Не удалось загрузить данные: {error}
          </div>
        )}

        {loading ? <div style={styles.loading}>Загрузка…</div> : children}

        <footer style={styles.footer}>
          {import.meta.env.VITE_USE_MOCK_DATA !== "false"
            ? "Моковые данные. Подключи data/api.ts и переключи VITE_USE_MOCK_DATA=false, когда будет готов бэкенд."
            : "Демо со статичным бэкендом."}
        </footer>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: COLOR.bg,
    color: COLOR.text,
    fontFamily: FONT_SANS,
    padding: "24px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  blobTeal: {
    position: "absolute",
    top: "-10%",
    left: "5%",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: COLOR.brand,
    opacity: 0.25,
    filter: "blur(120px)",
    pointerEvents: "none",
  },

  blobLime: {
    position: "absolute",
    bottom: "-15%",
    right: "8%",
    width: 450,
    height: 450,
    borderRadius: "50%",
    background: COLOR.accent2,
    opacity: 0.12,
    filter: "blur(140px)",
    pointerEvents: "none",
  },

  shell: {
    width: "100%",
    maxWidth: 1700,
    margin: "0 auto",
    background: "rgba(13,54,72,0.45)",
    backdropFilter: "blur(32px) saturate(180%)",
    WebkitBackdropFilter: "blur(32px) saturate(180%)",
    borderRadius: 28,
    padding: "28px 28px 24px",
    border: "1px solid rgba(255,255,255,0.14)",
    borderTop: "1px solid rgba(255,255,255,0.28)",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
    position: "relative",
    zIndex: 1,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 4,
  },

  headerContainer: {
    display: "flex",
    justifyContent: "start",
    flexDirection: "column",
    gap: 4,
  },

  eyebrow: {
    fontSize: 42,
    fontWeight: 700,
    letterSpacing: 2,
    color: COLOR.accent2Transparent,
    textTransform: "uppercase",
    marginTop: 54,
  },

  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
    letterSpacing: 0.5,
  },

  periodLabel: {
    fontSize: 21,
    letterSpacing: 0.5,
    color: COLOR.text,
    margin: "10px 0 20px",
  },

  loading: {
    color: COLOR.textFaint,
    fontSize: 14,
    padding: "60px 0",
    textAlign: "center",
  },
  errorBanner: {
    background: "#ff8a8022",
    border: "1px solid #ff8a8055",
    color: "#ff8a80",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 16,
  },

  footer: {
    fontSize: 12,
    color: COLOR.textFaint,
    textAlign: "center",
    marginTop: 20,
  },

  brandBlock: { display: "flex", flexDirection: "column", gap: 40 },
  brandTop: { display: "flex", alignItems: "center", gap: 30 },
  logo: { flexShrink: 0 },
};
