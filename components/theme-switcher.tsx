"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { id: "light", icon: Sun, label: "Daylight mode" },
  { id: "dark", icon: Moon, label: "Night mode" },
  { id: "pink", icon: Flower2, label: "Pink mode" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 4, top: 4, width: 32, height: 32 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update indicator position and dimensions dynamically based on active button
  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    
    const activeIndex = themes.findIndex(t => t.id === theme);
    if (activeIndex !== -1) {
      const buttons = containerRef.current.querySelectorAll("button");
      const activeButton = buttons[activeIndex];
      if (activeButton) {
        setIndicatorStyle({
          left: activeButton.offsetLeft,
          top: activeButton.offsetTop,
          width: activeButton.offsetWidth,
          height: activeButton.offsetHeight,
        });
        return;
      }
      // Fallback
      setIndicatorStyle({ left: 4 + activeIndex * 36, top: 4, width: 32, height: 32 });
    }
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-full bg-secondary/50 p-1">
        <div className="h-8 w-8 rounded-full" />
        <div className="h-8 w-8 rounded-full" />
        <div className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center gap-1 rounded-full bg-secondary/50 p-1 backdrop-blur-sm transition-colors duration-500"
    >
      {/* Animated indicator */}
      <span 
        className="absolute rounded-full bg-background shadow-sm transition-all duration-300 ease-out"
        style={{ 
          left: indicatorStyle.left,
          top: indicatorStyle.top,
          width: indicatorStyle.width,
          height: indicatorStyle.height,
        }}
      />
      
      {themes.map((themeOption) => {
        const IconComponent = themeOption.icon;
        return (
          <button
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className={cn(
              "no-touch-target min-h-0 min-w-0 relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
              theme === themeOption.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={themeOption.label}
          >
            <IconComponent className={cn(
              "h-4 w-4 transition-transform duration-300",
              theme === themeOption.id && "scale-110"
            )} />
          </button>
        );
      })}
    </div>
  );
}
