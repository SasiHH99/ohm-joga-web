import { clsx } from "clsx";

import {
  buildCalendarMonths,
  calendarLegend,
  getCalendarWeekdayLabels,
} from "@/lib/calendar";
import type { CalendarDay, ClassSession } from "@/lib/types";

function getTone(status: CalendarDay["status"] | null) {
  switch (status) {
    case "class-day":
      return "border-sage/60 bg-sage/28";
    case "free-day":
      return "border-sand/70 bg-sand/28";
    case "unavailable":
      return "border-clay/45 bg-clay/16";
    default:
      return "border-stone/10 bg-white/55";
  }
}

export function CalendarGrid({
  classes,
  markedDays,
  monthsToShow = 2,
}: {
  classes: ClassSession[];
  markedDays: CalendarDay[];
  monthsToShow?: number;
}) {
  const months = buildCalendarMonths({ classes, markedDays, monthsToShow });
  const weekdays = getCalendarWeekdayLabels();

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-3 text-sm text-stone">
        {calendarLegend.map((item) => (
          <span
            key={item.status}
            className={clsx("rounded-full px-4 py-2", item.className)}
          >
            {item.label}
          </span>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {months.map((month) => (
          <section key={month.label} className="card-surface rounded-[1.9rem] p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-3xl text-ink">{month.label}</h3>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-stone md:text-xs">
              {weekdays.map((weekday) => (
                <span key={`${month.label}-${weekday}`}>{weekday}</span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-2">
              {month.cells.map((cell) => (
                <div
                  key={cell.key}
                  className={clsx(
                    "min-h-[5.25rem] rounded-[1rem] border p-2.5 transition md:min-h-[5.75rem]",
                    getTone(cell.status),
                    !cell.inCurrentMonth && "opacity-35",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={clsx(
                        "text-sm font-semibold text-ink",
                        cell.isToday && "rounded-full bg-moss px-2 py-0.5 text-ivory",
                      )}
                    >
                      {cell.dayNumber}
                    </span>
                    {cell.classCount > 0 ? (
                      <span className="text-[0.68rem] uppercase tracking-[0.12em] text-moss">
                        {cell.classCount}x
                      </span>
                    ) : null}
                  </div>

                  {cell.label ? (
                    <p className="mt-2 text-[0.8rem] font-medium leading-4 text-ink md:text-sm">
                      {cell.label}
                    </p>
                  ) : null}
                  {cell.note ? (
                    <p className="mt-1 text-[0.72rem] leading-4 text-stone md:text-xs">
                      {cell.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
