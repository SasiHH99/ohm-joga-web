import { env } from "@/lib/env";

function toDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

function capitalize(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toLocaleUpperCase("hu-HU") + value.slice(1);
}

function getParts(date: string | Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: env.studioTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(toDate(date));

  return {
    year: Number(parts.find((part) => part.type === "year")?.value ?? "1970"),
    month: Number(parts.find((part) => part.type === "month")?.value ?? "01"),
    day: Number(parts.find((part) => part.type === "day")?.value ?? "01"),
    hour: Number(parts.find((part) => part.type === "hour")?.value ?? "00"),
    minute: Number(parts.find((part) => part.type === "minute")?.value ?? "00"),
  };
}

function toUtcLikeTimestamp(parts: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}) {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
}

export function toStudioDateKey(date: string | Date) {
  const parts = getParts(date);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function formatHungarianDate(date: string | Date) {
  return capitalize(
    new Intl.DateTimeFormat("hu-HU", {
      timeZone: env.studioTimezone,
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(toDate(date)),
  );
}

export function formatHungarianDateTime(date: string | Date) {
  return capitalize(
    new Intl.DateTimeFormat("hu-HU", {
      timeZone: env.studioTimezone,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(toDate(date)),
  );
}

export function formatTime(date: string | Date) {
  return new Intl.DateTimeFormat("hu-HU", {
    timeZone: env.studioTimezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(toDate(date));
}

export function formatWeekdayLong(date: string | Date) {
  return capitalize(
    new Intl.DateTimeFormat("hu-HU", {
      timeZone: env.studioTimezone,
      weekday: "long",
    }).format(toDate(date)),
  );
}

export function formatWeekdayShort(date: string | Date) {
  return capitalize(
    new Intl.DateTimeFormat("hu-HU", {
      timeZone: env.studioTimezone,
      weekday: "short",
    })
      .format(toDate(date))
      .replace(".", ""),
  );
}

export function formatCalendarMonthLabel(date: string | Date) {
  return capitalize(
    new Intl.DateTimeFormat("hu-HU", {
      timeZone: env.studioTimezone,
      month: "long",
      year: "numeric",
    }).format(toDate(date)),
  );
}

export function formatDateRange(start: string, end: string) {
  if (toStudioDateKey(start) === toStudioDateKey(end)) {
    return `${formatHungarianDate(start)} • ${formatTime(start)}-${formatTime(end)}`;
  }

  return `${formatHungarianDateTime(start)} - ${formatHungarianDateTime(end)}`;
}

export function toStudioDateTimeLocalInput(date: string | Date) {
  const parts = getParts(date);

  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

export function studioLocalDateTimeToIso(localDateTime: string) {
  const [datePart, timePart = "00:00"] = localDateTime.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const targetParts = { year, month, day, hour, minute };
  let timestamp = toUtcLikeTimestamp(targetParts);

  for (let index = 0; index < 3; index += 1) {
    const zonedParts = getParts(new Date(timestamp));
    const difference = toUtcLikeTimestamp(targetParts) - toUtcLikeTimestamp(zonedParts);

    if (difference === 0) {
      break;
    }

    timestamp += difference;
  }

  return new Date(timestamp).toISOString();
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
