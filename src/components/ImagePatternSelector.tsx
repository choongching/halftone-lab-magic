import { useHalftoneStore } from "@/store/halftoneStore";
import { IMAGE_PATTERN_LABELS, type ImagePatternType } from "@/types/halftone";
import { cn } from "@/lib/utils";

const PATTERNS: ImagePatternType[] = ["dot-grid", "square-grid", "triangle-grid"];

export function ImagePatternSelector() {
  const { config, setConfig } = useHalftoneStore();

  return (
    <div className="flex flex-wrap gap-1.5">
      {PATTERNS.map((p) => (
        <button
          key={p}
          onClick={() => setConfig({ patternType: p })}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-all",
            config.patternType === p
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {IMAGE_PATTERN_LABELS[p]}
        </button>
      ))}
    </div>
  );
}
