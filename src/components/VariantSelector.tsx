import { useHalftoneStore } from "@/store/halftoneStore";
import { VARIANT_LABELS, type HalftoneVariant } from "@/types/halftone";
import { cn } from "@/lib/utils";

const VARIANTS: HalftoneVariant[] = [
  "dot-grid", "square-grid", "triangle-grid",
  "helio-circles", "noise-scatter", "wave-dashes",
];

export function VariantSelector() {
  const { config, setConfig } = useHalftoneStore();

  return (
    <div className="flex flex-wrap gap-1.5">
      {VARIANTS.map((v) => (
        <button
          key={v}
          onClick={() => setConfig({ variant: v })}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-all",
            config.variant === v
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {VARIANT_LABELS[v]}
        </button>
      ))}
    </div>
  );
}
