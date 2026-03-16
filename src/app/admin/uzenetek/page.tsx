import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { requireAdminProfile } from "@/lib/auth";
import { getContactMessages } from "@/lib/data";
import { updateMessageStatusAction } from "@/server/actions/admin";

export default async function AdminMessagesPage() {
  const profile = await requireAdminProfile();
  const messages = await getContactMessages();

  return (
    <AdminShell profile={profile} currentPath="/admin/uzenetek">
      <AdminPageHeader
        title="Kapcsolat üzenetek"
        description="Olvasott/olvasatlan állapot, archiválás és gyors áttekintés."
      />

      <div className="grid gap-5">
        {messages.map((message) => (
          <article key={message.id} className="card-surface rounded-[1.75rem] p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_0.5fr]">
              <div>
                <h2 className="text-2xl font-semibold text-ink">{message.subject}</h2>
                <p className="mt-2 text-stone">{message.name} • {message.email}</p>
                <p className="mt-4 text-sm leading-7 text-stone">{message.message}</p>
              </div>
              <form action={updateMessageStatusAction} className="grid gap-3">
                <input type="hidden" name="id" value={message.id} />
                <select name="status" defaultValue={message.status} className="select-field">
                  <option value="unread">unread</option>
                  <option value="read">read</option>
                  <option value="archived">archived</option>
                </select>
                <Button variant="secondary">Mentés</Button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
