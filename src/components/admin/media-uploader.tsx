"use client";

import { useState } from "react";

export function MediaUploader() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as { message?: string; url?: string };
    setPending(false);
    setMessage(data.url ? `Feltöltve: ${data.url}` : data.message ?? "Ismeretlen válasz");
  }

  return (
    <form onSubmit={handleUpload} className="card-surface rounded-[2rem] p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <input name="file" type="file" className="input-field file:mr-4 file:rounded-full file:border-0 file:bg-moss file:px-4 file:py-2 file:text-ivory" />
        <button
          type="submit"
          className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-ivory"
          disabled={pending}
        >
          {pending ? "Feltöltés..." : "Kép feltöltése"}
        </button>
      </div>
      {message ? <p className="mt-4 text-sm text-stone">{message}</p> : null}
    </form>
  );
}
