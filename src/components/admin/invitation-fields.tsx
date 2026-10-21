import { TextField } from "@/components/rsvp/fields";
import type { AdminInvitation } from "@/lib/admin/invitations";

const BLANK_ROWS = 3;
const NEW_INVITATION_ROWS = 6;

/**
 * Form fields shared by the new and edit invitation pages. Existing guests
 * carry their id and a "Remove" checkbox; blank rows add new people.
 */
export function InvitationFields({ invitation }: { invitation?: AdminInvitation }) {
  const existing = invitation?.guests.filter((g) => !g.isPlusOne) ?? [];
  const plusOne = invitation?.guests.find((g) => g.isPlusOne);
  const blankRows = invitation ? BLANK_ROWS : NEW_INVITATION_ROWS;

  return (
    <>
      {invitation && <input type="hidden" name="id" value={invitation.id} />}
      <TextField
        label="Invitation name"
        name="name"
        placeholder="The Rivera Household"
        defaultValue={invitation?.name}
        required
        maxLength={120}
      />
      <TextField
        label="Contact email"
        name="contactEmail"
        type="email"
        hint="Optional."
        defaultValue={invitation?.contactEmail ?? ""}
        maxLength={200}
      />
      <fieldset className="space-y-3">
        <legend className="font-serif text-xl">People</legend>
        <p className="text-sm text-ink-muted">
          Guests look up their invitation by first and last name, so spell them as the guest will type them.
          Leave extra rows blank.
        </p>
        {existing.map((guest) => (
          <div key={guest.id} className="space-y-2">
            <PersonRow guestId={guest.id} firstName={guest.firstName ?? ""} lastName={guest.lastName ?? ""} />
            <label className="flex items-center gap-2 text-sm text-coral">
              <input type="checkbox" name="remove" value={guest.id} className="size-4 accent-coral" />
              Remove {guest.name}
              {guest.status !== "awaiting" && " and their RSVP answer"}
            </label>
          </div>
        ))}
        {Array.from({ length: blankRows }, (_, i) => (
          <PersonRow key={i} required={!invitation && i === 0} />
        ))}
      </fieldset>
      <label className="flex items-center gap-3">
        <input type="checkbox" name="plusOne" defaultChecked={Boolean(plusOne)} className="size-5 accent-sea" />
        <span>
          Allow a plus-one (the guest names them when they RSVP)
          {plusOne?.firstName && (
            <span className="block text-sm text-coral">
              Currently {plusOne.name}. Unchecking removes them and their RSVP answer.
            </span>
          )}
        </span>
      </label>
    </>
  );
}

function PersonRow({
  guestId = "",
  firstName = "",
  lastName = "",
  required = false,
}: {
  guestId?: string;
  firstName?: string;
  lastName?: string;
  required?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <input type="hidden" name="guestId" value={guestId} />
      <TextField
        label="First name"
        name="firstName"
        defaultValue={firstName}
        required={required || Boolean(guestId)}
        maxLength={80}
        autoComplete="off"
      />
      <TextField
        label="Last name"
        name="lastName"
        defaultValue={lastName}
        required={required || Boolean(guestId)}
        maxLength={80}
        autoComplete="off"
      />
    </div>
  );
}
