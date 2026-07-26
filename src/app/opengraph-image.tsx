import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DailyOps.Tech — IT Infrastructure Knowledge Hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social preview image for the whole site. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #0A1128 0%, #111C44 55%, #0c1a30 100%)",
          padding: 64,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#2BD9C5",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          DailyOps.Tech
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#f8fafc",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            IT Infrastructure Knowledge Hub
          </div>
          <div style={{ color: "#94a3b8", fontSize: 26, lineHeight: 1.4, maxWidth: 820 }}>
            Networking · Security · Cloud · Operations — production-ready guides
          </div>
        </div>
        <div style={{ color: "#64748b", fontSize: 20 }}>www.dailyops.tech</div>
      </div>
    ),
    { ...size }
  );
}
