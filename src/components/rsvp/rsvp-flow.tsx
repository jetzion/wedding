"use client";

import { useRef, useState } from "react";
import { type GuestName, lookupInvitation, submitRsvp } from "@/app/rsvp/actions";
import { cardClass } from "@/components/rsvp/fields";
import { type FormState, initialFormState, toSubmission } from "@/components/rsvp/form-state";
import { NameEntry } from "@/components/rsvp/name-entry";
import { RsvpForm } from "@/components/rsvp/rsvp-form";
import { RsvpConfirmation, RsvpReview } from "@/components/rsvp/rsvp-review";
import type { Invitation } from "@/lib/rsvp/types";

type Step = "code" | "form" | "review" | "done";
const NETWORK_ERROR = "We couldn't reach the server. Please check your connection and try again.";

/** RSVP steps: find invitation, fill in, review, confirmation. */
export function RsvpFlow() {
  const [step, setStep] = useState<Step>("code");
  const [guestName, setGuestName] = useState<GuestName>({ firstName: "", lastName: "" });
  const [householdId, setHouseholdId] = useState("");
  const [choices, setChoices] = useState<{ id: string; name: string }[]>([]);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [state, setState] = useState<FormState | null>(null);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  function go(next: Step) {
    setStep(next);
    setError(null);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function find(name: GuestName, chosenId?: string) {
    setBusy(true);
    setError(null);
    try {
      const result = await lookupInvitation(name, chosenId);
      setGuestName(name);
      setChoices(result.kind === "choose" ? result.households : []);
      if (result.kind === "error") return setError(result.error);
      if (result.kind === "choose") return;
      setHouseholdId(result.householdId);
      setInvitation(result.invitation);
      setState(initialFormState(result.invitation));
      go("form");
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const result = await submitRsvp(guestName, householdId, toSubmission(state!));
      if (!result.ok) return setError(result.error);
      setConfirmationCode(result.confirmationCode);
      go("done");
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div ref={topRef} className="mx-auto w-full max-w-2xl scroll-mt-24">
      {step === "code" && (
        <NameEntry
          initialName={guestName}
          choices={choices}
          busy={busy}
          error={error}
          onSubmit={(name) => find(name)}
          onChoose={(id) => find(guestName, id)}
        />
      )}
      {step !== "code" && invitation?.deadlinePassed && (
        <div className={`${cardClass} text-center`}>
          <h2 className="font-serif text-3xl">The RSVP deadline has passed</h2>
          <p className="mt-3 text-ink-muted">
            To change your response, please reach out to Greg & Daniella directly.
          </p>
        </div>
      )}
      {!invitation?.deadlinePassed && step === "form" && (
        <RsvpForm invitation={invitation!} state={state!} onChange={setState} onReview={() => go("review")} />
      )}
      {!invitation?.deadlinePassed && step === "review" && (
        <RsvpReview
          invitation={invitation!}
          state={state!}
          busy={busy}
          error={error}
          onEdit={() => go("form")}
          onSubmit={submit}
        />
      )}
      {step === "done" && (
        <RsvpConfirmation
          invitation={invitation!}
          state={state!}
          confirmationCode={confirmationCode}
          onEdit={() => go("form")}
        />
      )}
    </div>
  );
}
