// SubtitleOverlay.tsx
import { cn } from "@/lib/utils";
import { useSubtitleCue } from "./useSubtitleCue ";
import { useSettingsStore } from "@/zustand/settings-store";

const fontSizeMap: Record<string, string> = {
  small: "text-[clamp(1.125rem,1.5vw,1.875rem)]", // 18px → 30px
  medium: "text-[clamp(1.375rem,2vw,2.5rem)]", // 22px → 40px
  large: "text-[clamp(1.75rem,2.5vw,3rem)]", // 28px → 48px
  "x-large": "text-[clamp(2.25rem,3.2vw,3.75rem)]", // 36px → 60px
};

const bgOpacityMap: Record<string, string> = {
  off: "bg-transparent",
  low: "bg-black/30",
  medium: "bg-black/60",
  high: "bg-black/90",
};

const fontColorMap: Record<string, string> = {
  white: "#FFFFFF",
  yellow: "#FDE047",
  green: "#4ADE80",
  cyan: "#22D3EE",
  red: "#F87171",
  blue: "#60A5FA",
  pink: "#F472B6",
  orange: "#FB923C",
};

export default function SubtitleOverlay({
  subtitleUrl,
  currentTime,
  position = "bottom",
  isVisible,
  domain,
}: {
  subtitleUrl: string | null;
  currentTime: number;
  position?: "top" | "bottom";
  isVisible: boolean;
  domain: string;
}) {
  const fontSize = useSettingsStore(
    (state) => state.values["Font size"]?.id ?? "medium",
  );
  const syncOffset = useSettingsStore(
    (state) => state.values["Sync offset"]?.id ?? "0.0s",
  );
  const fontColor = useSettingsStore(
    (state) => state.values["Font color"]?.id ?? "white",
  );
  const bgOpacity = useSettingsStore(
    (state) => state.values["Background opacity"]?.id ?? "off",
  );

  const offset = parseFloat(syncOffset);
  const adjustedTime = currentTime + offset;
  const cue = useSubtitleCue(subtitleUrl, adjustedTime, domain);

  if (!cue) return null;

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 z-10",
        "text-center",
        "px-3 landscape:px-1.5 py-1",
        "rounded md:font-semibold font-medium",
        "lg:max-w-[80%] max-w-[98%]",
        "pointer-events-none",
        "landscape:text-[0.6rem]",
        "transition duration-300 delay-100",
        "text-[clamp(1.5rem,2.3vw,2rem)]",
        "[text-shadow:0_2px_4px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.6)]",
        fontSizeMap[fontSize] ?? fontSizeMap["medium"],
        bgOpacityMap[bgOpacity] ?? bgOpacityMap["medium"],
        position === "bottom"
          ? isVisible
            ? "bottom-24 md:bottom-20 lg:bottom-28 landscape:bottom-16"
            : "bottom-8 md:bottom-8 lg:bottom-12 landscape:bottom-4"
          : isVisible
            ? "top-16 md:top-20 lg:top-24"
            : "top-6 md:top-8 lg:top-10",
      )}
      style={{
        color: fontColorMap[fontColor] ?? fontColorMap["white"],
      }}
      dangerouslySetInnerHTML={{ __html: cue }}
    />
  );
}
