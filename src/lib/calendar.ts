import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import {
  formatCalendarMonthLabel,
  formatTime,
  toStudioDateKey,
} from "@/lib/format";
import type { CalendarCellItem, CalendarDay, ClassSession } from "@/lib/types";

export type CalendarCell = {
  key: string;
  dayNumber: string;
  inCurrentMonth: boolean;
  isToday: boolean;
  classCount: number;
  status: CalendarDay["status"] | null;
  label: string;
  note: string;
  items: CalendarCellItem[];
};

export type CalendarMonth = {
  label: string;
  cells: CalendarCell[];
};

export const calendarLegend = [
  { status: "class-day", label: "Órával jelölt nap", className: "bg-sage/55 text-moss" },
  { status: "free-day", label: "Szabadnap", className: "bg-sand/55 text-ink" },
  { status: "unavailable", label: "Szünet / nem elérhető", className: "bg-clay/40 text-ink" },
] as const;

export function getCalendarWeekdayLabels() {
  return ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
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
  const classesByDay = new Map<string, ClassSession[]>();
  const markedDaysByKey = new Map(markedDays.map((item) => [item.day, item]));

  classes
    .filter((item) => item.status === "scheduled")
    .forEach((item) => {
      const key = toStudioDateKey(item.startsAt);
      classesByDay.set(key, [...(classesByDay.get(key) ?? []), item]);
    });

  return Array.from({ length: monthsToShow }, (_, monthIndex) => {
    const monthDate = addMonths(startOfMonth(startDate), monthIndex);
    const gridStart = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });

    const cells = eachDayOfInterval({ start: gridStart, end: gridEnd }).map((day) => {
      const key = toStudioDateKey(day);
      const markedDay = markedDaysByKey.get(key);
      const classesOnDay = classesByDay.get(key) ?? [];
      const classCount = classesOnDay.length;
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

      const items: CalendarCellItem[] = [
        ...classesOnDay.map((item) => ({
          id: item.id,
          kind: "class" as const,
          title: item.title,
          timeLabel: `${formatTime(item.startsAt)}-${formatTime(item.endsAt)}`,
          location: item.locationName,
          note: item.description,
        })),
      ];

      if (markedDay) {
        items.push({
          id: markedDay.id,
          kind: markedDay.status,
          title:
            markedDay.label ||
            (markedDay.status === "free-day"
              ? "Szabadnap"
              : markedDay.status === "unavailable"
                ? "Szünet / nem elérhető"
                : "Jelölt nap"),
          timeLabel: "",
          location: "",
          note: markedDay.note,
        });
      }

      return {
        key,
        dayNumber: String(day.getDate()),
        inCurrentMonth: isSameMonth(day, monthDate),
        isToday: isToday(day),
        classCount,
        status,
        label,
        note: markedDay?.note ?? "",
        items,
      } satisfies CalendarCell;
    });

    return {
      label: formatCalendarMonthLabel(monthDate),
      cells,
    } satisfies CalendarMonth;
  });
}

export function findCalendarCell(months: CalendarMonth[], key: string | null | undefined) {
  if (!key) {
    return null;
  }

  for (const month of months) {
    const match = month.cells.find((cell) => cell.key === key);
    if (match) {
      return match;
    }
  }

  return null;
}

export function findDefaultCalendarKey(months: CalendarMonth[]) {
  const firstWithItems = months.flatMap((month) => month.cells).find((cell) => cell.items.length > 0);

  if (firstWithItems) {
    return firstWithItems.key;
  }

  const todayCell = months.flatMap((month) => month.cells).find((cell) => cell.isToday);
  return todayCell?.key ?? months[0]?.cells[0]?.key ?? "";
}
