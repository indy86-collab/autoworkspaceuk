import { ImageResponse } from "next/og";

export const alt = "AutoWorkspace UK — Find space. Fix more.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#172554",
          color: "#ffffff",
          padding: "72px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "720px" }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: "0.22em", color: "#93c5fd" }}>
            UK DIRECTORY
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.05, marginTop: 18 }}>
            AutoWorkspace UK
          </div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 24, color: "#fdba74" }}>Find space. Fix more.</div>
        </div>
        <div
          style={{
            display: "flex",
            width: 220,
            height: 220,
            borderRadius: 36,
            background: "#1d4ed8",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 88,
              height: 88,
              borderRadius: 999,
              border: "14px solid #ffffff",
              marginTop: -28,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: "28px solid transparent",
              borderRight: "28px solid transparent",
              borderTop: "48px solid #ffffff",
              bottom: 42,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 18,
              bottom: 18,
              width: 64,
              height: 18,
              background: "#fdba74",
              borderRadius: 6,
              transform: "rotate(-35deg)",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
