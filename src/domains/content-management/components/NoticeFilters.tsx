"use client";

import { useState, useCallback } from "react";
import {
  Accordion,
  AccordionItem,
  Dropdown,
  DatePicker,
  DatePickerInput,
  Toggle,
  Button,
  Search,
  Tag,
} from "@carbon/react";
import { Filter, Reset } from "@carbon/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { getBSYearRange, getBSMonthNames } from "@/lib/calendars/bs";

interface NoticeFiltersProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  locale?: "ne" | "en";
}

export default function NoticeFilters({
  onFilterChange,
  locale = "ne",
}: NoticeFiltersProps) {
  const t = useTranslations("filters");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filter state from URL params
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    type: searchParams.get("type") || "",
    priority: searchParams.get("priority") || "",
    office: searchParams.get("office") || "",
    category: searchParams.get("category") || "",
    yearBS: searchParams.get("yearBS") || "",
    monthBS: searchParams.get("monthBS") || "",
    hasAttachment: searchParams.get("hasAttachment") === "true",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
  });

  const [calendarType, setCalendarType] = useState<"bs" | "ad">(
    searchParams.get("calendar") === "ad" ? "ad" : "bs"
  );

  const noticeTypes = [
    { label: t("noticeTypes.all"), value: "" },
    { label: t("noticeTypes.notice"), value: "notice" },
    { label: t("noticeTypes.circular"), value: "circular" },
    { label: t("noticeTypes.tender"), value: "tender" },
    { label: t("noticeTypes.vacancy"), value: "vacancy" },
    { label: t("noticeTypes.result"), value: "result" },
  ];

  const priorityLevels = [
    { label: t("priority.all"), value: "" },
    { label: t("priority.normal"), value: "normal" },
    { label: t("priority.high"), value: "high" },
    { label: t("priority.urgent"), value: "urgent" },
  ];

  const offices = [
    { label: t("offices.all"), value: "" },
    { label: t("offices.federal"), value: "federal" },
    { label: t("offices.provincial"), value: "provincial" },
    { label: t("offices.local"), value: "local" },
  ];

  const bsYears = getBSYearRange(2070, 2085).map(year => ({
    label: year.toString(),
    value: year.toString(),
  }));

  const bsMonths = getBSMonthNames(locale).map((month, index) => ({
    label: month,
    value: (index + 1).toString(),
  }));

  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);

      // Update URL params
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "") {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
      
      // Add calendar type to params
      params.set("calendar", calendarType);

      router.push(`?${params.toString()}`, { scroll: false });

      // Call external handler
      onFilterChange?.(newFilters);
    },
    [filters, searchParams, router, calendarType, onFilterChange]
  );

  const handleCalendarToggle = useCallback(() => {
    const newCalendarType = calendarType === "bs" ? "ad" : "bs";
    setCalendarType(newCalendarType);
    
    // Clear date filters when switching calendar
    setFilters(prev => ({
      ...prev,
      yearBS: "",
      monthBS: "",
      dateFrom: "",
      dateTo: "",
    }));

    const params = new URLSearchParams(searchParams.toString());
    params.set("calendar", newCalendarType);
    params.delete("yearBS");
    params.delete("monthBS");
    params.delete("dateFrom");
    params.delete("dateTo");
    
    router.push(`?${params.toString()}`, { scroll: false });
  }, [calendarType, searchParams, router]);

  const handleReset = useCallback(() => {
    const newFilters = {
      q: "",
      type: "",
      priority: "",
      office: "",
      category: "",
      yearBS: "",
      monthBS: "",
      hasAttachment: false,
      dateFrom: "",
      dateTo: "",
    };
    
    setFilters(newFilters);
    setCalendarType("bs");
    
    router.push(window.location.pathname, { scroll: false });
    onFilterChange?.(newFilters);
  }, [router, onFilterChange]);

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== "" && value !== false
    ).length;
  };

  return (
    <div className="notice-filters">
      <div className="notice-filters__header">
        <h3 className="notice-filters__title">
          <Filter size={20} />
          {t("title")}
        </h3>
        
        {getActiveFilterCount() > 0 && (
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Reset}
            onClick={handleReset}
          >
            {t("reset")} ({getActiveFilterCount()})
          </Button>
        )}
      </div>

      <div className="notice-filters__search">
        <Search
          placeholder={t("searchPlaceholder")}
          value={filters.q}
          onChange={(e) => handleFilterChange("q", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleFilterChange("q", e.target.value);
            }
          }}
        />
      </div>

      <Accordion>
        <AccordionItem title={t("basicFilters")}>
          <div className="notice-filters__group">
            <Dropdown
              id="notice-type-filter"
              titleText={t("noticeType")}
              label={t("selectNoticeType")}
              items={noticeTypes}
              itemToString={(item) => item?.label || ""}
              selectedItem={noticeTypes.find(type => type.value === filters.type)}
              onChange={({ selectedItem }) => 
                handleFilterChange("type", selectedItem?.value || "")
              }
            />

            <Dropdown
              id="priority-filter"
              titleText={t("priority.label")}
              label={t("selectPriority")}
              items={priorityLevels}
              itemToString={(item) => item?.label || ""}
              selectedItem={priorityLevels.find(level => level.value === filters.priority)}
              onChange={({ selectedItem }) => 
                handleFilterChange("priority", selectedItem?.value || "")
              }
            />

            <Dropdown
              id="office-filter"
              titleText={t("office")}
              label={t("selectOffice")}
              items={offices}
              itemToString={(item) => item?.label || ""}
              selectedItem={offices.find(office => office.value === filters.office)}
              onChange={({ selectedItem }) => 
                handleFilterChange("office", selectedItem?.value || "")
              }
            />
          </div>
        </AccordionItem>

        <AccordionItem title={t("dateFilters")}>
          <div className="notice-filters__group">
            <div className="notice-filters__calendar-toggle">
              <Toggle
                id="calendar-toggle"
                labelText={calendarType === "bs" ? t("calendar.bs") : t("calendar.ad")}
                toggled={calendarType === "ad"}
                onToggle={handleCalendarToggle}
              />
            </div>

            {calendarType === "bs" ? (
              <div className="notice-filters__bs-dates">
                <Dropdown
                  id="year-bs-filter"
                  titleText={t("year")}
                  label={t("selectYear")}
                  items={[{ label: t("selectYear"), value: "" }, ...bsYears]}
                  itemToString={(item) => item?.label || ""}
                  selectedItem={bsYears.find(year => year.value === filters.yearBS) || bsYears[0]}
                  onChange={({ selectedItem }) => 
                    handleFilterChange("yearBS", selectedItem?.value || "")
                  }
                />

                {filters.yearBS && (
                  <Dropdown
                    id="month-bs-filter"
                    titleText={t("month")}
                    label={t("selectMonth")}
                    items={[{ label: t("selectMonth"), value: "" }, ...bsMonths]}
                    itemToString={(item) => item?.label || ""}
                    selectedItem={bsMonths.find(month => month.value === filters.monthBS)}
                    onChange={({ selectedItem }) => 
                      handleFilterChange("monthBS", selectedItem?.value || "")
                    }
                  />
                )}
              </div>
            ) : (
              <div className="notice-filters__ad-dates">
                <DatePicker datePickerType="range">
                  <DatePickerInput
                    id="date-from"
                    placeholder="mm/dd/yyyy"
                    labelText={t("dateFrom")}
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  />
                  <DatePickerInput
                    id="date-to"
                    placeholder="mm/dd/yyyy"
                    labelText={t("dateTo")}
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  />
                </DatePicker>
              </div>
            )}
          </div>
        </AccordionItem>

        <AccordionItem title={t("advancedFilters")}>
          <div className="notice-filters__group">
            <Toggle
              id="attachment-filter"
              labelText={t("hasAttachment")}
              toggled={filters.hasAttachment}
              onToggle={(checked) => handleFilterChange("hasAttachment", checked)}
            />
          </div>
        </AccordionItem>
      </Accordion>

      {getActiveFilterCount() > 0 && (
        <div className="notice-filters__active">
          <h4>{t("activeFilters")}:</h4>
          <div className="notice-filters__tags">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === "" || value === false) return null;
              
              const label = typeof value === "boolean" 
                ? t(key) 
                : `${t(key)}: ${value}`;
                
              return (
                <Tag
                  key={key}
                  type="outline"
                  filter
                  onClose={() => handleFilterChange(key, "")}
                >
                  {label}
                </Tag>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .notice-filters {
          background: var(--cds-layer-01);
          border-radius: 4px;
          padding: 1rem;
        }

        .notice-filters__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .notice-filters__title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .notice-filters__search {
          margin-bottom: 1rem;
        }

        .notice-filters__group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem 0;
        }

        .notice-filters__calendar-toggle {
          margin-bottom: 0.5rem;
        }

        .notice-filters__bs-dates,
        .notice-filters__ad-dates {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .notice-filters__active {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--cds-border-subtle);
        }

        .notice-filters__active h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--cds-text-secondary);
        }

        .notice-filters__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        @media (max-width: 672px) {
          .notice-filters {
            padding: 0.75rem;
          }

          .notice-filters__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}