## 0. Kill switches

Each module has one switch: `MAIL_ENABLED`, `META_CAPI_ENABLED`, `GHL_ENABLED`, `WHATSAPP_ENABLED` and `GADS_ENABLED`. A switch accepts `true` or `false`. Absent or empty means enabled. Any other value keeps the module off and logs a warning.

Locally, the switches are read from `.env` and `.env.local`. Git ignores both (`.env*` in `.gitignore`), so a push never carries them. Keep the four services at `false`; `GADS_ENABLED` calls no service and stays at `true`. For a deliberate local test, set one to `true`, run the test, then set it back to `false` right after.

In production, the switches are read from the Vercel project's variables, not from a file.

# scaffold-nextjs-meta

A Next.js 16 scaffold with four server modules, Meta Conversions API, GoHighLevel, Nodemailer and WhatsApp Cloud API, for a conversion page. This README is the manual of the agent that builds and maintains a project from it: a consultant never sees this repository, only the agent does. One form submission leaves the server four times: hashed to Meta (Conversions API), in clear to GoHighLevel (a contact, then the whole form to the webhook of a workflow, which opens the opportunity), by mail (a confirmation to the lead, a copy of the whole form to the domain's inbox), and by WhatsApp (one template message per configured number, every field in its variables). One module per service, one public function each, one kill switch each. No pixel, no client code in the modules.

## 1. Start

```sh
gh repo create <name> --template s-e-r-n/scaffold-nextjs-meta --private --clone
cd <name> && npm pkg set name=<name> && npm run bootstrap
```

`bootstrap` installs the dependencies, creates `.env` from the example when absent, then runs `verify`: types, lint, no comments, unit tests, build. Green means the tree works.

## 2. Configure

```sh
cp .env.example .env
```

`.env*` is ignored by git, production reads the host environment. Each module has a switch: `false` makes it inert, absent means on. Keep the four services at `false` while you build, flip one to `true` to test against the real service. `next dev` reloads `.env` without a restart.

| Module | Switch              | Variables                                                                                                                                                         |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meta   | `META_CAPI_ENABLED` | `META_CAPI_DATASET_ID`, `META_CAPI_ACCESS_TOKEN`, `META_CAPI_GRAPH_VERSION` (`v25.0`), `META_CAPI_PHONE_COUNTRY` (optional, ISO 3166-1 alpha-2 of the site)       |
| GHL    | `GHL_ENABLED`       | `GHL_API_TOKEN`, `GHL_LOCATION_ID`, `GHL_FORM_WEBHOOK_URL` (the URL of the workflow's Inbound Webhook trigger), `GHL_FREETEXT_FIELD_ID` (optional, the custom field for the free text) |
| Mail   | `MAIL_ENABLED`      | `SMTP_HOST`, `SMTP_PORT` (`465`, or `587` for STARTTLS), `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `MAIL_INBOX` (the domain mailbox, receives the copy)          |
| WhatsApp | `WHATSAPP_ENABLED` | `WHATSAPP_BUSINESS_TOKEN`, `WHATSAPP_MODEL` (the template name), `WHATSAPP_DISPATCH_NUMBER_1`, `WHATSAPP_DISPATCH_NUMBER_2` (optional), each number sent as written, `41766359652` |
| Gads     | `GADS_ENABLED`      | none for the visit origin, `.env.example` sets the switch to `true`; for the calls, the three or none: `NEXT_PUBLIC_GADS_TAG_ID` (`AW-000000000`), `NEXT_PUBLIC_GADS_CALL_SEND_TO` (`AW-000000000/exemple`), `NEXT_PUBLIC_GADS_CALL_NUMBER` (the number as the site shows it, `+41 00 000 00 00`) |
| Limit  | `NODE_ENV`          | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: 20 submissions per IP per 24 hours, counted in Upstash Redis in production only; `RATE_LIMIT_ALLOWED_IPS`, exact IPs never counted, comma-separated; missing or failing, the submission goes through |

GHL and mail have no `misconfigured` code: a missing value is refused by the service and logged. Meta and WhatsApp log `misconfigured` on every submission. Configure and test a module before production.

## 3. Build the form

A field is `<Field name="…" label="…" />`. Its `name` is a key of the dictionary, the only names the modules read. The key sets the input, the keyboard and the autofill, the page sets the rest. The label stands before the control, `className` lands on the `div` around both.

| `name`           | Renders | Meta | GHL           | Mail copy   |
| ---------------- | ------- | ---- | ------------- | ----------- |
| `given-name`     | text    | `fn` | `firstName`   | Prénom      |
| `family-name`    | text    | `ln` | `lastName`    | Nom         |
| `email`          | email   | `em` | `email`       | E-mail      |
| `tel`            | tel     | `ph` | `phone`       | Téléphone   |
| `organization`   | text    | -    | `companyName` | Entreprise  |
| `postal-code`    | text    | `zp` | `postalCode`  | Code postal |
| `address-level2` | text    | `ct` | `city`        | Localité    |
| `freetext`       | text    | -    | custom field  | Message     |

Several inputs may share `freetext`, their values arrive joined by a blank line. An input with any other `name` reaches no module but WhatsApp. A new key is one line in `src/lib/form_contract/dictionary.ts` and one row in the table of each module that wants it.

The dictionary also holds nine house keys no visitor types, the visit origin: `gclid`, `gbraid`, `wbraid`, `fbclid`, `utm_source`, `utm_campaign`, `utm_content`, `utm_term`, `source_page`. The gads script writes them as hidden inputs in every form, a page never declares them and `Field` does not take them. Only the GHL table reads them; Meta, the mail and WhatsApp ignore them.

WhatsApp reads no table: every named input fills the next variable of the template, in the order of the page, and `form_id` fills the last one. The client's template is written in that order, with one variable per input plus one for the id, from 1 to 46 variables. A form and a template that disagree are refused by Meta with code `132000` and logged.

The fields go inside the page's `LeadForm`, the one client component: it calls the page's action, and renders `failure` when the submission fails. On submit it checks the lead against the page's `_lib/lead.ts`, the one Zod schema of its six fields, all required and `email` a valid email: a wrong lead never leaves, and each `Field` shows its error under its input. `form_id` is required: it names the form, lands on the `id` of the `<form>` and is bound to the page's `submit_lead` as its first argument, so the WhatsApp message says which page the lead came from, `luxe` for `/`.

```tsx
import { Field } from "./_components/field";
import { LeadForm } from "./_components/lead_form";

<LeadForm
  form_id="contact"
  className="flex flex-col gap-3"
  failure={<p role="alert">L'envoi a échoué, réessayez dans un instant.</p>}
>
  <Field name="given-name" label="Prénom" className="flex flex-col gap-1" />
  <Field name="email" label="E-mail" className="flex flex-col gap-1" />
  <Field name="freetext" label="Message" className="flex flex-col gap-1" />
  <button type="submit">Envoyer</button>
</LeadForm>;
```

Each page carries its own form, `src/app/page.tsx` for `/`, and its own confirmation page, `src/app/confirmation/page.tsx`, where a success lands. A confirmation route is named `/confirmation` under the page's own path: `/confirmation` for `/`.

## 4. Plug the services

Each page's `actions.ts`, `src/app/actions.ts` for `/`, is the only place its form meets a module: one call per service.

```ts
"use server";

import { redirect } from "next/navigation";
import { deliver_to_ghl } from "@/lib/ghl/deliver";
import { send_confirmation } from "@/lib/mail/send";
import { capture } from "@/lib/meta_capi/capture";
import { lead_submission_allowed } from "@/lib/rate_limit/submission_limit";
import { dispatch_to_whatsapp } from "@/lib/whatsapp_dispatch/dispatch";
import { valid_lead } from "./_lib/lead";

export const submit_lead = async (
  form_id: string,
  form_data: FormData,
): Promise<{ status: "failed" }> => {
  if (!valid_lead(form_data)) return { status: "failed" };
  if (!(await lead_submission_allowed())) return { status: "failed" };
  const dispatch = dispatch_to_whatsapp(form_data, form_id);
  await capture("Lead", form_data);
  deliver_to_ghl(form_data);
  const confirmation = await send_confirmation(form_data);
  await dispatch;
  if (!confirmation.ok && confirmation.code !== "disabled")
    return { status: "failed" };
  redirect("/confirmation");
};
```

| Service  | Call                                                                    | Before the response                                                      | After the response, in `after()`                | Returns                                           |
| -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------- |
| Limit    | `await lead_submission_allowed()` first                                 | counts the IP in Upstash, in production only                             | nothing                                         | `false` above 20 per 24 hours, the submission fails |
| WhatsApp | `dispatch_to_whatsapp(form_data, form_id)` next, `await dispatch` last  | posts one template message per number at once, awaited before both exits | nothing                                         | `{ ok: true, sends }`, one per number, never read |
| Meta     | `await capture("Lead", form_data)`                                      | writes the `meta_identity` cookie                                        | sends the event, three attempts                 | `{ ok: true }` when scheduled                     |
| GHL      | `deliver_to_ghl(form_data)`                                             | nothing                                                                  | reads the ids of the custom fields, upserts the contact with the visit origin, then posts the whole form to the workflow webhook | `{ ok: true }` when scheduled                     |
| Mail     | `await send_confirmation(form_data)`                                    | sends the confirmation to the lead, waits                                | mails the whole form to `MAIL_INBOX`            | the confirmation's own result                     |

Only the confirmation mail decides the visitor's fate: sent means `/confirmation`, a switched-off mail module too, anything else means `{ status: "failed" }` and the form stays. WhatsApp never changes it: its sends leave right after the rate limit, run beside Meta and the mail, and are awaited so that no send depends on `after()` or on the host keeping the function alive; the visitor waits at most the 10 s timeout beyond the mail. The copy to the inbox is the safety net: what GHL missed is entered by hand from it, and a switched-off mail module sends neither the confirmation nor the copy.

Unplug a service: delete its call. Remove it: delete its call, its folder under `src/lib/`, its variables. Nothing else knows it exists. The Meta events are `Lead`, `CompleteRegistration`, `Schedule`, `PageView`, in `src/lib/meta_capi/event_dictionary.ts`; a site with a single conversion sends `Lead`. `PageView`, in `src/components/page_view.tsx`, is mounted by the root layout, `src/app/layout.tsx`, and sends one per full page load.

Gads is called by no action: `submit_lead` stays as it is. It is plugged in three places.

| Where                    | Call                                                           | When                            | What it does                                                                                                                                             |
| ------------------------ | -------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/proxy.ts`           | `origin_proxy(request, identity_proxy(request))`               | every matched request           | when the URL carries one of the parameters, replaces the `visit_origin` cookie: first-party, `HttpOnly`, `SameSite=Lax`, 90 days, `Secure` in production |
| `src/app/layout.tsx`     | `<VisitOrigin />`, an inline script through `next/script`      | every route, once per page load | reads the URL, keeps the origin in `sessionStorage.visit_origin`, appends it as hidden inputs to every `<form>`                                          |
| `src/lib/ghl/deliver.ts` | `await with_visit_origin(form_data)`, inside the GHL `after()` | every submission                | completes a copy of the form: the value of the form first, the cookie for a key the form leaves blank                                                    |

| Key            | Read from                                                | GHL contact field, by `fieldKey` |
| -------------- | -------------------------------------------------------- | -------------------------------- |
| `gclid`        | `gclid`, else `lnid`, which never travels under its name | `contact.gclid_google`           |
| `gbraid`       | `gbraid`, never copied into `gclid`                      | `contact.gbraid`                 |
| `wbraid`       | `wbraid`, never copied into `gclid`                      | `contact.wbraid`                 |
| `fbclid`       | `fbclid`                                                 | `contact.fbclid`                 |
| `utm_source`   | `utm_source`                                             | `contact.utm_source`             |
| `utm_campaign` | `utm_campaign`                                           | `contact.utm_campaign`           |
| `utm_content`  | `utm_content`                                            | `contact.utm_content`            |
| `utm_term`     | `utm_term`                                               | `contact.utm_term`               |
| `source_page`  | the route the form is sent from                          | `contact.page_de_provenance`     |

Last click wins: an arrival carrying at least one of the eight parameters, or `lnid`, replaces the whole stored set, in the browser and in the cookie; an arrival carrying none keeps it. A value is trimmed, a blank one or one over 500 characters is dropped. `source_page` is the path in lower case, without accent or outer slash, `accueil` for `/`: the script names it from `location.pathname`, the server from the `referer` when the form carries none. The script looks at the URL again at every DOM mutation, on `popstate` and right before a submit, so a form rendered later and a client navigation are covered. No capture waits for a consent and there is no GTM.

The nine values leave in the contact upsert itself. GoHighLevel ignores a custom field addressed by its key, so the GHL module first reads `GET /locations/{GHL_LOCATION_ID}/customFields?model=contact` (`Version: 2021-07-28`), finds the id of each `fieldKey` and sends `{ id, fieldValue }`: no id and no variable per field. A field absent from the location is skipped and logged, `ghl: custom fields absent from the location: contact.gbraid`, a list that cannot be read is logged too, and in both cases the contact is delivered. The nine fields are created once per location in GoHighLevel, type text, with exactly these keys.

After a successful upsert, the GHL module posts the whole form as JSON to `GHL_FORM_WEBHOOK_URL`, the wide net a GoHighLevel workflow starts from. The module opens no opportunity: the workflow does, and it sends the conversion to Google Ads from the `gclid` of the request.

| Key of the body                                                                                         | Value                                                                              |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `contact_id`                                                                                            | the id the upsert returned                                                         |
| `given_name`, `family_name`, `email`, `tel`, `organization`, `postal_code`, `address_level2`, `freetext` | the field keys of the dictionary, their dashes written as underscores              |
| `gclid`, `gbraid`, `wbraid`, `fbclid`, `utm_source`, `utm_campaign`, `utm_content`, `utm_term`, `source_page` | the visit origin, the form value first, the cookie for a blank key                 |

Every key is always present, a blank one as `""`, so the workflow maps a stable shape. The body follows the dictionary: a key added to `src/lib/form_contract/dictionary.ts` leaves in the webhook without another change. Copy the URL from the workflow in GoHighLevel: Automation, the workflow, its trigger `Inbound Webhook`, the URL it shows, into `GHL_FORM_WEBHOOK_URL`. The URL is the only credential of the webhook: the token is never sent to it and the URL is never logged. No webhook leaves when the upsert failed; a blank or malformed URL is logged `ghl: refused: GHL_FORM_WEBHOOK_URL is not a URL` after the contact is delivered.

A call to the number the site shows, by a visitor come from an ad, is a conversion Google Ads measures by its own tag: it replaces the number with a forwarding number. `<GoogleTag />` in `src/app/layout.tsx` loads `gtag.js` on every route and runs Google's snippet, only when the three variables are set.

| Variable                        | Example, not a real value | What it is                                                                                    | Where to copy it from in Google Ads                                      |
| ------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_GADS_TAG_ID`       | `AW-000000000`            | the id of the Google tag, `gtag('config', id)`                                                | the conversion action "Calls to a phone number on your website", its tag |
| `NEXT_PUBLIC_GADS_CALL_SEND_TO` | `AW-000000000/exemple`    | the tag id, a slash, the label of the conversion, `gtag('config', send_to, { ... })`          | the same snippet                                                         |
| `NEXT_PUBLIC_GADS_CALL_NUMBER`  | `+41 00 000 00 00`        | the number exactly as the site shows it, sent as `phone_conversion_number`                    | the site itself                                                          |

The three or nothing: with none set there is no tag and no request to Google, a site that sets none is unchanged. One or two set, or a value of the wrong shape, is no tag either and logs `gads: no Google tag, invalid or missing environment variables: ...`. The values are public, they are printed in the page: they go in the site's environment, never in the code. There is no consent banner in v0.

Sur ce site, le numéro est écrit à la main dans les huit `CallToAction` de `src/app/page.tsx`, en texte `+41 21 539 46 75` et en lien `tel:+41215394675`, exactement la valeur de `NEXT_PUBLIC_GADS_CALL_NUMBER` : les deux doivent rester égaux. L'aide Google Ads dit qu'un numéro cliquable se remplace par un rappel : la balise du site passe donc un `phone_conversion_callback`, `forwarding_number_in_links` dans `src/lib/gads/google_tag.ts`, qui écrit le numéro de transfert dans le `href` et dans le texte de chaque lien dont le `href` est le `tel:` de la variable. Le scaffold n'a pas ce rappel.

Check it on the site, with the three real values set: open a page ending in `#google-wcc-debug`, which forces the forwarding number to show. The text and the `tel:` link both carry the forwarding number, and Google's debug panel says why when they do not.

Unplug gads: delete `<VisitOrigin />`, `<GoogleTag />`, the `origin_proxy` call and the `with_visit_origin` call. Remove it: also its folder, `src/components/visit_origin.tsx` and `google_tag.tsx`, the nine keys of the dictionary and `custom_field_table`. `GADS_ENABLED=false` makes it inert: no script, no tag, no cookie, and the nine keys are stripped from what GHL receives.

## 5. Read a result

Every public function returns a result and never throws.

| Result                  | Meaning                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `{ ok: true, ... }`     | scheduled, or sent for the confirmation mail (`message_id`)                                    |
| `code: "refused"`       | the service said no, retrying is pointless: bad token, rejected recipient, invalid field       |
| `code: "unreachable"`   | no usable answer: timeout (10 s per GHL, SMTP or WhatsApp step, 5 s per Meta attempt), network, 5xx, 429 |
| `code: "disabled"`      | the switch is `false`                                                                          |
| `code: "misconfigured"` | Meta and WhatsApp, a variable is missing                                                       |
| `code: "blocked"`       | WhatsApp only, outside production, the guard kept the message from leaving                     |

A failure of the deferred work is logged with `console.warn`, prefixed by the module: `meta_capi:`, `ghl:`, `mail:`, `whatsapp:`, `gads:`. Outside production, a Meta conversion without any matching identifier beyond the IP and the user agent throws, so a broken proxy matcher or a misnamed input surfaces at once.

## 6. Test

| Command          | What it does                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `npm test`       | Vitest, `.env` loaded, one test per decision, network mocked                                   |
| `npm run verify` | typecheck, lint, comments, test, build, in order                                               |

Outside production, the guard in `src/lib/whatsapp_dispatch/cloud_api.ts` lets a message leave only with `WHATSAPP_LIVE_TEST=1` and `41766359652` as recipient, the only number a test may ever reach: `verify` and `next dev` on a client's `.env` send nothing. The one live test, a paid send, runs on the command line, with `WHATSAPP_BUSINESS_TOKEN` in `.env`, and sends the template `maisonmatron` once:

```sh
WHATSAPP_LIVE_TEST=1 npx vitest run src/lib/whatsapp_dispatch/tests/cloud_api.live.test.ts
```

## 7. Where things are

```
src/lib/form_contract/   the dictionary and the loop every module reads the form with
src/lib/meta_capi/       capture.ts is the entry, user_data_keys.ts holds its table
src/lib/ghl/             deliver.ts is the entry, form_table.ts holds its three tables, payloads.ts the two bodies, of the upsert and of the webhook
src/lib/gads/            visit_origin.ts is the entry at submission, origin_rule.ts the rule both sides run, origin_proxy.ts the cookie, origin_script.ts the inline script, google_tag.ts the Google tag of the call conversion
src/lib/mail/            send.ts is the entry, form_table.ts holds its table, messages.ts the two mails
src/lib/whatsapp_dispatch/ dispatch.ts is the entry, cloud_api.ts the call, the body and the guard outside production
src/components/          logo_rows.tsx, page_view.tsx, visit_origin.tsx, google_tag.tsx
src/app/global-not-found.tsx   the 404 of the site, with its own stylesheet
src/app/                 the page served at /: layout.tsx, globals.css, page.tsx, actions.ts, confirmation/page.tsx, _components/ with field.tsx, lead_form.tsx and its sections
public/                  brand/, fabric-logos/, textures/, video/ and visuals/, one file per asset
src/proxy.ts             mints the Meta identity cookies and the visit origin cookie on every request
```

In each module: `kill_switch.ts` reads the switch, `config.ts` the variables, every file imports `server-only`, the tests sit in `tests/`. The gads script reaches the browser as the source of two server functions, `origin_of_search` and `page_name_of`, so they stay self-contained: no import, no helper of the file used inside them. The mail texts live in `src/lib/mail/messages.ts`, in French, to adjust per site.

## 8. Meta in one table

Four cookies, `HttpOnly`, `SameSite=Lax`, `Path=/`, 90 days, `Secure` in production.

| Cookie          | Content                                 | Written by                                       |
| --------------- | --------------------------------------- | ------------------------------------------------ |
| `_fbp`          | `fb.1.<ms>.<random>`                    | the proxy, once, when absent                     |
| `_fbc`          | `fb.1.<ms>.<fbclid>`                    | the proxy, when the URL carries a newer `fbclid` |
| `external_id`   | a UUID, sent in clear                   | the proxy, once, when absent                     |
| `meta_identity` | every hashed `user_data` key met so far | `capture`, from a server action, when it changes |

Form values are normalised then hashed with SHA-256 (`em`, `ph`, `fn`, `ln`, `ct`, `zp`, `country`); `external_id`, IP, user agent, `fbc`, `fbp` travel in clear. The `event_id` is computed once per call and reused on every attempt, so Meta deduplicates a retry. The access token travels in the JSON body, never in the URL.

## 9. Stack

Next 16 App Router, React Compiler, Tailwind 4 with `cn()` from `@/lib/utils`, Biome with the house rules as errors, Cache Components, typed routes, Vitest, Nodemailer 10, zod. `src/instrumentation.ts` reports every server error with its route. Framework docs of the installed version: `node_modules/next/dist/docs/`, see `AGENTS.md`.

| Command                  | What it does                                            |
| ------------------------ | ------------------------------------------------------- |
| `npm run dev`            | dev server on port 3000                                 |
| `npm run typecheck`      | `next typegen && tsc --noEmit`, the only judge of types |
| `npm run lint`           | Biome check                                             |
| `npm run format`         | Biome write: formatting, safe fixes, import sorting     |
| `npm run check:comments` | fails on any comment in `src/`                          |
| `npm run build`          | where Cache Components enforces its rules               |

## 10. Decisions and versions

`project-level-past-decisions-log.md` holds every problem that forced a decision. Read it before changing a rule of a module. `ghl_mail_design_doc.md` is the design the GHL and mail modules were built from; the opportunity it describes is now opened by the GoHighLevel workflow.

A release is a tag and a GitHub release, the `template` field of `package.json` names the version a project was created from:

```sh
npm pkg set template=scaffold-nextjs-meta@1.1.0 && git commit -am "Release 1.1.0" && git tag v1.1.0 && git push --follow-tags && gh release create v1.1.0 --generate-notes
```
