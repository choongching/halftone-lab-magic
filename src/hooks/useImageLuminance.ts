import { useState, useEffect, useRef } from "react";
import type { ImageConfig } from "@/types/halftone";
import type { LuminanceMap } from "@/engine/imageSampler";
import { loadImage, rasterizeImage, extractLuminanceMap } from "@/engine/imageSampler";

/**
 * Hook that loads the source image and computes a luminance map
 * whenever the image URL or tone-mapping controls change.
 */
export function useImageLuminance(config: ImageConfig): LuminanceMap | null {
  const [lumaMap, setLumaMap] = useState<LuminanceMap | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!config.sourceImageUrl) {
      setLumaMap(null);
      imgRef.current = null;
      prevUrlRef.current = null;
      return;
    }

    let cancelled = false;

    const process = async () => {
      // Only reload image if URL changed
      if (config.sourceImageUrl !== prevUrlRef.current) {
        try {
          const img = await loadImage(config.sourceImageUrl!);
          if (cancelled) return;
          imgRef.current = img;
          prevUrlRef.current = config.sourceImageUrl;
        } catch {
          if (!cancelled) setLumaMap(null);
          return;
        }
      }

      if (!imgRef.current || cancelled) return;

      const canvas = rasterizeImage(imgRef.current, config);
      const map = extractLuminanceMap(canvas, config);
      if (!cancelled) setLumaMap(map);
    };

    process();

    return () => {
      cancelled = true;
    };
  }, [
    config.sourceImageUrl,
    config.width,
    config.height,
    config.padding,
    config.fitMode,
    config.brightness,
    config.contrast,
    config.threshold,
    config.invert,
    config.gamma,
  ]);

  return lumaMap;
}
