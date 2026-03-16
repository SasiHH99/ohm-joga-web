"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  buildCalendarMonths,
  calendarLegend,
  findCalendarCell,
  findDefaultCalendarKey,
  getCalendarWeekdayLabels,
} from "@/lib/calendar";
import { formatHungarianDate } from "@/lib/format";
import type { CalendarDay, ClassSession } from "@/lib/types";
import {
  deleteCalendarDayAction,
  upsertCalendarDayAction,
} from "@/server/actions/admin";
import { adminScheduleSuggestions } from "@/lib/site";

function getTone(status: CalendarDay["status"] | null) {
  switch (status) {
    case "class-day":
      return "border-sage/70 bg-sage/45 text-ink";
    case "free-day":
      return "border-sand/80 bg-sand/45 text-ink";
    case "unavailable":
      return "border-clay/55 bg-clay/28 text-ink";
    default:
      return "border-stone/10 bg-white/70 text-ink";
  }
}

export function AdminCalendarManager({
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
  const selectedMarkedDay = markedDays.find((item) => item.day === selectedKey) ?? null;

  if (!selectedCell) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <section className="card-surface rounded-[2rem] p-6 md:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Naptárnézet</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">Kattintható napok</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-stone">
            Kattints egy napra, és a jobb oldali panel rögtön átveszi a dátumot. Innen tudod jelölni a szabadnapot, a szünetet vagy átlépni az órarendhez.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone">
          {calendarLegend.map((item) => (
            <span key={item.status} className={clsx("rounded-full px-4 py-2", item.className)}>
              {item.label}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-6 2xl:grid-cols-2">
          {months.map((month) => (
            <section key={month.label} className="rounded-[1.8rem] bg-background/55 p-4 md:p-5">
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
                    onClick={() => setSelectedKey(cell.key)}
                    className={clsx(
                      "min-h-[4.7rem] rounded-[1rem] border p-2 text-left transition md:min-h-[5rem]",
                      getTone(cell.status),
                      !cell.inCurrentMonth && "opacity-30",
                      selectedKey === cell.key && "ring-2 ring-moss shadow-[0_12px_30px_rgba(85,107,93,0.18)]",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={clsx(
                          "text-sm font-semibold",
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

                    <div className="mt-2 flex flex-wrap gap-1">
                      {cell.classCount > 0 ? (
                        <span className="rounded-full bg-moss/14 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-moss">
                          {cell.classCount} óra
                        </span>
                      ) : null}
                      {cell.label ? (
                        <span className="max-w-full truncate rounded-full bg-white/75 px-2 py-1 text-[0.62rem] font-semibold text-stone">
                          {cell.label}
                        </span>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="card-surface rounded-[2rem] p-6">
        <p className="eyebrow">Kijelölt nap</p>
        <h2 className="mt-3 text-2xl font-semibold text-ink">
          {formatHungarianDate(`${selectedCell.key}T12:00:00`)}
        </h2>

        <div className="mt-5 rounded-[1.5rem] bg-background/70 p-4">
          {selectedCell.items.length > 0 ? (
            <div className="space-y-3">
              {selectedCell.items.map((item) => (
                <div key={item.id} className="rounded-[1.2rem] bg-ivory/90 p-4">
                  <p className="font-semibold text-ink">{item.title}</p>
                  {item.timeLabel ? <p className="mt-1 text-sm text-stone">{item.timeLabel}</p> : null}
                  {item.location ? <p className="mt-1 text-sm text-stone">{item.location}</p> : null}
                  {item.note ? <p className="mt-2 text-sm leading-6 text-stone">{item.note}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-stone">
              Erre a napra még nincs óra vagy külön jelölés mentve.
            </p>
          )}
        </div>

        <form
          key={`${selectedKey}-${selectedMarkedDay?.id ?? "new"}`}
          action={upsertCalendarDayAction}
          className="mt-6 grid gap-4"
        >
          <input type="hidden" name="id" value={selectedMarkedDay?.id ?? ""} />

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Dátum</label>
            <input name="day" type="date" className="input-field" value={selectedKey} readOnly />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Jelölés</label>
            <select
              name="status"
              className="select-field"
              defaultValue={
                selectedMarkedDay?.status ?? (selectedCell.classCount > 0 ? "class-day" : "free-day")
              }
            >
              <option value="class-day">Órás nap</option>
              <option value="free-day">Szabadnap</option>
              <option value="unavailable">Szünet / nem elérhető</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Rövid címke</label>
            <input
              name="label"
              className="input-field"
              list="calendar-label-suggestions"
              placeholder="Pihenőnap vagy workshop"
              defaultValue={selectedMarkedDay?.label ?? ""}
            />
            <datalist id="calendar-label-suggestions">
              {adminScheduleSuggestions.calendarLabels.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Megjegyzés</label>
            <textarea
              name="note"
              className="textarea-field"
              placeholder="Rövid megjegyzés a naphoz."
              defaultValue={selectedMarkedDay?.note ?? ""}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button>Nap mentése</Button>
            <Link
              href={`/admin/orarend?day=${selectedKey}`}
              className="inline-flex items-center justify-center rounded-full bg-ivory px-5 py-3 text-sm font-semibold text-ink ring-1 ring-sand/70 transition hover:bg-sand/20"
            >
              Óra létrehozása erre a napra
            </Link>
          </div>
        </form>

        {selectedMarkedDay ? (
          <form action={deleteCalendarDayAction} className="mt-3">
            <input type="hidden" name="id" value={selectedMarkedDay.id} />
            <Button variant="ghost">Jelölés törlése</Button>
          </form>
        ) : null}
      </section>
    </div>
  );
}
