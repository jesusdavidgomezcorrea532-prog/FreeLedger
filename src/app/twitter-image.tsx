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
              width="38"
              height="38"
              viewBox="0 0 240 240"
              fill="#34d399"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="30,220 70,220 104,40 64,40" />
              <polygon points="64,40 170,40 166.2,60 100.2,60" />
              <polygon points="89,120 149,120 144.4,144 84.4,144" />
              <polygon points="170,40 190,40 188.86,46 168.86,46" />
              <polygon points="168.67,47 200.67,47 199.53,53 167.53,53" />
              <polygon points="167.34,54 211.34,54 210.2,60 166.2,60" />
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
