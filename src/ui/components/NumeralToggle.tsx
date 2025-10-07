"use client";

import { useState, useEffect } from "react";

import { useTranslations } from "next-intl";

export default function NumeralToggle() {
  const t = useTranslations("common");
  const [numeralSystem, setNumeralSystem] = useState<"devanagari" | "latin">("devanagari");

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("numeralSystem");
    if (saved === "latin" || saved === "devanagari") {
      setNumeralSystem(saved);
      applyNumeralSystem(saved);
    }
  }, []);

  const toggleNumeralSystem = () => {
    const newSystem = numeralSystem === "devanagari" ? "latin" : "devanagari";
    setNumeralSystem(newSystem);
    localStorage.setItem("numeralSystem", newSystem);
    applyNumeralSystem(newSystem);
  };

  const applyNumeralSystem = (system: "devanagari" | "latin") => {
    // Apply CSS class to document root to handle numeral conversion
    document.documentElement.setAttribute("data-numeral-system", system);
    
    // Dispatch custom event for components that need to react to numeral changes
    window.dispatchEvent(new CustomEvent("numeralSystemChange", { 
      detail: { system } 
    }));
  };

  const getTooltipText = () => {
    return numeralSystem === "devanagari" 
      ? t("switchToLatinNumerals") 
      : t("switchToDevanagariNumerals");
  };

  const getDisplayText = () => {
    return numeralSystem === "devanagari" ? "123" : "१२३";
  };

  return (
    <button
      aria-label={getTooltipText()}
      onClick={toggleNumeralSystem}
      className="numeral-toggle"
      style={{
        background: 'none',
        border: 'none',
        padding: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        color: 'inherit',
        borderRadius: '4px'
      }}
    >
      <div className="numeral-toggle__content">
        <span style={{ fontSize: '16px' }}>🔢</span>
        <span className="numeral-toggle__text">
          {getDisplayText()}
        </span>
      </div>

      <style jsx>{`
        .numeral-toggle__content {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .numeral-toggle__text {
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1;
          font-family: 'Noto Sans Devanagari', 'IBM Plex Sans', sans-serif;
        }

        :global(.numeral-toggle) {
          position: relative;
        }

        :global(.numeral-toggle):hover {
          background-color: var(--cds-layer-hover-01);
        }

        :global(.numeral-toggle):focus {
          outline: 2px solid var(--cds-focus);
          outline-offset: -2px;
        }

        /* Global styles for numeral conversion */
        :global([data-numeral-system="latin"] .nepali-numeral) {
          font-feature-settings: "lnum" 1;
        }

        :global([data-numeral-system="devanagari"] .nepali-numeral) {
          font-feature-settings: "lnum" 0;
        }

        /* Auto-convert numbers in certain contexts */
        :global([data-numeral-system="devanagari"] .auto-convert-numerals) {
          font-feature-settings: "lnum" 0;
        }

        :global([data-numeral-system="latin"] .auto-convert-numerals) {
          font-feature-settings: "lnum" 1;
        }
      `}      </style>
    </button>
  );
}