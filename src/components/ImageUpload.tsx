import { useCallback, useRef, useState } from "react";
import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection } from "./ControlSection";
import { Upload, X, Replace } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function ImageUpload() {
  const { config: imageConfig, setSourceImage, removeSourceImage } = useHalftoneStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Unsupported format. Use PNG, JPG, or WebP.");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError("Image too large. Max 20 MB.");
        return;
      }

      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setSourceImage(url, img.naturalWidth, img.naturalHeight);
      };
      img.onerror = () => {
        setError("Failed to load image.");
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [setSourceImage]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  if (imageConfig.sourceImageUrl) {
    return (
      <ControlSection title="Source Image">
        <div className="relative overflow-hidden rounded-md border border-border bg-secondary">
          <img
            src={imageConfig.sourceImageUrl}
            alt="Source"
            className="h-24 w-full object-contain bg-secondary"
          />
          <div className="absolute right-1 top-1 flex gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded bg-background/80 p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Replace image"
            >
              <Replace className="h-3 w-3" />
            </button>
            <button
              onClick={removeSourceImage}
              className="rounded bg-background/80 p-1 text-muted-foreground hover:text-destructive transition-colors"
              title="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="text-[10px] text-muted-foreground">
          {imageConfig.sourceImageWidth} × {imageConfig.sourceImageHeight}px
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={onFileSelect}
        />
      </ControlSection>
    );
  }

  return (
    <ControlSection title="Source Image">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground text-center">
          Upload an image to generate<br />a halftone from its tones
        </span>
        <span className="text-[10px] text-muted-foreground/60">
          PNG, JPG, WebP
        </span>
      </div>
      {error && (
        <p className="text-[10px] text-destructive">{error}</p>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={onFileSelect}
      />
    </ControlSection>
  );
}
