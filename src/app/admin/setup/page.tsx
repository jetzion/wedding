import { notFound } from "next/navigation";
import { setUp } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
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
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          hint="At least 12 characters."
          required
        />
        <TextField label="Confirm password" name="confirm" type="password" autoComplete="new-password" required />
      </AdminForm>
    </div>
  );
}
