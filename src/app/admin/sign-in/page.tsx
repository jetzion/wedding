import { signIn } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { PasswordFields } from "@/components/admin/password-fields";
import { TextField } from "@/components/rsvp/fields";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-center font-serif text-4xl">Admin sign-in</h1>
      <AdminForm action={signIn} submitLabel="Sign in">
        <TextField label="Email" name="email" type="email" autoComplete="username" required />
        <PasswordFields />
      </AdminForm>
    </div>
  );
}
