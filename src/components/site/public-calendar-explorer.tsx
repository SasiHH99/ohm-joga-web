"use client";

import { clsx } from "clsx";
import { useState } from "react";

import {
  buildCalendarMonths,
  calendarLegend,
  findCalendarCell,
  findDefaultCalendarKey,
  getCalendarWeekdayLabels,
} from "@/lib/calendar";
import { formatHungarianDate } from "@/lib/format";
import type { CalendarDay, ClassSession } from "@/lib/types";

function getTone(status: CalendarDay["status"] | null) {
  switch (status) {
    case "class-day":
      return "border-sage/75 bg-sage/50";
    case "free-day":
      return "border-sand/80 bg-sand/40";
    case "unavailable":
      return "border-clay/55 bg-clay/25";
    default:
      return "border-stone/10 bg-white/60";
  }
}

function getLegendLabel(status: CalendarDay["status"] | null) {
  switch (status) {
    case "class-day":
      return "Órával jelölt nap";
    case "free-day":
      return "Szabadnap";
    case "unavailable":
      return "Szünet / nem elérhető";
    default:
      return "Nincs jelölés";
  }
}

export function PublicCalendarExplorer({
  classes,
  markedDays,
}: {
  classes: ClassSession[];
  markedDays: CalendarDay[];
}) {
  const months = buildCalendarMonths({ classes, markedDays });
  const weekdays = getCalendarWeekdayLabels();
  const [selectedKey, setSelectedKey] = useState(() => findDefaultCalendarKey(months));
  const selectedCell = findCalendarCell(months, selectedKey) ?? months[0]?.cells[0] ?? null;

  if (!selectedCell) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-3 text-sm text-stone">
        {calendarLegend.map((item) => (
          <span key={item.status} className={clsx("rounded-full px-4 py-2", item.className)}>
            {item.label}
          </span>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6 xl:grid-cols-2">
          {months.map((month) => (
            <section key={month.label} className="card-surface rounded-[1.9rem] p-5">
              <h3 className="font-display text-3xl text-ink">{month.label}</h3>

              <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-stone md:text-xs">
                {weekdays.map((weekday) => (
                  <span key={`${month.label}-${weekday}`}>{weekday}</span>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-7 gap-2">
                {month.cells.map((cell) => (
                  <button
                    key={cell.key}
                    type="button"
                    onMouseEnter={() => setSelectedKey(cell.key)}
                    onFocus={() => setSelectedKey(cell.key)}
                    onClick={() => setSelectedKey(cell.key)}
                    className={clsx(
                      "min-h-[5.1rem] rounded-[1rem] border p-2.5 text-left transition md:min-h-[5.5rem]",
                      getTone(cell.status),
                      !cell.inCurrentMonth && "opacity-35",
                      selectedKey === cell.key && "ring-2 ring-moss shadow-[0_12px_30px_rgba(85,107,93,0.18)]",
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
                      <p className="mt-2 line-clamp-2 text-[0.8rem] font-medium leading-4 text-ink md:text-sm">
                        {cell.label}
                      </p>
                    ) : (
                      <p className="mt-2 text-[0.72rem] leading-4 text-stone/80">
                        {cell.classCount > 0 ? "Részletek mutatása" : "Nincs óra"}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="card-surface rounded-[2rem] p-6 xl:sticky xl:top-24 xl:self-start">
          <p className="eyebrow">Kiválasztott nap</p>
          <h3 className="mt-3 text-3xl font-semibold text-ink">
            {formatHungarianDate(`${selectedCell.key}T12:00:00`)}
          </h3>
          <p className="mt-3 rounded-full bg-background/75 px-4 py-2 text-sm text-stone">
            {getLegendLabel(selectedCell.status)}
          </p>

          <div className="mt-5">
            {selectedCell.items.length > 0 ? (
              <div className="space-y-3">
                {selectedCell.items.map((item) => (
                  <div key={item.id} className="rounded-[1.2rem] bg-background/70 p-4">
                    <p className="font-semibold text-ink">{item.title}</p>
                    {item.timeLabel ? <p className="mt-2 text-sm text-stone">{item.timeLabel}</p> : null}
                    {item.location ? <p className="mt-1 text-sm text-stone">{item.location}</p> : null}
                    {item.note ? <p className="mt-2 text-sm leading-6 text-stone">{item.note}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.2rem] bg-background/70 p-4 text-sm leading-6 text-stone">
                Ezen a napon jelenleg nincs jelölt óra vagy külön esemény.
              </div>
            )}
          </div>

          <p className="mt-4 text-xs leading-5 text-stone">
            Asztali nézetben elég rávinni az egeret egy napra. Telefonon koppintással frissül a részletező panel.
          </p>
        </aside>
      </div>
    </div>
  );
}
