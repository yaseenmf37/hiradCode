import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Hirad Code — Web Design & Development";

// Latin-only so it renders correctly with the default fonts (no Persian glyphs).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(1000px 500px at 80% -10%, #6a12c2 0%, transparent 60%), radial-gradient(900px 500px at 0% 120%, #b026ff 0%, transparent 55%), #050208",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "22px",
              background: "linear-gradient(135deg, #b026ff, #6a12c2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: 800,
            }}
          >
            {"</>"}
          </div>
          <div style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px" }}>
            Hirad Code
          </div>
        </div>

        <div
          style={{
            marginTop: "48px",
            fontSize: "76px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-2px",
            maxWidth: "900px",
          }}
        >
          Web design &amp; development, done right.
        </div>

        <div style={{ marginTop: "28px", fontSize: "34px", color: "#b8a9d6" }}>
          hiradcode.ir
        </div>
      </div>
    ),
    { ...size },
  );
}
