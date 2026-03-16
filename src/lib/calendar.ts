import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { formatCalendarMonthLabel, formatWeekdayShort, toStudioDateKey } from "@/lib/format";
import type { CalendarDay, ClassSession } from "@/lib/types";

export type CalendarCell = {
  key: string;
  dayNumber: string;
  inCurrentMonth: boolean;
  isToday: boolean;
  classCount: number;
  status: CalendarDay["status"] | null;
  label: string;
  note: string;
};

export type CalendarMonth = {
  label: string;
  cells: CalendarCell[];
};

export const calendarLegend = [
  { status: "class-day", label: "Órával jelölt nap", className: "bg-sage/45 text-moss" },
  { status: "free-day", label: "Szabadnap", className: "bg-sand/45 text-ink" },
  { status: "unavailable", label: "Szünet / nem elérhető", className: "bg-clay/30 text-ink" },
] as const;

export function getCalendarWeekdayLabels() {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });

  return Array.from({ length: 7 }, (_, index) =>
    formatWeekdayShort(addDays(monday, index)),
  );
}

export function buildCalendarMonths({
  classes,
  markedDays,
  monthsToShow = 2,
  startDate = new Date(),
}: {
  classes: ClassSession[];
  markedDays: CalendarDay[];
  monthsToShow?: number;
  startDate?: Date;
}) {
  const classCountByDay = new Map<string, number>();
  const markedDaysByKey = new Map(markedDays.map((item) => [item.day, item]));

  classes
    .filter((item) => item.status === "scheduled")
    .forEach((item) => {
      const key = toStudioDateKey(item.startsAt);
      classCountByDay.set(key, (classCountByDay.get(key) ?? 0) + 1);
    });

  return Array.from({ length: monthsToShow }, (_, monthIndex) => {
    const monthDate = addMonths(startOfMonth(startDate), monthIndex);
    const gridStart = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });

    const cells = eachDayOfInterval({ start: gridStart, end: gridEnd }).map((day) => {
      const key = toStudioDateKey(day);
      const markedDay = markedDaysByKey.get(key);
      const classCount = classCountByDay.get(key) ?? 0;
      const status = markedDay?.status ?? (classCount > 0 ? "class-day" : null);
      const label =
        markedDay?.label ||
        (markedDay?.status === "free-day"
          ? "Szabadnap"
          : markedDay?.status === "unavailable"
            ? "Szünet"
            : classCount > 0
              ? `${classCount} óra`
              : "");

      return {
        key,
        dayNumber: String(day.getDate()),
        inCurrentMonth: isSameMonth(day, monthDate),
        isToday: isToday(day),
        classCount,
        status,
        label,
        note: markedDay?.note ?? "",
      } satisfies CalendarCell;
    });

    return {
      label: formatCalendarMonthLabel(monthDate),
      cells,
    } satisfies CalendarMonth;
  });
}
