import { ImageResponse } from "next/og"

export const alt = "Tirbeo — Coming soon"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

const bg = "#000000"
const fg = "#f4f4f2"
const muted = "#8c8c8c"
const accent = "#ffffff"
const hairline = `${fg}33`

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: bg,
          color: fg,
          fontFamily: "sans-serif",
        }}
      >
        {/* Frame */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            margin: 44,
            border: `1px solid ${hairline}`,
          }}
        >
          {/* Meta band */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 34px",
              borderBottom: `1px solid ${hairline}`,
              fontSize: 19,
              color: muted,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: accent,
                  color: bg,
                  fontSize: 19,
                  fontWeight: 700,
                }}
              >
                T
              </div>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: fg }}>
                Tirbeo
              </div>
            </div>
            <div style={{ display: "flex" }}>Kathmandu</div>
          </div>

          {/* Statement */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 34px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 112,
                  lineHeight: 1,
                  letterSpacing: "-6px",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                Coming
              </div>
              <div style={{ flex: 1, display: "flex", height: 2, background: hairline }} />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                marginTop: 24,
              }}
            >
              <div style={{ flex: 1, display: "flex", height: 2, background: hairline }} />
              <div style={{ display: "flex", fontSize: 112, lineHeight: 1, letterSpacing: "-6px", fontWeight: 700, whiteSpace: "nowrap" }}>
                <span>soon</span>
                <span style={{ color: accent }}>.</span>
              </div>
            </div>
          </div>

          {/* Foot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "22px 34px",
              borderTop: `1px solid ${hairline}`,
              fontSize: 19,
              color: muted,
            }}
          >
            <div style={{ display: "flex" }}>Not open yet.</div>
            <div style={{ display: "flex", color: fg }}>tirbeo.com</div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
