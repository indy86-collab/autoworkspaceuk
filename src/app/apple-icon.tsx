import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1d4ed8",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 64,
            height: 64,
            borderRadius: 999,
            border: "10px solid #ffffff",
            marginTop: -18,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderTop: "34px solid #ffffff",
            bottom: 38,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: 28,
            width: 46,
            height: 14,
            background: "#fdba74",
            borderRadius: 4,
            transform: "rotate(-35deg)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
