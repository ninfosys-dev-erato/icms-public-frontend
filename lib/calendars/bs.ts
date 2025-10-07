// Bikram Sambat (BS) calendar conversion utilities
// Basic conversion functions - for production, consider using a more comprehensive library

interface BSDate {
  year: number;
  month: number;
  day: number;
}

interface ADDate {
  year: number;
  month: number;
  day: number;
}

// Basic BS-AD conversion reference data (simplified)
// In production, use a comprehensive calendar library like nepali-date
const BS_MONTHS = [
  "बैशाख", "जेठ", "आषाढ", "श्रावण", "भाद्र", "आश्विन",
  "कार्तिक", "मंसिर", "पौष", "माघ", "फाल्गुन", "चैत्र"
];

const BS_MONTHS_EN = [
  "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const WEEKDAYS_NE = ["आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहिबार", "शुक्रबार", "शनिबार"];
const WEEKDAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Basic reference point for conversion (approximation)
const BS_EPOCH = { year: 2000, month: 1, day: 1 }; // 2000/01/01 BS
const AD_EPOCH = { year: 1943, month: 4, day: 14 }; // 1943/04/14 AD

export function parseBSDate(bsDateString: string): BSDate | null {
  // Parse formats: "2082-04-01", "2082/04/01", "२०८२-०४-०१"
  const cleaned = convertNepaliNumeralsToLatin(bsDateString);
  const match = cleaned.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  
  if (!match) return null;
  
  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    day: parseInt(match[3], 10),
  };
}

export function formatBSDate(date: BSDate, format: "nepali" | "english" = "nepali", includeWeekday = false): string {
  const { year, month, day } = date;
  
  if (format === "nepali") {
    const nepaliYear = convertLatinNumeralsToNepali(year.toString());
    const nepaliMonth = convertLatinNumeralsToNepali(month.toString().padStart(2, "0"));
    const nepaliDay = convertLatinNumeralsToNepali(day.toString().padStart(2, "0"));
    
    let formatted = `${nepaliYear}-${nepaliMonth}-${nepaliDay}`;
    
    if (includeWeekday) {
      const weekday = getWeekdayBS(date);
      formatted = `${weekday}, ${formatted}`;
    }
    
    return formatted;
  } else {
    let formatted = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    
    if (includeWeekday) {
      const weekday = getWeekdayBS(date, "en");
      formatted = `${weekday}, ${formatted}`;
    }
    
    return formatted;
  }
}

export function formatBSDateLong(date: BSDate, locale: "ne" | "en" = "ne"): string {
  const { year, month, day } = date;
  
  if (locale === "ne") {
    const monthName = BS_MONTHS[month - 1];
    const nepaliYear = convertLatinNumeralsToNepali(year.toString());
    const nepaliDay = convertLatinNumeralsToNepali(day.toString());
    return `${nepaliDay} ${monthName} ${nepaliYear}`;
  } else {
    const monthName = BS_MONTHS_EN[month - 1];
    return `${day} ${monthName} ${year}`;
  }
}

export function getCurrentBSDate(): BSDate {
  // Simplified conversion from current AD date to BS
  const now = new Date();
  return adToBS({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}

export function adToBS(adDate: ADDate): BSDate {
  // Simplified conversion - in production, use a proper calendar library
  // This is a basic approximation and should be replaced with accurate conversion
  const daysDiff = daysBetweenAD(AD_EPOCH, adDate);
  return addDaysToBS(BS_EPOCH, daysDiff);
}

export function bsToAD(bsDate: BSDate): ADDate {
  // Simplified conversion - in production, use a proper calendar library
  const daysDiff = daysBetweenBS(BS_EPOCH, bsDate);
  return addDaysToAD(AD_EPOCH, daysDiff);
}

export function getWeekdayBS(bsDate: BSDate, locale: "ne" | "en" = "ne"): string {
  const adDate = bsToAD(bsDate);
  const jsDate = new Date(adDate.year, adDate.month - 1, adDate.day);
  const weekdayIndex = jsDate.getDay();
  
  return locale === "ne" ? WEEKDAYS_NE[weekdayIndex] : WEEKDAYS_EN[weekdayIndex];
}

export function getBSMonthName(month: number, locale: "ne" | "en" = "ne"): string {
  return locale === "ne" ? BS_MONTHS[month - 1] : BS_MONTHS_EN[month - 1];
}

export function getBSMonthNames(locale: "ne" | "en" = "ne"): string[] {
  return locale === "ne" ? [...BS_MONTHS] : [...BS_MONTHS_EN];
}

export function isValidBSDate(date: BSDate): boolean {
  const { year, month, day } = date;
  
  if (year < 1900 || year > 2200) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;
  
  // Simplified day validation - in production, use accurate month lengths
  const maxDays = month <= 8 ? 32 : (month === 12 ? 30 : 31);
  return day <= maxDays;
}

export function convertNepaliNumeralsToLatin(text: string): string {
  const nepaliToLatin: Record<string, string> = {
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
    "५": "5", "६": "6", "७": "7", "८": "8", "९": "9"
  };
  
  return text.replace(/[०-९]/g, (match) => nepaliToLatin[match] || match);
}

export function convertLatinNumeralsToNepali(text: string): string {
  const latinToNepali: Record<string, string> = {
    "0": "०", "1": "१", "2": "२", "3": "३", "4": "४",
    "5": "५", "6": "६", "7": "७", "8": "८", "9": "९"
  };
  
  return text.replace(/[0-9]/g, (match) => latinToNepali[match] || match);
}

export function getBSYearRange(startYear?: number, endYear?: number): number[] {
  const start = startYear || 2070;
  const end = endYear || getCurrentBSDate().year + 1;
  
  const years: number[] = [];
  for (let year = start; year <= end; year++) {
    years.push(year);
  }
  
  return years;
}

export function compareBSDates(date1: BSDate, date2: BSDate): number {
  if (date1.year !== date2.year) return date1.year - date2.year;
  if (date1.month !== date2.month) return date1.month - date2.month;
  return date1.day - date2.day;
}

export function addDaysToBS(bsDate: BSDate, days: number): BSDate {
  // Simplified addition - in production, use proper calendar calculations
  const adDate = bsToAD(bsDate);
  const newAdDate = addDaysToAD(adDate, days);
  return adToBS(newAdDate);
}

function addDaysToAD(adDate: ADDate, days: number): ADDate {
  const jsDate = new Date(adDate.year, adDate.month - 1, adDate.day);
  jsDate.setDate(jsDate.getDate() + days);
  
  return {
    year: jsDate.getFullYear(),
    month: jsDate.getMonth() + 1,
    day: jsDate.getDate(),
  };
}

function daysBetweenAD(date1: ADDate, date2: ADDate): number {
  const jsDate1 = new Date(date1.year, date1.month - 1, date1.day);
  const jsDate2 = new Date(date2.year, date2.month - 1, date2.day);
  
  const diffTime = jsDate2.getTime() - jsDate1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function daysBetweenBS(date1: BSDate, date2: BSDate): number {
  // Simplified calculation - in production, use proper BS calendar logic
  const ad1 = bsToAD(date1);
  const ad2 = bsToAD(date2);
  return daysBetweenAD(ad1, ad2);
}