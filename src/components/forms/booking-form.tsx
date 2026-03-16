"use client";

import { clsx } from "clsx";
import { useActionState, useState } from "react";

import { SubmitButton } from "@/components/ui/submit-button";
import { formatDateRange } from "@/lib/format";
import type { ClassSession, Service } from "@/lib/types";
import { submitBookingAction } from "@/server/actions/public";
import { initialActionState } from "@/server/actions/state";

export function BookingForm({
  services,
  classes,
  defaultServiceId,
  defaultClassId,
}: {
  services: Service[];
  classes: ClassSession[];
  defaultServiceId?: string;
  defaultClassId?: string;
}) {
  const [state, formAction] = useActionState(submitBookingAction, initialActionState);
  const [serviceId, setServiceId] = useState(defaultServiceId ?? services[0]?.id ?? "");
  const [requestType, setRequestType] = useState<"scheduled" | "custom">("scheduled");

  const filteredClasses = classes.filter((item) => item.serviceId === serviceId);

  return (
    <div className="card-surface rounded-[2rem] p-6 md:p-8">
      {state.status === "success" ? (
        <div className="rounded-[1.5rem] bg-sage/40 p-6 text-ink">
          <p className="eyebrow">Sikeres foglalás</p>
          <h3 className="mt-3 font-display text-3xl">Megérkezett a jelentkezésed.</h3>
          <p className="mt-4 max-w-xl text-stone">{state.message}</p>
        </div>
      ) : null}

      <form action={formAction} className="grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-ink" htmlFor="serviceId">
            Szolgáltatás
          </label>
          <select
            id="serviceId"
            name="serviceId"
            className="select-field"
            defaultValue={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 rounded-[1.5rem] border border-stone/10 bg-ivory/60 p-4">
          <p className="text-sm font-semibold text-ink">Foglalás típusa</p>
          <label className="flex items-center gap-3 text-stone">
            <input
              type="radio"
              name="requestType"
              value="scheduled"
              checked={requestType === "scheduled"}
              onChange={() => setRequestType("scheduled")}
            />
            Konkrét órára foglalok
          </label>
          <label className="flex items-center gap-3 text-stone">
            <input
              type="radio"
              name="requestType"
              value="custom"
              checked={requestType === "custom"}
              onChange={() => setRequestType("custom")}
            />
            Egyedi időpontot kérek
          </label>
        </div>

        {requestType === "scheduled" ? (
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="classId">
              Elérhető időpont
            </label>
            <select id="classId" name="classId" className="select-field" defaultValue={defaultClassId}>
              <option value="">Válassz órát</option>
              {filteredClasses.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title} - {formatDateRange(session.startsAt, session.endsAt)} -{" "}
                  {session.availableSpots} szabad hely
                </option>
              ))}
            </select>
            <p className="text-sm text-stone">
              {filteredClasses.length > 0
                ? "Az elérhető idősávok valós kapacitással jelennek meg."
                : "Ehhez a szolgáltatáshoz jelenleg nincs fix idősáv. Válts egyedi időpontkérésre."}
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="preferredDate">
              Kért dátum / időpont
            </label>
            <input id="preferredDate" name="preferredDate" type="datetime-local" className="input-field" />
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="name">
              Név
            </label>
            <input id="name" name="name" className="input-field" />
            {state.fieldErrors?.name ? <p className="text-sm text-red-700">{state.fieldErrors.name[0]}</p> : null}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" className="input-field" />
            {state.fieldErrors?.email ? <p className="text-sm text-red-700">{state.fieldErrors.email[0]}</p> : null}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="phone">
              Telefonszám
            </label>
            <input id="phone" name="phone" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="note">
              Megjegyzés
            </label>
            <input id="note" name="note" className="input-field" />
          </div>
        </div>

        <label
          className={clsx(
            "flex items-start gap-3 rounded-[1.25rem] border border-stone/10 bg-ivory/60 p-4 text-sm text-stone",
            state.fieldErrors?.privacyAccepted && "border-red-400 text-red-700",
          )}
        >
          <input name="privacyAccepted" type="checkbox" className="mt-1" />
          Hozzájárulok ahhoz, hogy az Ohm Jóga a megadott adataimat foglalási célból kezelje.
        </label>

        {state.status === "error" && state.message ? (
          <p className="rounded-[1rem] bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </p>
        ) : null}

        <SubmitButton idleLabel="Foglalás elküldése" pendingLabel="Mentés folyamatban..." />
      </form>
    </div>
  );
}
