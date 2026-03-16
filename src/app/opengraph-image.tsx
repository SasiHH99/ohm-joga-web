import { ImageResponse } from "next/og";

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
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(135deg, rgba(247,243,237,1) 0%, rgba(220,200,176,1) 48%, rgba(215,225,213,1) 100%)",
          padding: "72px",
          color: "#201d1b",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#556b5d",
          }}
        >
          Ohm Jóga
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 0.95,
            }}
          >
            <div style={{ display: "flex" }}>Csend</div>
            <div style={{ display: "flex" }}>gyakorlás</div>
            <div style={{ display: "flex" }}>jelenlét</div>
          </div>
          <div style={{ fontSize: 32, maxWidth: 760, lineHeight: 1.35 }}>
            Letisztult, spirituális hangulatú jógaoldal bemutatkozással,
            órarenddel és egyszerű kapcsolati információkkal.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
