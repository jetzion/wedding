"use client";

import { useState } from "react";
import { TextField } from "@/components/rsvp/fields";

/** Password and confirm fields with a checkbox that shows what was typed. */
export function NewPasswordFields() {
  const [visible, setVisible] = useState(false);
  const type = visible ? "text" : "password";

  return (
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
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
          className="size-5 accent-sea"
        />
        Show passwords
      </label>
    </>
  );
}
