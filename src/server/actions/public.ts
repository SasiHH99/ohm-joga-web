"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { sendBookingConfirmationEmail, sendContactNotificationEmail } from "@/lib/email";
import { env, hasSupabasePublicEnv, hasSupabaseServiceEnv } from "@/lib/env";
import { getClasses, getServices } from "@/lib/data";
import { PREVIEW_ADMIN_COOKIE } from "@/lib/auth";
import type { ActionState } from "@/server/actions/state";
import {
  createActionSupabaseClient,
  createAdminSupabaseClient,
  createServerSupabaseClient,
} from "@/lib/supabase/server";
import { bookingSchema, contactSchema, loginSchema } from "@/lib/validation";
import { formatDateRange, formatHungarianDateTime } from "@/lib/format";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function submitBookingAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const payload = {
    serviceId: getString(formData, "serviceId"),
    classId: getString(formData, "classId") || undefined,
    requestType:
      getString(formData, "requestType") === "custom" ? "custom" : "scheduled",
    preferredDate: getString(formData, "preferredDate") || undefined,
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone"),
    note: getString(formData, "note"),
    privacyAccepted: getCheckbox(formData, "privacyAccepted"),
  };

  const parsed = bookingSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Kérlek ellenőrizd az adatokat.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.requestType === "scheduled" && !parsed.data.classId) {
    return {
      status: "error",
      message: "Kérlek válassz időpontot a foglaláshoz.",
    };
  }

  const services = await getServices(true);
  const classes = await getClasses(true);
  const service = services.find((item) => item.id === parsed.data.serviceId);
  const classSession = classes.find((item) => item.id === parsed.data.classId);

  if (!service) {
    return {
      status: "error",
      message: "A kiválasztott szolgáltatás nem található.",
    };
  }

  if (hasSupabaseServiceEnv) {
    try {
      const admin = createAdminSupabaseClient();

      if (!admin) {
        throw new Error("No admin client");
      }

      if (parsed.data.requestType === "scheduled" && parsed.data.classId) {
        const { data: slotBookings } = await admin
          .from("bookings")
          .select("id")
          .eq("class_id", parsed.data.classId)
          .in("status", ["pending", "confirmed"]);

        if (classSession && (slotBookings?.length ?? 0) >= classSession.capacity) {
          return {
            status: "error",
            message: "Erre az alkalomra jelenleg nincs több szabad hely.",
          };
        }
      }

      await admin.from("bookings").insert({
        service_id: parsed.data.serviceId,
        class_id: parsed.data.classId ?? null,
        request_type: parsed.data.requestType,
        preferred_date: parsed.data.preferredDate || null,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        note: parsed.data.note,
        status: "pending",
        privacy_accepted: true,
      });

      const scheduleLabel =
        parsed.data.requestType === "scheduled" && classSession
          ? `Időpont: ${formatDateRange(classSession.startsAt, classSession.endsAt)}`
          : parsed.data.preferredDate
            ? `Kért időpont: ${formatHungarianDateTime(parsed.data.preferredDate)}`
            : "Egyedi időpontkérés érkezett.";

      await sendBookingConfirmationEmail({
        to: parsed.data.email,
        name: parsed.data.name,
        serviceTitle: service.title,
        scheduleLabel,
      });
    } catch {
      return {
        status: "error",
        message: "A foglalást most nem sikerült elmenteni. Próbáld újra később.",
      };
    }
  }

  revalidatePath("/");
  revalidatePath("/orarend");
  revalidatePath("/admin/foglalasok");

  return {
    status: "success",
    message: hasSupabaseServiceEnv
      ? "Sikeres foglalás. A visszaigazolást emailben is elküldtük."
      : "Előnézeti módban rögzítettük a foglalást. Supabase csatlakoztatás után ez perzisztensen mentődik.",
  };
}

export async function submitContactAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const payload = {
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone"),
    subject: getString(formData, "subject"),
    message: getString(formData, "message"),
  };

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Kérlek ellenőrizd az adatokat.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (hasSupabaseServiceEnv) {
    try {
      const admin = createAdminSupabaseClient();
      await admin!.from("contact_messages").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        subject: parsed.data.subject,
        message: parsed.data.message,
        status: "unread",
      });

      await sendContactNotificationEmail({
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
      });
    } catch {
      return {
        status: "error",
        message: "Az üzenet küldése most nem sikerült.",
      };
    }
  }

  revalidatePath("/kapcsolat");
  revalidatePath("/admin/uzenetek");

  return {
    status: "success",
    message: hasSupabaseServiceEnv
      ? "Köszönöm, az üzeneted megérkezett."
      : "Előnézeti módban az üzenetet sikeresként kezeltük.",
  };
}

export async function loginAdminAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const payload = {
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  };

  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Kérlek adj meg érvényes belépési adatokat.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!hasSupabasePublicEnv) {
    if (
      parsed.data.email === env.previewAdminEmail &&
      parsed.data.password === env.previewAdminPassword
    ) {
      const cookieStore = await cookies();
      cookieStore.set(PREVIEW_ADMIN_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
      });

      return {
        status: "success",
        message: "Belépés sikeres. Nyisd meg az admin dashboardot.",
      };
    }

    return {
      status: "error",
      message: "Hibás preview admin belépési adat.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase!.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message: "Sikertelen bejelentkezés.",
    };
  }

  return {
    status: "success",
    message: "Belépés sikeres. Nyisd meg az admin dashboardot.",
  };
}

export async function loginAdminServerAction(formData: FormData) {
  const payload = {
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  };

  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    redirect("/admin/login?error=ervenytelen-adatok");
  }

  if (!hasSupabasePublicEnv) {
    if (
      parsed.data.email === env.previewAdminEmail &&
      parsed.data.password === env.previewAdminPassword
    ) {
      const cookieStore = await cookies();
      cookieStore.set(PREVIEW_ADMIN_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
      });

      redirect("/admin");
    }

    redirect("/admin/login?error=hibas-preview-belepes");
  }

  const supabase = await createActionSupabaseClient();

  if (!supabase) {
    redirect("/admin/login?error=nincs-supabase");
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirect("/admin/login?error=sikertelen-belepes");
  }

  redirect("/admin");
}
