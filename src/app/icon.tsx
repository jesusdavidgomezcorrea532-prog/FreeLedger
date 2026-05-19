import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0D",
          borderRadius: 6,
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 240 240"
          fill="#FFFFFF"
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
    ),
    { ...size },
  );
}
