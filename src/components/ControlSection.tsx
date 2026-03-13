import React from "react";
import { cn } from "@/lib/utils";

interface ControlSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ControlSection({ title, children, className }: ControlSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface SliderRowProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  displayValue?: string;
}

export function SliderRow({ label, value, min = 0, max = 1, step = 0.01, onChange, displayValue }: SliderRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary-foreground">{label}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{displayValue ?? value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="halftone-slider w-full"
      />
    </div>
  );
}
