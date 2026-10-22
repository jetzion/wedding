# Wedding Website — Product Specification

## 1. Project Overview

Build a beautiful, modern, mobile-first wedding website that serves as the primary information and planning hub for wedding guests.

The website should feel personal, elegant, welcoming, and easy to navigate. It must work well for guests of all ages and technical abilities, especially on mobile devices.

The application includes two primary experiences:

1. **Public wedding website:** Information about the couple, wedding events, venue, travel, accommodations, FAQs, and RSVP.
2. **Private administration dashboard:** A secure area for managing wedding details, guests, invitations, RSVPs, and event information.

The goal is to simplify wedding planning and guest communication while creating an enjoyable experience for everyone attending.

### Product principles

- Prioritize simplicity, usability, and visual quality.
- Make the RSVP process quick and intuitive.
- Design for mobile first, then adapt to tablets and desktops.
- Protect guest information and keep administrative functionality private.
- Make wedding information easy to update without changing application code.
- Avoid unnecessary features that add complexity without improving the guest experience.
- Use reusable components and maintainable code.

---

## 2. User Roles

### Guest

Guests can:

- View public wedding information.
- Read the couple's story.
- Explore event schedules and locations.
- View travel, accommodation, and transportation information.
- RSVP using a personalized invitation link or invitation code.
- Indicate attendance for applicable events.
- Submit meal preferences and dietary restrictions.
- Provide accessibility or accommodation requests.
- Review their RSVP confirmation and event details.
- Find answers to frequently asked questions.
- Access the wedding registry, if provided.

Guests must not be able to access other guests' personal information or administrative features.

### Administrator

The couple or authorized wedding planner can:

- Securely log in to the admin dashboard.
- Update website content and wedding details.
- Manage guests and households.
- Create and manage invitations.
- Track RSVP responses and attendance.
- Review dietary restrictions and special requests.
- Manage event-specific attendance.
- Export guest and RSVP data.
- View attendance summaries and planning reports.
- Configure website visibility and RSVP settings.

Support multiple authorized administrators if needed.

---

## 3. Public Website Features

### 3.1 Homepage

Create an elegant homepage featuring:

- Couple's names.
- Wedding date.
- Wedding location.
- Hero image or photo gallery.
- Countdown to the wedding.
- Prominent RSVP button.
- Short welcome message.
- Links to essential guest information.
- Navigation to the main website sections.

The countdown must calculate the time remaining using the configured wedding date, time, and timezone. After the wedding, replace the countdown with an appropriate message or post-wedding content.

Keep the homepage visually engaging without excessive animation or large, slow-loading media.

### 3.2 Our Story

Include:

- A brief introduction to the couple.
- Their relationship story.
- Important milestones, if desired.
- Engagement photos or other approved photographs.
- An optional timeline of their relationship.

The content must be editable by an administrator rather than hardcoded into individual components.

### 3.3 Wedding Details

Display the essential event information:

- Ceremony date and start time.
- Reception date and start time.
- Venue names and addresses.
- Dress code.
- Parking instructions.
- Indoor or outdoor details, if relevant.
- Event-specific notes.
- Map links and directions.

Support multiple wedding-related events, including rehearsal dinners, welcome parties, ceremonies, receptions, and post-wedding gatherings.

Each event should have its own title, date, start and end times, location, description, and attendance requirements.

Only display events that are configured and published.

### 3.4 RSVP System

This is a core feature and must be reliable.

Guests should be able to RSVP through a personalized invitation link or an invitation code.

The RSVP process should:

1. Identify the invited guest or household.
2. Display only the guests associated with that invitation.
3. Show the events they are invited to attend.
4. Allow each eligible guest to respond for each event.
5. Collect meal selections when applicable.
6. Collect dietary restrictions and accessibility requests.
7. Allow an optional message to the couple.
8. Display a review screen before submission.
9. Save the response and show a confirmation.
10. Send a confirmation email when email delivery is configured.

RSVP fields should include:

- Guest name.
- Attendance status: attending, unable to attend, or awaiting response.
- Event-specific attendance.
- Meal preference, if applicable.
- Dietary restrictions.
- Accessibility requirements or special requests.
- Optional guest message.
- Submission timestamp.

Requirements:

- Support individual guests and household invitations.
- Respect plus-one allowances and guest-specific invitation rules.
- Do not allow guests to add unauthorized attendees.
- Validate all required fields.
- Prevent duplicate submissions from creating duplicate guest records.
- Allow guests to revise responses until the administrator-configured deadline.
- After the deadline, display clear instructions for requesting a change.
- Provide an RSVP confirmation reference.
- Handle network errors without losing entered information.
- Never expose the complete guest list through the public website.

If an invitation code or token is used, it must be sufficiently unpredictable, validated on the server, and limited to the appropriate invitation. Do not rely on hidden frontend fields for authorization.

### 3.5 Travel and Accommodations

Provide a dedicated travel page containing configurable sections for:

- Recommended hotels.
- Room-block information and booking links.
- Airport information.
- Rental car information.
- Local transportation and rideshare guidance.
- Parking.
- Estimated travel distances or times, when verified.
- Nearby restaurants and attractions, if desired.

All information and links must be editable through the admin interface.

Do not invent hotel rates, availability, discounts, or booking information.

### 3.6 Frequently Asked Questions

Create an FAQ page with editable categories and questions.

Suggested categories:

- RSVP and invitations.
- Dress code.
- Ceremony and reception.
- Children and plus-ones.
- Food and dietary requirements.
- Travel and accommodations.
- Parking and transportation.
- Gifts and registry.
- Accessibility.
- Weather and outdoor arrangements.

Include search or simple category filtering if the FAQ becomes large.

The administrator should be able to add, edit, reorder, publish, and remove questions.

### 3.7 Registry and Gifts

If the couple chooses to include a registry, provide:

- An optional registry page.
- Links to external registry providers.
- A configurable gift or honeymoon fund link, if applicable.
- A personal message about gifts.

This section should be optional and hidden when unused. Do not build payment processing or store financial information for gifts in the initial release.

### 3.8 Photo Gallery

Provide an optional gallery with:

- Responsive image layouts.
- Optimized images and thumbnails.
- Lazy loading.
- Accessible alternative text.
- A larger-image viewing experience.
- Optional albums for engagement photos and other collections.

Only publish approved images. Do not allow unrestricted public uploads in the initial release.

### 3.9 Contact and Help

Include a contact section with configurable contact information or a contact form.

If a form is implemented:

- Validate inputs on the server.
- Apply spam protection and rate limiting.
- Avoid exposing private email addresses unnecessarily.
- Do not reveal guest or RSVP information in response messages.

### 3.10 Wedding Updates

Allow the couple to publish important announcements, such as schedule changes, transportation updates, or weather instructions.

Support:

- An optional announcements section on the homepage.
- Publication dates.
- Draft and published states.
- Optional email notifications if an email service is configured.

Do not build a complex notification platform for the initial release.

---

## 4. Private Administration Dashboard

The admin dashboard is essential for managing the website without developer assistance.

### 4.1 Dashboard Overview

Show a summary of wedding planning information:

- Total invited guests.
- Number attending.
- Number declining.
- Number awaiting responses.
- RSVP response rate.
- Attendance by event.
- Meal preference totals.
- Upcoming RSVP deadline.
- Recent RSVP activity.

Calculate all metrics from stored data. Define whether counts represent individual guests, households, or invitations, and label them clearly.

### 4.2 Guest Management

Provide a searchable, filterable guest list.

Each guest record should support:

- First and last name.
- Email address, when available.
- Optional phone number.
- Household or invitation group.
- Invitation status.
- Event eligibility.
- RSVP status by event.
- Plus-one permissions.
- Meal selection.
- Dietary restrictions.
- Accessibility or special requests.
- Internal administrative notes.
- Creation and last-updated timestamps.

Administrators should be able to:

- Add, edit, and remove guest records.
- Group guests into households.
- Search by name or email.
- Filter by RSVP status, event, household, and meal selection.
- Review individual RSVP details.
- Correct responses when necessary.
- Import guests from a validated CSV file.
- Export guest and RSVP information to CSV.

Use confirmation dialogs for destructive operations. Prevent accidental duplicate guest creation where practical.

### 4.3 Invitation Management

Support:

- Creating invitations for individuals or households.
- Assigning guests to specific events.
- Setting RSVP deadlines.
- Generating secure invitation links or codes.
- Tracking whether invitations have been sent.
- Tracking invitation delivery status when available.
- Resending invitations.
- Previewing invitation emails.
- Exporting invitation status.

Email invitations must not be marked as sent unless the email provider confirms successful submission.

Invitation tokens should be stored securely, should not expose sequential guest IDs, and should be revocable or replaceable.

### 4.4 RSVP Management

Administrators should be able to:

- View all responses.
- Filter outstanding responses.
- Review attendance by event.
- Update a response on behalf of a guest.
- View submission timestamps.
- Identify incomplete responses.
- Review meal preferences and special requests.
- Export RSVP reports.
- Track changes to responses where practical.

### 4.5 Website Content Management

Provide editable settings for:

- Couple's names.
- Wedding date, time, and timezone.
- Venue details.
- Homepage welcome message.
- Our Story content.
- Photos and gallery.
- Event details.
- Dress code.
- Travel information.
- FAQs.
- Registry links.
- Contact information.
- RSVP deadline.
- RSVP availability.
- Announcement messages.

Provide preview functionality before publishing changes.

Do not require administrators to edit source files to update ordinary website content.

### 4.6 Reports and Exports

Support CSV exports for:

- Complete guest list.
- RSVP status.
- Attendance by event.
- Meal preferences.
- Dietary restrictions.
- Outstanding responses.
- Invitation status.

Exports must respect administrator permissions and must not be accessible through public URLs without authorization.

---

## 5. Recommended Data Model

Design a normalized database schema with appropriate relationships, constraints, and indexes.

### Wedding Settings

Store the primary wedding configuration:

- Wedding name or title.
- Couple's names.
- Date and time.
- Timezone.
- Venue details.
- RSVP deadline.
- Publication status.
- Website content and preferences.

### Guests

Store individual guest records:

- Unique guest ID.
- Name.
- Contact information.
- Household ID.
- Invitation eligibility.
- Plus-one permissions.
- Administrative notes.
- Timestamps.

### Households

Store invitation groups:

- Unique household ID.
- Household name.
- Primary contact, when applicable.
- Invitation token or secure token reference.
- Invitation delivery status.
- Timestamps.

### Events

Store wedding-related events:

- Unique event ID.
- Name.
- Description.
- Start and end times.
- Timezone.
- Venue and address.
- Dress code.
- RSVP requirements.
- Publication status.

### Invitations and Event Eligibility

Represent which guests or households are invited to which events.

Do not assume that every guest is invited to every event.

### RSVP Responses

Store responses associated with a guest and an event:

- Guest ID.
- Event ID.
- Attendance status.
- Meal selection.
- Dietary restrictions.
- Accessibility requests.
- Submission timestamp.
- Last-updated timestamp.

Enforce uniqueness for the appropriate guest/event combination.

Keep the distinction between an unanswered invitation and an explicit decline.

### Administrators

Store or reference authenticated administrator identities, roles, and relevant audit metadata.

Never store plaintext passwords.

### Announcements

Store announcement content, publication status, and timestamps.

### Audit Records

Where appropriate, record administrative changes to important information, such as RSVP overrides, guest deletions, invitation changes, and data exports.

Avoid storing unnecessary sensitive information in logs.

---

## 6. Recommended Technical Architecture

Before implementation, inspect the existing repository and identify its framework, package manager, database, deployment configuration, and established coding conventions.

**Do not replace an existing working stack without a clear technical reason.**

If this is a new project, prefer the following architecture unless project constraints suggest otherwise:

- **Frontend:** Next.js with TypeScript and React.
- **Styling:** Tailwind CSS with reusable UI components.
- **Database:** PostgreSQL.
- **Data access:** A typed ORM such as Prisma or Drizzle.
- **Authentication:** A maintained authentication provider or library suitable for private administration.
- **Validation:** Shared schema validation using Zod or an equivalent.
- **Email:** A transactional email provider behind a small service abstraction.
- **Testing:** Vitest or Jest for unit tests and Playwright for end-to-end tests.
- **Deployment:** A supported hosting platform with HTTPS, environment variables, database backups, and a production database.

Use server-side endpoints or server actions for protected data operations.

Separate the application into logical modules:

- Public website.
- RSVP and invitation handling.
- Guest management.
- Event management.
- Content management.
- Authentication and authorization.
- Email notifications.
- Reporting and exports.

Use clear boundaries between presentation, business logic, and persistence.

Do not introduce microservices, a complex event bus, or unnecessary infrastructure for this application.

---

## 7. Visual Design and User Experience

The website should look like a professionally designed wedding website rather than a generic administrative application.

### Design direction

Use a refined, romantic visual style with:

- Elegant typography.
- A restrained color palette.
- Generous whitespace.
- High-quality photography.
- Subtle transitions.
- Clear navigation.
- Consistent spacing and alignment.
- Tasteful decorative elements.

Use a configurable theme rather than hardcoding a specific wedding aesthetic throughout the application.

The design should accommodate different styles, including modern minimal, classic elegant, garden, coastal, and formal wedding themes.

### Responsive design

Ensure the website works at common mobile, tablet, and desktop sizes.

Pay particular attention to:

- RSVP forms on small screens.
- Readable event information.
- Easy-to-tap buttons.
- Mobile navigation.
- Image cropping.
- Long guest names and addresses.
- Tables and reports in the admin dashboard.

### Accessibility

Target WCAG 2.2 AA where practical.

Include:

- Semantic HTML.
- Keyboard-accessible navigation.
- Visible focus states.
- Proper form labels.
- Accessible error messages.
- Sufficient color contrast.
- Alternative text for meaningful images.
- Reduced-motion support.
- Screen-reader-friendly status messages.

Do not rely on color alone to communicate RSVP status.

### Performance

- Optimize images.
- Use responsive image sizes.
- Lazy-load noncritical media.
- Avoid unnecessary client-side JavaScript.
- Minimize layout shifts.
- Keep the initial page load fast, especially on mobile connections.

---

## 8. Security and Privacy

Treat guest information as private personal data.

Requirements:

- Use HTTPS in production.
- Protect all administrative routes and APIs.
- Enforce authorization on the server for every protected operation.
- Validate all user input on the server.
- Use secure authentication and session handling.
- Apply rate limiting to invitation lookup, RSVP submissions, and contact forms.
- Prevent SQL injection, cross-site scripting, and cross-site request forgery where applicable.
- Restrict file uploads by type and size if uploads are enabled.
- Keep secrets in environment variables or a secrets manager.
- Never commit credentials or API keys.
- Do not expose database credentials or administrative endpoints to the browser.
- Avoid collecting information that is not needed.
- Provide a clear data retention and deletion approach.
- Protect CSV exports and avoid leaking private data through application logs.
- Use generic error messages for invalid invitation lookups to reduce guest enumeration.

Public website content may be accessible without authentication. Guest-specific RSVP information and all administrative functions must have appropriate access controls.

If using a managed database or authentication provider, configure its permissions and row-level security where applicable. Never assume frontend filtering is sufficient to protect data.

---

## 9. Email Notifications

Implement email through a dedicated service module so the provider can be changed without rewriting the application.

Support these email types:

1. Wedding invitation.
2. RSVP confirmation.
3. Invitation reminder.
4. Wedding update or announcement.
5. Optional RSVP-change confirmation.

Requirements:

- Use reusable, responsive email templates.
- Include the couple's names and relevant wedding details.
- Use secure personalized invitation links.
- Handle provider failures and rejected email addresses.
- Log delivery metadata without unnecessarily recording private content.
- Support retries where appropriate.
- Prevent accidental duplicate sends.
- Allow administrators to preview emails before sending.

Email reminders should be opt-in/configurable and should not send automatically until the administrator enables and verifies the feature.

The website must remain usable if email delivery is not configured.

---

## 10. SEO and Sharing

The public website should support:

- Appropriate page titles and meta descriptions.
- Open Graph metadata for link previews.
- A custom favicon.
- A sitemap where appropriate.
- A robots.txt file consistent with the site's privacy settings.
- Canonical URLs where needed.
- Clean, descriptive routes.

Do not index private invitation pages, guest-specific RSVP pages, admin pages, or pages containing private guest data.

Consider whether the couple wants the wedding website publicly discoverable or accessible primarily through invitations. Make that setting configurable.

---

## 11. Error Handling and Reliability

Provide clear feedback for:

- Invalid invitation links.
- Expired or revoked invitations.
- Missing required fields.
- Duplicate or repeated RSVP submissions.
- Network failures.
- Database errors.
- Email delivery failures.
- Unauthorized admin access.
- Expired sessions.

Use loading, success, empty, and error states consistently.

Never display a successful RSVP confirmation before the response has been persisted successfully.

Protect against duplicate form submissions and make operations safe to retry when practical.

---

## 12. Testing Requirements

Create automated tests for the application's critical functionality.

### Unit and integration tests

Test:

- RSVP validation.
- Guest and household relationships.
- Event-specific invitation eligibility.
- Plus-one restrictions.
- Attendance counts.
- RSVP deadline enforcement.
- Duplicate submission handling.
- Administrative authorization.
- CSV import validation.
- CSV export permissions.
- Invitation token validation.
- Email failure handling.

### End-to-end tests

Test the complete guest and administrator journeys.

**Guest journey:**

1. Open a valid invitation link.
2. View the invited guests and eligible events.
3. Submit attendance and meal preferences.
4. Receive a confirmation.
5. Reopen the invitation and review the saved response.
6. Update the response when changes are permitted.

**Administrator journey:**

1. Log in.
2. Create or import guests.
3. Assign guests to events.
4. Generate invitations.
5. Review incoming RSVPs.
6. Filter and export attendance information.
7. Update event details.
8. Confirm that unauthorized users cannot access protected information.

Use test data for automated tests. Never send real invitations or emails from test environments without explicit configuration.

---

## 13. Implementation Roadmap

Build incrementally. Get the essential guest journey working before implementing optional features.

### Phase 1 — Foundation

- Inspect the repository and document the existing stack.
- Establish the design system and responsive layout.
- Implement the database schema.
- Create wedding settings and event management.
- Implement secure administrator authentication.
- Configure development and test environments.

**Acceptance criteria:** The application runs locally, the database schema is established, and an authorized administrator can securely access the dashboard.

### Phase 2 — Public Website

- Build the homepage.
- Build Our Story.
- Build wedding details and event pages.
- Build travel and accommodation information.
- Build FAQs.
- Add registry and gallery sections as optional modules.
- Implement responsive layouts and accessibility basics.

**Acceptance criteria:** Guests can navigate all published pages on mobile and desktop, and administrators can update the configured content.

### Phase 3 — Guest Management and RSVP

- Implement guest and household management.
- Implement event-specific invitation eligibility.
- Generate secure invitation links or codes.
- Build the RSVP flow.
- Add meal preferences and special requests.
- Implement confirmation and editable responses.
- Enforce RSVP deadlines and plus-one restrictions.

**Acceptance criteria:** An invited guest can submit a valid RSVP, the response is saved reliably, and guests cannot modify or view another household's information.

### Phase 4 — Invitations and Administration

- Build invitation management.
- Integrate transactional email.
- Implement RSVP dashboards and filters.
- Implement CSV import and export.
- Add event attendance and meal summaries.
- Add administrative audit records for critical changes.

**Acceptance criteria:** The couple can manage the guest list, send invitations, monitor responses, and prepare accurate event attendance reports.

### Phase 5 — Quality and Launch

- Complete automated tests.
- Test accessibility and responsive behavior.
- Review security and privacy controls.
- Optimize performance and images.
- Configure production hosting, HTTPS, and database backups.
- Verify production email configuration.
- Test the complete guest journey using test invitations.
- Document deployment and operational procedures.

**Acceptance criteria:** The site is production-ready, protected, responsive, and usable without developer intervention for routine wedding updates.

---

## 14. Minimum Viable Product

Prioritize these features for the first usable release. Status as of 2026-10-21 (details in `PLAN.md`):

- [x] Elegant, responsive homepage. (Date and venue are placeholders.)
- [ ] Couple's story and wedding details. (Our Story is built with placeholder text; Wedding Details is "Coming soon".)
- [ ] Event schedules and locations. (One combined "Ceremony & Reception" event, unpublished placeholder.)
- [ ] Travel and accommodation information. ("Coming soon".)
- [ ] Frequently asked questions. ("Coming soon".)
- [x] Secure invitation links or codes. (Personal invitation pages with unguessable links; RSVP itself is by guest name, an accepted risk in section 16.)
- [x] Individual and household guest management.
- [x] Event-specific RSVP functionality.
- [x] Meal preferences and dietary restrictions. (Dietary and accessibility notes; no meal choices.)
- [x] RSVP confirmation. (On-screen confirmation code; confirmation emails wait on an email provider.)
- [x] Private administrator dashboard.
- [x] Guest list search and RSVP filtering.
- [x] CSV guest and RSVP exports. (Export only; no import.)
- [ ] Editable wedding content. (Content lives in code and the settings table; no admin editor yet.)
- [x] Basic security, accessibility, and automated tests. (Vitest unit tests and Playwright end-to-end tests; RSVP-flow and admin sign-in end-to-end tests still to come.)

The photo gallery, automated reminders, extensive analytics, registry integrations, and advanced customization can be implemented later if needed.

---

## 15. Definition of Done

The wedding website is ready for launch when:

- The public experience is polished and responsive.
- The couple can update wedding information independently.
- Guests can RSVP securely and easily.
- Event-specific eligibility and plus-one restrictions are enforced.
- RSVP records persist reliably.
- Administrators can manage guests and export accurate reports.
- Private guest information is protected.
- Core workflows pass automated tests.
- Production configuration and backups are documented.
- The site has been tested on mobile and desktop.
- No critical security, accessibility, or functionality issues remain.


---

## 16. Product Decisions

Decisions made by the couple that refine this specification. They take precedence over the general requirements above.

### RSVP (decided 2026-10-20)

- **Events requiring RSVP:** one combined "Ceremony & Reception" event. Guests answer once for both.
- **Meals:** no meal selection. Dietary restrictions and accessibility requests are still collected.
- **Plus-ones:** guests with a plus-one allowance enter their plus-one's name. Guests without an allowance cannot add anyone.
- **Children:** adults only. Households contain adult guests only.
- **RSVP unit:** one person answers for the whole household, for every guest on the invitation.
- **People on an invitation:** an invitation can include several people, each listed by first and last name. Entering any one of their names shows everyone on that invitation, and each person must be answered before the RSVP can be sent.
- **Deadline:** an RSVP deadline is enforced. The date is configurable by an administrator (not yet set).
- **Confirmation email:** sent after each submission or change, when email delivery is configured.
- **Deadline placeholder:** June 1, 2027, 11:59 PM Eastern, until the real date is set.

### Wedding date and timezone (decided 2026-10-20)

- **Timezone:** Eastern (`America/New_York`), confirmed for the venue.
- **Wedding date placeholder:** Saturday, August 14, 2027, 5:00 PM Eastern, until the real date is set. Placeholders are not shown to guests or given to the chat, except through the home page countdown (decided 2026-10-21).

### Name order (decided 2026-10-20)

- **Couple's name:** "Daniella Etzion & Greg Garfinkel", stored in wedding settings (migration `0005`).
- **First names:** Daniella first, then Greg (migration `0006`). Wherever both names appear together, Daniella comes first.
- **Our Story:** every section that shows both of them (Meet the Couple, Growing up, Graduation, How we met, love notes) lists Daniella first.
- **Exception:** engagement photo descriptions keep the order of what the photo shows (for example "Greg on one knee…").

### Administrators (decided 2026-10-20)

- **Admins:** Daniella, Greg, and the wedding planner. Configured as an email allowlist in the `ADMIN_EMAILS` environment variable; real addresses not yet provided.
- **Sign-in (decided 2026-10-21):** email and password through Better Auth, at least 12 characters, stored only as a hash. There is no public sign-up. Accounts are created on `/admin/setup`, which requires the `ADMIN_SETUP_CODE` secret and an email on `ADMIN_EMAILS` that has no account yet. The setup code stays set so admins can be added later (decided 2026-10-21); new admins should sign up soon after their email is added. Every admin page and action re-checks the session and the allowlist on the server, so removing an email from `ADMIN_EMAILS` revokes access. A signed-in admin can change their password at `/admin/password` by entering the current one; this signs out their other devices (decided 2026-10-21). Passwords cannot be viewed by anyone, only replaced.

### Admin invitation and RSVP management (defaults chosen 2026-10-21)

Defaults set while building the admin dashboard; change them if the couple prefers otherwise.

- **New invitations:** a name, an optional contact email, people with first and last names, and an optional plus-one slot. Every person is invited to every event.
- **Editing:** renaming a person keeps their RSVP answers. Removing a person requires ticking "Remove" (blanking a name is rejected), and deletes their answers. Unticking the plus-one removes the plus-one and their answer.
- **Deleting an invitation:** needs a confirmation page, and removes everyone on it with their answers.
- **Correcting RSVPs:** admins can set each answer to attending, declined, or awaiting response (which clears it), and set the plus-one's name, even after the deadline. Corrections do not change the household's confirmation code or response date.
- **Export:** CSV with one row per guest, available to admins only. Text that a spreadsheet would treat as a formula is prefixed with an apostrophe.
- **Countdown (decided 2026-10-21):** the home page counts down to the wedding date in settings, and stays visible while that date is the placeholder. This is the one exception to the placeholder rule above.

### RSVP lookup by guest name (decided 2026-10-20)

- Guests find their invitation by typing their **first name and last name** (two fields; case and spacing ignored), matching one invited guest exactly. Invitation codes are not used.
- If several households have an invited guest with that full name, the guest picks from a list of household names; nothing else is shown until they choose.
- Only invited guests' names match, not plus-one names entered by guests.
- **Accepted risk:** this departs from section 3.4 and section 8 ("sufficiently unpredictable" tokens). Anyone who knows an invited guest's full name can view and change that household's RSVP, including dietary and accessibility notes and the contact email. The couple chose this for convenience. Lookups and submissions stay rate-limited, and every submission is re-checked on the server.

### Personal invitation page (decided 2026-10-21)

- Each invitation has a link, `/invitation/[link name]`. The link name is the invitation name as a slug plus a 6-character random code, for example `/invitation/the-etzion-family-k7m2qx`. The code makes links unguessable, about 729 million possibilities per name, which follows section 3.4 and section 8.
- The greeting depends on the household (changed 2026-10-21; first version used the invitation name only): one guest by full name ("Jane Doe"), two by both full names ("John Smith and Jane Doe"), or "John and Jane Smith" when they share a last name, three or more by the invitation name plus "Family" ("The Smiths" becomes "Dear The Smiths Family,"; a name already ending in "Family", such as "The Smith Family", is not repeated); a plus-one slot adds "and Guest" to one or two names. No titles. Guests count only if they are named by the couple, not plus-one names entered by guests. The page shows nothing else about the household: no RSVP answers, dietary or accessibility notes, or contact email. Because one- and two-person invitations show guest names, anyone who has the link sees them; links are unguessable and replaceable. Wedding details not yet confirmed are shown as `[placeholders]`.
- The RSVP button goes to the normal `/rsvp` page, where guests look themselves up by name. The link never opens or changes a household's RSVP.
- An unknown, replaced, or deleted link shows one generic message ("We couldn't find this invitation"), so it never reveals which invitations exist. The page is not indexed by search engines, and its title does not include the household name.
- Admins see and copy each link from the dashboard. Renaming an invitation keeps its link. "New link" on the edit page replaces the code, so the old link stops working at once (revocable, as section 4.3 requires).

### Audit records (defaults chosen 2026-10-21)

- Recorded: adding, editing, and deleting invitations; new invitation links; RSVP corrections; and CSV exports. Each record has the time, the admin's email, the action, the invitation it concerns, and a short summary.
- Summaries hold invitation names and counts only (for example "The Smith Family: renamed from "The Smiths", 1 person added"), never guest names, dietary or accessibility notes, contact emails, or messages (section 5).
- A record is saved in the same database batch as the change, so a change is never saved without its record. Records are kept when an invitation is deleted.
- Admins see the latest 200 records, newest first, on the Activity page (`/admin/activity`). Records cannot be edited or deleted from the site.
- Guest RSVP submissions are not recorded here; each household keeps its confirmation code and response date.
