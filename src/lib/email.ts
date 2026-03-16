import { env, hasEmailEnv } from "@/lib/env";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail(payload: EmailPayload) {
  if (!hasEmailEnv) {
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.bookingFromEmail,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });
}

export async function sendBookingConfirmationEmail(input: {
  to: string;
  name: string;
  serviceTitle: string;
  scheduleLabel: string;
}) {
  await Promise.all([
    sendEmail({
      to: input.to,
      subject: "Ohm Jóga foglalás visszaigazolás",
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f1d1a"><h2>Köszönöm a foglalásod, ${input.name}.</h2><p>A választott szolgáltatás: <strong>${input.serviceTitle}</strong></p><p>${input.scheduleLabel}</p></div>`,
    }),
    sendEmail({
      to: env.adminNotificationEmail,
      subject: "Új Ohm Jóga foglalás érkezett",
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f1d1a"><h2>Új foglalás érkezett</h2><p>Név: <strong>${input.name}</strong></p><p>Szolgáltatás: <strong>${input.serviceTitle}</strong></p><p>${input.scheduleLabel}</p></div>`,
    }),
  ]);
}

export async function sendContactNotificationEmail(input: {
  name: string;
  email: string;
  subject: string;
}) {
  await sendEmail({
    to: env.adminNotificationEmail,
    subject: `Új kapcsolatfelvétel: ${input.subject}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f1d1a"><h2>Új kapcsolatfelvételi üzenet</h2><p><strong>${input.name}</strong> írt (${input.email}).</p><p>Tárgy: ${input.subject}</p></div>`,
  });
}
