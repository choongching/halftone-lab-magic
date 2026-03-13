import { useHalftoneStore } from "@/store/halftoneStore";
import { cn } from "@/lib/utils";
import type { CreationMode } from "@/types/halftone";

const MODES: { value: CreationMode; label: string }[] = [
  { value: "procedural", label: "Procedural" },
  { value: "image", label: "From Image" },
];

export function ModeSwitch() {
  const { mode, setMode } = useHalftoneStore();

  return (
    <div className="flex rounded-lg bg-secondary p-0.5">
      {MODES.map((m) => (
        <button
          key={m.value}
          onClick={() => setMode(m.value)}
          className={cn(
            "rounded-md px-3 py-1 text-[11px] font-medium transition-all",
            mode === m.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-secondary-foreground hover:text-foreground"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
