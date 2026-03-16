import { format, isSameDay, parseISO } from "date-fns";
import { hu } from "date-fns/locale";

export function formatHungarianDate(
  date: string | Date,
  pattern = "yyyy. MMMM d.",
) {
  const safeDate = typeof date === "string" ? parseISO(date) : date;
  return format(safeDate, pattern, { locale: hu });
}

export function formatHungarianDateTime(date: string | Date) {
  const safeDate = typeof date === "string" ? parseISO(date) : date;
  return format(safeDate, "yyyy. MMMM d. HH:mm", { locale: hu });
}

export function formatTime(date: string | Date) {
  const safeDate = typeof date === "string" ? parseISO(date) : date;
  return format(safeDate, "HH:mm", { locale: hu });
}

export function formatDateRange(start: string, end: string) {
  const startDate = parseISO(start);
  const endDate = parseISO(end);

  if (isSameDay(startDate, endDate)) {
    return `${formatHungarianDate(startDate)} • ${formatTime(startDate)}-${formatTime(endDate)}`;
  }

  return `${formatHungarianDateTime(startDate)} - ${formatHungarianDateTime(endDate)}`;
}

export function minutesToDurationLabel(minutes: number) {
  if (minutes >= 60 && minutes % 60 === 0) {
    return `${minutes / 60} óra`;
  }

  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return `${hours} óra ${remainder} perc`;
  }

  return `${minutes} perc`;
}
