"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { lookupInvitation, submitRsvp } from "@/app/rsvp/actions";
import { CodeEntry } from "@/components/rsvp/code-entry";
import { cardClass } from "@/components/rsvp/fields";
import { type FormState, initialFormState, toSubmission } from "@/components/rsvp/form-state";
import { RsvpForm } from "@/components/rsvp/rsvp-form";
import { RsvpConfirmation, RsvpReview } from "@/components/rsvp/rsvp-review";
import type { Invitation } from "@/lib/rsvp/types";

type Step = "code" | "form" | "review" | "done";
const NETWORK_ERROR = "We couldn't reach the server. Please check your connection and try again.";

/** RSVP steps: find invitation, fill in, review, confirmation. */
export function RsvpFlow() {
  const linkCode = useSearchParams().get("code") ?? "";
  const [step, setStep] = useState<Step>("code");
  const [code, setCode] = useState(linkCode);
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

  async function find(entered: string) {
    setBusy(true);
    setError(null);
    try {
      const result = await lookupInvitation(entered);
      if (!result.ok) return setError(result.error);
      setCode(entered);
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
      const result = await submitRsvp(code, toSubmission(state!));
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
        <CodeEntry key={code} initialCode={code} busy={busy} error={error} onSubmit={find} />
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
