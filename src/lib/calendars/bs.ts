/**
 * Bikram Sambat (BS) Calendar Utilities
 * Simple utilities for handling Nepali calendar dates
 */

export interface BSDate {
  year: number;
  month: number;
  day: number;
}

/**
 * Parse a BS date string in format "YYYY-MM-DD" or "YYYY/MM/DD"
 */
export function parseBSDate(dateString: string): BSDate | null {
  if (!dateString) return null;
  
  const parts = dateString.split(/[-/]/).map(part => parseInt(part.trim(), 10));
  
  if (parts.length !== 3 || parts.some(isNaN)) {
    return null;
  }
  
  const [year, month, day] = parts;
  
  // Basic validation for BS dates
  if (year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 32) {
    return null;
  }
  
  return { year, month, day };
}

/**
 * Format a BS date object to a readable string
 */
export function formatBSDate(
  date: BSDate, 
  script: 'nepali' | 'english' = 'nepali', 
  includeName: boolean = false
): string {
  if (!date) return '';
  
  const nepaliMonthNames = [
    'बैशाख', 'जेठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
    'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत्र'
  ];
  
  const englishMonthNames = [
    'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];
  
  const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  
  function toNepaliNumerals(num: number): string {
    return num.toString().split('').map(digit => nepaliNumerals[parseInt(digit)]).join('');
  }
  
  const monthNames = script === 'nepali' ? nepaliMonthNames : englishMonthNames;
  const monthName = monthNames[date.month - 1] || date.month.toString();
  
  if (script === 'nepali') {
    const year = toNepaliNumerals(date.year);
    const day = toNepaliNumerals(date.day);
    
    if (includeName) {
      return `${monthName} ${day}, ${year}`;
    }
    return `${year}-${toNepaliNumerals(date.month).padStart(2, '०')}-${day.padStart(2, '०')}`;
  } else {
    if (includeName) {
      return `${monthName} ${date.day}, ${date.year}`;
    }
    return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
  }
}

/**
 * Get current BS date (approximate conversion from Gregorian)
 * Note: This is a simplified conversion and may not be 100% accurate
 */
export function getCurrentBSDate(): BSDate {
  const adDate = new Date();
  const adYear = adDate.getFullYear();
  const adMonth = adDate.getMonth() + 1; // JS months are 0-indexed
  const adDay = adDate.getDate();
  
  // Approximate conversion (BS is typically 56-57 years ahead of AD)
  // This is a simplified conversion and should be replaced with a proper conversion library
  let bsYear = adYear + 57;
  let bsMonth = adMonth + 8;
  let bsDay = adDay;
  
  if (bsMonth > 12) {
    bsMonth -= 12;
    bsYear += 1;
  }
  
  // Adjust for mid-April start of BS year
  if (adMonth < 4 || (adMonth === 4 && adDay < 14)) {
    bsYear -= 1;
  }
  
  return { year: bsYear, month: bsMonth, day: bsDay };
}

/**
 * Convert a Gregorian date to approximate BS date
 * Note: This is a simplified conversion
 */
export function adToBs(adDate: Date): BSDate {
  // This is a simplified conversion
  // In a real application, you would use a proper conversion library
  const adYear = adDate.getFullYear();
  const adMonth = adDate.getMonth() + 1;
  const adDay = adDate.getDate();
  
  let bsYear = adYear + 57;
  let bsMonth = adMonth + 8;
  let bsDay = adDay;
  
  if (bsMonth > 12) {
    bsMonth -= 12;
    bsYear += 1;
  }
  
  if (adMonth < 4 || (adMonth === 4 && adDay < 14)) {
    bsYear -= 1;
  }
  
  return { year: bsYear, month: bsMonth, day: bsDay };
}

/**
 * Validate if a BS date is valid
 */
export function isValidBSDate(date: BSDate): boolean {
  if (!date) return false;
  
  const { year, month, day } = date;
  
  // Basic validation
  if (year < 2000 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 32) return false;
  
  // More specific validation based on BS calendar rules could be added here
  
  return true;
}

/**
 * Convert Nepali numerals to Latin numerals
 */
export function convertNepaliNumeralsToLatin(nepaliText: string): string {
  const nepaliToLatin: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  
  return nepaliText.replace(/[०-९]/g, (match) => nepaliToLatin[match] || match);
}

/**
 * Convert Latin numerals to Nepali numerals
 */
export function convertLatinToNepaliNumerals(latinText: string): string {
  const latinToNepali: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  
  return latinText.replace(/[0-9]/g, (match) => latinToNepali[match] || match);
}

/**
 * Get a range of BS years
 */
export function getBSYearRange(startYear: number, endYear: number): number[] {
  const years: number[] = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
}

/**
 * Get BS month names in the specified locale
 */
export function getBSMonthNames(locale: 'en' | 'ne'): string[] {
  if (locale === 'ne') {
    return [
      'बैशाख', 'जेठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
      'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत्र'
    ];
  } else {
    return [
      'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
      'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
    ];
  }
}