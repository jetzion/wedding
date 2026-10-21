"use client";

import { useState, useSyncExternalStore } from "react";
import { TextField } from "@/components/rsvp/fields";

const noSubscription = () => () => {};

/**
 * Password field with a checkbox that shows what was typed. With isNew it
 * also asks for the password a second time to confirm it. The checkbox stays
 * disabled until the page is interactive, so an early tap cannot leave it out
 * of step with the field.
 */
export function PasswordFields({ isNew = false }: { isNew?: boolean }) {
  const [visible, setVisible] = useState(false);
  const interactive = useSyncExternalStore(noSubscription, () => true, () => false);
  const type = visible ? "text" : "password";

  return (
    <>
      {isNew ? (
        <>
          <TextField
            label="Password"
            name="password"
            type={type}
            autoComplete="new-password"
            minLength={12}
            hint="At least 12 characters."
            required
          />
          <TextField label="Confirm password" name="confirm" type={type} autoComplete="new-password" required />
        </>
      ) : (
        <TextField label="Password" name="password" type={type} autoComplete="current-password" required />
      )}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={visible}
          disabled={!interactive}
          onChange={(e) => setVisible(e.target.checked)}
          className="size-5 accent-sea"
        />
        {isNew ? "Show passwords" : "Show password"}
      </label>
    </>
  );
}
