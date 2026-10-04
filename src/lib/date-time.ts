import {
  isSameMonth as dateFnsIsSameMonth,
  isSameWeek as dateFnsIsSameWeek,
  isValid,
} from "date-fns";
import {
  formatInTimeZone,
  fromZonedTime,
  toZonedTime,
  type FormatOptionsWithTZ,
} from "date-fns-tz";

export const INDIAN_TIME_ZONE = "Asia/Kolkata";

export * from "date-fns";

export function format(
  date: Date | string | number,
  formatString: string,
  options?: FormatOptionsWithTZ,
) {
  return formatInTimeZone(date, INDIAN_TIME_ZONE, formatString, options);
}

export function isToday(date: Date | string | number) {
  return formatInTimeZone(date, INDIAN_TIME_ZONE, "yyyy-MM-dd") ===
    formatInTimeZone(new Date(), INDIAN_TIME_ZONE, "yyyy-MM-dd");
}

export function isThisWeek(date: Date | string | number) {
  return dateFnsIsSameWeek(
    toZonedTime(date, INDIAN_TIME_ZONE),
    toZonedTime(new Date(), INDIAN_TIME_ZONE),
  );
}

export function isThisMonth(date: Date | string | number) {
  return dateFnsIsSameMonth(
    toZonedTime(date, INDIAN_TIME_ZONE),
    toZonedTime(new Date(), INDIAN_TIME_ZONE),
  );
}

export function parseDateTimeLocalInIST(value: string) {
  const date = fromZonedTime(value, INDIAN_TIME_ZONE);
  if (!isValid(date)) {
    throw new RangeError("Invalid date-time value.");
  }
  return date;
}
