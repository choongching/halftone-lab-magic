import { useMemo } from "react";
import { useHalftoneStore } from "@/store/halftoneStore";
import { renderHalftone } from "@/engine/renderers";

export function PreviewStage() {
  const config = useHalftoneStore((s) => s.config);

  const elements = useMemo(() => renderHalftone(config), [config]);

  const fg = config.invertColors ? config.backgroundColor : config.foregroundColor;
  const bg = config.invertColors ? config.foregroundColor : config.backgroundColor;

  const showBg = config.showBackground && !config.transparentBackground;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto p-8 bg-[hsl(240,6%,7%)]">
      <div
        className="relative shrink-0"
        style={{
          borderRadius: config.showFrame ? config.frameRadius : 0,
          overflow: config.showFrame ? "hidden" : "visible",
          boxShadow: config.showFrame ? "0 8px 40px rgba(0,0,0,0.5)" : "none",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <svg
          viewBox={`0 0 ${config.width} ${config.height}`}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: Math.min(config.width, 900),
            maxHeight: Math.min(config.height, 700),
          }}
        >
          {showBg && (
            <rect width={config.width} height={config.height} fill={bg} />
          )}
          {!showBg && config.transparentBackground && (
            <>
              <defs>
                <pattern id="checker" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#2a2a2a" />
                  <rect x="10" y="10" width="10" height="10" fill="#2a2a2a" />
                  <rect x="10" width="10" height="10" fill="#222" />
                  <rect y="10" width="10" height="10" fill="#222" />
                </pattern>
              </defs>
              <rect width={config.width} height={config.height} fill="url(#checker)" />
            </>
          )}
          <g fill={fg} stroke={fg}>
            {elements.map((el, i) => {
              if (el.type === "circle") {
                return <circle key={i} {...el.props} />;
              }
              if (el.type === "rect") {
                return <rect key={i} {...el.props} />;
              }
              if (el.type === "polygon") {
                return <polygon key={i} {...el.props} />;
              }
              if (el.type === "line") {
                return <line key={i} {...el.props} fill="none" />;
              }
              return null;
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
