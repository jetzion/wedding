import { signIn } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { TextField } from "@/components/rsvp/fields";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-center font-serif text-4xl">Admin sign-in</h1>
      <AdminForm action={signIn} submitLabel="Sign in">
        <TextField label="Email" name="email" type="email" autoComplete="username" required />
        <TextField label="Password" name="password" type="password" autoComplete="current-password" required />
      </AdminForm>
    </div>
  );
}
