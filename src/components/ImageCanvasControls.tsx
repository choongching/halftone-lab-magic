import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow, ToggleRow } from "./ControlSection";
import { type SizePreset } from "@/types/halftone";
import { cn } from "@/lib/utils";
import { HelpTip } from "./HelpTip";

const SIZE_PRESETS: { value: SizePreset; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "story", label: "Story" },
  { value: "poster", label: "Poster" },
  { value: "custom", label: "Custom" },
];

export function ImageCanvasControls() {
  const { config, setConfig, setSizePreset } = useHalftoneStore();

  return (
    <ControlSection title="Size" tooltip="Set the dimensions of your final artwork">
      <div className="flex gap-1.5 flex-wrap">
        {SIZE_PRESETS.map((sp) => (
          <button
            key={sp.value}
            onClick={() => setSizePreset(sp.value)}
            className={cn(
              "rounded-md px-2 py-1 text-[11px] font-medium transition-all",
              config.sizePreset === sp.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {sp.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Width</span>
          <input
            type="number"
            value={config.width}
            onChange={(e) =>
              setConfig({ width: parseInt(e.target.value) || 100, sizePreset: "custom" })
            }
            className="w-full rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Height</span>
          <input
            type="number"
            value={config.height}
            onChange={(e) =>
              setConfig({ height: parseInt(e.target.value) || 100, sizePreset: "custom" })
            }
            className="w-full rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground"
          />
        </div>
      </div>
      {config.advancedMode && (
        <>
          <SliderRow
            label="Margin"
            tooltip="Add breathing room around the edges of your artwork"
            value={config.padding}
            min={0}
            max={200}
            step={1}
            onChange={(v) => setConfig({ padding: v })}
            displayValue={`${config.padding}px`}
          />
          <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs text-secondary-foreground">
              Image Fit
              <HelpTip text="Fit Inside keeps the whole image visible. Fill covers the canvas, cropping edges" />
            </span>
            <div className="flex gap-1.5">
              {(["contain", "cover"] as const).map((fm) => (
                <button
                  key={fm}
                  onClick={() => setConfig({ fitMode: fm })}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-all",
                    config.fitMode === fm
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {fm}
                </button>
              ))}
            </div>
          </div>
          <ToggleRow
            label="Show BG"
            tooltip="Show or hide the background color behind the shapes"
            checked={config.showBackground}
            onChange={(v) => setConfig({ showBackground: v })}
          />
          <ToggleRow
            label="See-Through BG"
            tooltip="Export with a transparent background instead of a solid color"
            checked={config.transparentBackground}
            onChange={(v) => setConfig({ transparentBackground: v })}
          />
        </>
      )}
    </ControlSection>
  );
}
