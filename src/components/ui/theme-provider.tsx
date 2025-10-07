"use client";

import { governmentTheme, accessibilityTheme } from "@/config/theme";
import { useUIStore } from "@/stores/ui-store";
import { useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, fontSize } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Apply theme
    root.setAttribute("data-carbon-theme", theme);

    // Apply font size
    root.setAttribute("data-font-size", fontSize);

    // Apply CSS custom properties
    const selectedTheme =
      theme === "high-contrast" ? accessibilityTheme : governmentTheme;

    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(
        `--cds-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value
      );
    });

    // Font size multipliers
    const fontSizeMultipliers = {
      small: 0.875,
      medium: 1,
      large: 1.125,
    };

    const multiplier = fontSizeMultipliers[fontSize];
    root.style.setProperty("--cds-font-size-multiplier", multiplier.toString());
  }, [theme, fontSize, mounted]);

  return <>{children}</>;
}
