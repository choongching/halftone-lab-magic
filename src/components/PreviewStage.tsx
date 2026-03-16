import { useMemo } from "react";
import { useHalftoneStore } from "@/store/halftoneStore";
import { renderImageHalftone } from "@/engine/imageRenderer";
import { useImageLuminance } from "@/hooks/useImageLuminance";
import { Upload } from "lucide-react";

export function PreviewStage() {
  const config = useHalftoneStore((s) => s.config);
  const lumaMap = useImageLuminance(config);

  const elements = useMemo(() => {
    if (!lumaMap) return [];
    return renderImageHalftone(config, lumaMap);
  }, [config, lumaMap]);

  const fg = config.invertColors ? config.backgroundColor : config.foregroundColor;
  const bg = config.invertColors ? config.foregroundColor : config.backgroundColor;
  const showBg = config.showBackground && !config.transparentBackground;

  if (!config.sourceImageUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center overflow-auto p-8 bg-[hsl(240,6%,7%)]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Upload className="h-10 w-10 opacity-30" />
          <p className="text-sm">Upload an image to get started</p>
          <p className="text-xs opacity-50">Use the Source Image section in the left panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto p-4 bg-[hsl(240,6%,7%)]">
      <div
        className="relative shrink-0"
        style={{
          borderRadius: config.showFrame ? config.frameRadius : 0,
          overflow: config.showFrame ? "hidden" : "visible",
          boxShadow: config.showFrame ? "0 8px 40px rgba(0,0,0,0.5)" : "none",
          width: "50%",
          maxWidth: "50%",
          maxHeight: "50%",
        }}
      >
        <svg
          viewBox={`0 0 ${config.width} ${config.height}`}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {showBg && <rect width={config.width} height={config.height} fill={bg} />}
          {!showBg && config.transparentBackground && (
            <CheckerPattern w={config.width} h={config.height} />
          )}
          <g fill={fg} stroke={fg}>
            {elements.map((el, i) => renderElement(el, i))}
          </g>
        </svg>
      </div>
    </div>
  );
}

function CheckerPattern({ w, h }: { w: number; h: number }) {
  return (
    <>
      <defs>
        <pattern id="checker" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#2a2a2a" />
          <rect x="10" y="10" width="10" height="10" fill="#2a2a2a" />
          <rect x="10" width="10" height="10" fill="#222" />
          <rect y="10" width="10" height="10" fill="#222" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#checker)" />
    </>
  );
}

function renderElement(el: { type: string; props: Record<string, string | number> }, i: number) {
  if (el.type === "circle") return <circle key={i} {...el.props} />;
  if (el.type === "rect") return <rect key={i} {...el.props} />;
  if (el.type === "polygon") return <polygon key={i} {...el.props} />;
  if (el.type === "line") return <line key={i} {...el.props} fill="none" />;
  return null;
}
