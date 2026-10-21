"use client";

import { useState, useSyncExternalStore } from "react";
import { TextField } from "@/components/rsvp/fields";

const noSubscription = () => () => {};

/**
 * Password fields with a checkbox that shows what was typed. "sign-in" asks
 * for the password, "new" for a new password twice, and "change" for the
 * current password and then a new one twice. The checkbox stays disabled until
 * the page is interactive, so an early tap cannot leave it out of step with
 * the fields.
 */
export function PasswordFields({ variant = "sign-in" }: { variant?: "sign-in" | "new" | "change" }) {
  const [visible, setVisible] = useState(false);
  const interactive = useSyncExternalStore(noSubscription, () => true, () => false);
  const type = visible ? "text" : "password";

  if (variant === "sign-in") {
    return (
      <>
        <TextField label="Password" name="password" type={type} autoComplete="current-password" required />
        <ShowCheckbox label="Show password" checked={visible} disabled={!interactive} onChange={setVisible} />
      </>
    );
  }
  return (
    <>
      {variant === "change" && (
        <TextField label="Current password" name="current" type={type} autoComplete="current-password" required />
      )}
      <TextField
        label={variant === "change" ? "New password" : "Password"}
        name="password"
        type={type}
        autoComplete="new-password"
        minLength={12}
        hint="At least 12 characters."
        required
      />
      <TextField label="Confirm password" name="confirm" type={type} autoComplete="new-password" required />
      <ShowCheckbox label="Show passwords" checked={visible} disabled={!interactive} onChange={setVisible} />
    </>
  );
}

function ShowCheckbox({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="size-5 accent-sea"
      />
      {label}
    </label>
  );
}
