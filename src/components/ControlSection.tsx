import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { HelpTip } from "./HelpTip";

interface ControlSectionProps {
  title: string;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

/**
 * A collapsible accordion row. Each section opens and closes independently, so
 * several can stay expanded at once. Sections stack with a hairline top border.
 */
export function ControlSection({ title, tooltip, children, className, defaultOpen = true }: ControlSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-t border-border first:border-t-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-secondary/30"
      >
        <span className="flex items-center gap-1.5 font-geist-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {title}
          {tooltip && <HelpTip text={tooltip} />}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            open ? "" : "-rotate-90"
          )}
        />
      </button>
      {/* grid-rows trick animates height without measuring content */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  tooltip?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

/** A labelled boolean control rendered as a toggle switch. */
export function ToggleRow({ label, tooltip, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-xs text-secondary-foreground">
        {label}
        {tooltip && <HelpTip text={tooltip} />}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

interface SliderRowProps {
  label: string;
  tooltip?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  displayValue?: string;
}

export function SliderRow({ label, tooltip, value, min = 0, max = 1, step = 0.01, onChange, displayValue }: SliderRowProps) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isDragging = useRef(false);

  // Sync from store when not dragging
  useEffect(() => {
    if (!isDragging.current) setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setLocalValue(v);
    isDragging.current = true;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(v);
      isDragging.current = false;
    }, 32);
  }, [onChange]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const display = displayValue
    ? displayValue.replace(String(value), String(localValue))
    : localValue.toFixed(2);

  // Paint an orange progress fill up to the thumb position.
  const pct = max === min ? 0 : ((localValue - min) / (max - min)) * 100;
  const trackFill = `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${pct}%, hsl(var(--secondary)) ${pct}%, hsl(var(--secondary)) 100%)`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-secondary-foreground">
          {label}
          {tooltip && <HelpTip text={tooltip} />}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleChange}
        className="halftone-slider w-full"
        style={{ background: trackFill }}
      />
    </div>
  );
}
