import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FreeLedger — Know your real money";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background:
            "linear-gradient(135deg, #09090b 0%, #18181b 60%, #0a1f17 100%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #10b981 0%, #34d399 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.4)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34d399"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: -0.5,
              color: "#fafafa",
            }}
          >
            FreeLedger
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.05,
              color: "#fafafa",
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
            }}
          >
            <span>Know your</span>
            <span
              style={{
                background: "linear-gradient(90deg, #34d399 0%, #6ee7b7 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              real money.
            </span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#a1a1aa",
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            The finance dashboard built for freelancers.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#71717a",
              letterSpacing: 0.5,
            }}
          >
            freeledger.dev
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#34d399",
              padding: "8px 16px",
              borderRadius: 9999,
              border: "1px solid rgba(16,185,129,0.4)",
              background: "rgba(16,185,129,0.08)",
            }}
          >
            Track. Reserve. Keep.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
