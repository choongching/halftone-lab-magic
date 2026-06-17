import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, ToggleRow } from "./ControlSection";

const PALETTE_SWATCHES = [
  { fg: "#fdf1e7", bg: "#231008" },
  { fg: "#f15a22", bg: "#fdf1e7" },
  { fg: "#e8e4dc", bg: "#1a1a2e" },
  { fg: "#ffffff", bg: "#0a0a0a" },
  { fg: "#f5c542", bg: "#16213e" },
  { fg: "#ff6b6b", bg: "#1b1b2f" },
  { fg: "#4ecdc4", bg: "#0d1117" },
  { fg: "#a8e6cf", bg: "#2d132c" },
  { fg: "#ff8a5c", bg: "#0a192f" },
  { fg: "#d4a5ff", bg: "#121212" },
];

export function ImageColorControls() {
  const { config, setConfig } = useHalftoneStore();

  return (
    <ControlSection title="Colors" tooltip="Pick colors for your shapes and background">
      <ToggleRow
        label="Flip Colors"
        tooltip="Swap the shape and background colors"
        checked={config.invertColors}
        onChange={(v) => setConfig({ invertColors: v })}
      />
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Shape Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.foregroundColor}
              onChange={(e) => setConfig({ foregroundColor: e.target.value })}
              className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <span className="font-mono text-[10px] text-muted-foreground">
              {config.foregroundColor}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Canvas Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => setConfig({ backgroundColor: e.target.value })}
              className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <span className="font-mono text-[10px] text-muted-foreground">
              {config.backgroundColor}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <span className="text-[10px] text-muted-foreground">Quick Picks</span>
        <div className="flex flex-wrap gap-1.5">
          {PALETTE_SWATCHES.map((s, i) => (
            <button
              key={i}
              onClick={() => setConfig({ foregroundColor: s.fg, backgroundColor: s.bg })}
              className="flex h-6 w-6 overflow-hidden rounded-md border border-border"
              title={`${s.fg} on ${s.bg}`}
            >
              <div className="h-full w-1/2" style={{ background: s.bg }} />
              <div className="h-full w-1/2" style={{ background: s.fg }} />
            </button>
          ))}
        </div>
      </div>
    </ControlSection>
  );
}
