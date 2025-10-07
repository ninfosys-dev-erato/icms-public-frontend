"use client";

import { HeaderGlobalAction } from "@carbon/react";
import { Language } from "@carbon/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

interface LocaleSwitcherProps {
  currentLocale: "ne" | "en";
  isInHeaderTop?: boolean;
}

export default function LocaleSwitcher({ currentLocale, isInHeaderTop = false }: LocaleSwitcherProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = currentLocale === "ne" ? "en" : "ne";
    
    // Remove current locale from pathname and add new locale
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === currentLocale) {
      segments.shift(); // Remove current locale
    }
    
    const newPath = `/${newLocale}${segments.length > 0 ? "/" + segments.join("/") : ""}`;
    
    router.push(newPath);
  };

  const getTooltipText = () => {
    return currentLocale === "ne" 
      ? "Switch to English" 
      : "नेपालीमा स्विच गर्नुहोस्";
  };

  const getDisplayText = () => {
    return currentLocale === "ne" ? "En" : "ने";
  };

  return (
    <HeaderGlobalAction
      aria-label={getTooltipText()}
      tooltipAlignment="end"
      onClick={switchLocale}
      className="locale-switcher"
    >
      <div className="locale-switcher__content">
        <Language size={16} style={{ fill: isInHeaderTop ? '#ffffff' : '#000000' }} />

        <span className="locale-switcher__text">
          {getDisplayText()}
        </span>
      </div>

      <style jsx>{`
        .locale-switcher__content {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .locale-switcher__text {
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1;
          color: ${isInHeaderTop ? '#ffffff' : 'inherit'};
        }

        :global(.locale-switcher) {
          position: relative;
        }

        :global(.locale-switcher):hover {
          background-color: var(--cds-layer-hover-01);
        }

        :global(.locale-switcher):focus {
          outline: 2px solid var(--cds-focus);
          outline-offset: -2px;
        }

        
      `}</style>
    </HeaderGlobalAction>
  );
}