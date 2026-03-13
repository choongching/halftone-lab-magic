import React, { useState, useEffect, useRef, useCallback } from "react";
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

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary-foreground">{label}</span>
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
      />
    </div>
  );
}
