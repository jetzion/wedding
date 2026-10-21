import { notFound } from "next/navigation";
import { setUp } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { PasswordFields } from "@/components/admin/password-fields";
import { TextField } from "@/components/rsvp/fields";

/** One-time admin account creation. Hidden unless ADMIN_SETUP_CODE is set. */
export default function Page() {
  if (!process.env.ADMIN_SETUP_CODE) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-center font-serif text-4xl">Create admin account</h1>
      <AdminForm action={setUp} submitLabel="Create account">
        <TextField label="Setup code" name="code" autoComplete="off" required />
        <TextField label="Email" name="email" type="email" autoComplete="username" required />
        <PasswordFields isNew />
      </AdminForm>
    </div>
  );
}
