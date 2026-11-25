# SSOP gads

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| dictionary key | the `name` of an input, typed by the page for a field, written by the script for a visit origin | `Field`, every table, the WhatsApp filter | type checker, `field_key_schema`, `visit_origin_key_schema`, `dictionary_key_schema` in `src/lib/form_contract/dictionary.ts` | `field_key` (the eight typed keys), `visit_origin_key` (the nine house keys), `dictionary_key` their union | a `Field` named after a visit origin key, a table reading a key no input carries |
| arrival URL | `location.search` in the browser, `request.nextUrl.search` in the proxy | `sessionStorage`, the `visit_origin` cookie | `origin_of_search(search)` in `src/lib/gads/origin_rule.ts`, the one rule both sides run | a canonical query string of at most eight keys in dictionary order, `""` when the URL carries none | `lnid` kept under its name, `gbraid` or `wbraid` copied into `gclid`, a blank value, a value over 500 characters, a key outside the eight |
| stored origin | `sessionStorage.visit_origin`, the `visit_origin` cookie, both writable by the visitor | the hidden inputs, the completed form | `origin_of_search(stored)` again, the canonical form is its own fixed point | the same canonical query string | a tampered store injecting a key or an oversized value |
| route of the form | `location.pathname` in the browser, the form value then the `referer` path on the server | `source_page` | `page_name_of(pathname)` in `src/lib/gads/origin_rule.ts` | lower case, no accent, no leading or trailing slash, `accueil` for `/` | `/`, an upper case or accented route reaching GoHighLevel |
| `GADS_ENABLED`, `NODE_ENV` | `process.env` | the proxy, the script, the completed form | `parse_config(env)` in `src/lib/gads/config.ts` over `module_enabled(env)` in `kill_switch.ts`, `z.enum(["true", "false"])`, absent or blank is `true` | `{ ok: true, config: { secure_cookie: boolean } } \| { ok: false, code: "disabled", message }` | `"yes"` switching the module on, a cookie without `Secure` in production |
| submitted form | `FormData` of the server action, the cookie, the `referer` header | `form_fields_of(form, custom_field_table)` in the GHL module | `form_with_origin(submission, enabled)` in `src/lib/gads/visit_origin.ts` | a new `FormData`: every entry of the form, each of the eight keys the form leaves blank filled from the cookie, `source_page` named by the rule; without the nine keys when the module is off | the caller's `FormData` mutated, a cookie value replacing a form value, an origin delivered while the switch is off |
| GHL custom fields | `form_fields_of(form, custom_field_table)` | `contact_payload` | by construction | `Partial<Record<custom_field_key, string>>`, the key is the `fieldKey` of the contact field | a field id or an environment variable per tracking field |
| GHL upsert body | `contact_payload_of(fields, custom_fields, config)` | `POST /contacts/upsert` | by construction | `customFields?: Array<{ id, fieldValue } \| { key, fieldValue }>`, `key` is the `fieldKey` without its `contact.` prefix | an item carrying both or neither of `id` and `key` |
| GHL upsert answer | `fetch` response | `upsert_contact` | `upsert_response_schema` in `src/lib/ghl/ghl_api.ts`, `contact.customFields` optional, `[{ id, value }]` | the contact id and the values the contact now carries | a keyed field reported delivered when the answer does not carry its value |
| GHL custom field list | `fetch` response of `GET /locations/{id}/customFields?model=contact` | the second upsert | `custom_fields_response_schema` in `src/lib/ghl/ghl_api.ts`, `{ customFields: [{ id, fieldKey }] }` | `Map<fieldKey, id>` | a field absent from the location sent to the upsert, the contact failing for it |
| browser page | `window`, handed to the inline script | `keep_origin_in_forms` | by construction, the function names the few members it reads | `{ document, location, sessionStorage, MutationObserver, addEventListener }` | a module file importing a client bundle |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `field_key_schema`, `visit_origin_key_schema`, `dictionary_key_schema` and their types | - | - | `z.enum`, types | `src/lib/form_contract/dictionary.ts` |
| `module_enabled` | - | `(env?)` | `boolean` | `src/lib/gads/kill_switch.ts` |
| `parse_config`, `read_config`, `gads_config` | `module_enabled` | `parse_config(env)` | `{ ok: true, config: gads_config } \| disabled` | `src/lib/gads/config.ts` |
| `origin_of_search`, `page_name_of`, `stored_origin_keys` | `visit_origin_key` | `origin_of_search(search: string)`, `page_name_of(pathname: string)` | `string`, `string` | `src/lib/gads/origin_rule.ts` |
| `origin_cookie_name`, `origin_cookie_options` | - | `origin_cookie_options(secure: boolean)` | cookie options, 90 days | `src/lib/gads/origin_cookie.ts` |
| `origin_proxy` | `read_config`, `origin_of_search`, `origin_cookie_name`, `origin_cookie_options` | `origin_proxy(request, response?)` | `NextResponse` | `src/lib/gads/origin_proxy.ts` |
| `keep_origin_in_forms`, `origin_script` | `read_config`, `origin_of_search`, `page_name_of`, `stored_origin_keys` | `origin_script()` | `string \| undefined`, the inline script | `src/lib/gads/origin_script.ts` |
| `with_visit_origin`, `form_with_origin` | `read_config`, `origin_of_search`, `page_name_of`, `stored_origin_keys`, `origin_cookie_name` | `with_visit_origin(form_data: FormData)` | `Promise<FormData>` | `src/lib/gads/visit_origin.ts` |
| `VisitOrigin` | `origin_script` | - | JSX | `src/components/visit_origin.tsx` |
| `custom_field_table`, `custom_field_key`, `custom_fields` | `dictionary_key` | - | `Record<custom_field_key, dictionary_key>` | `src/lib/ghl/form_table.ts` |
| `contact_payload`, `contact_payload_of`, `custom_field_item` | `custom_fields`, `ghl_config` | `contact_payload_of(fields, custom_fields, config)` | the upsert body | `src/lib/ghl/payloads.ts` |
| `upsert_contact` | `contact_payload`, `ghl_config`, `delivery_failure` | `(payload, config, overrides?)`, unchanged | `Promise<contact_result>`, unchanged | `src/lib/ghl/ghl_api.ts` |
| `deliver_to_ghl`, `deliver_lead` | `with_visit_origin`, `form_fields_of`, `custom_field_table`, `contact_payload_of`, `upsert_contact` | `deliver_to_ghl(form_data)`, unchanged | `delivery_result`, unchanged | `src/lib/ghl/deliver.ts` |
| `dispatch_to_whatsapp` | `visit_origin_key_schema` | unchanged | unchanged | `src/lib/whatsapp_dispatch/dispatch.ts` |
| `Field` | `field_key` | unchanged | JSX | `src/components/field.tsx` |
| `proxy` | `identity_proxy`, `origin_proxy` | `(request)` | `NextResponse` | `src/proxy.ts` |
| `RootLayout` | `VisitOrigin`, `PageView` | `LayoutProps<"/">` | JSX | `src/app/layout.tsx` |

Edges: `config` needs `kill_switch`; `origin_rule` needs `dictionary`; `origin_proxy`, `origin_script` and `visit_origin` need `config`, `origin_rule` and, but for the script, `origin_cookie`; `VisitOrigin` needs `origin_script`; `ghl/form_table` needs `dictionary`; `ghl/payloads` needs `ghl/form_table`; `ghl/ghl_api` needs `ghl/payloads`; `ghl/deliver` needs `visit_origin`, `ghl/form_table`, `ghl/payloads`, `ghl/ghl_api`; `whatsapp_dispatch/dispatch` and `Field` need `dictionary`; `proxy` needs `origin_proxy`; `RootLayout` needs `VisitOrigin`.

Sort:

1. `dictionary`, `gads/kill_switch`, `gads/origin_cookie`
2. `gads/config`, `gads/origin_rule`, `ghl/form_table`, `whatsapp_dispatch/dispatch`, `Field`
3. `gads/origin_proxy`, `gads/origin_script`, `gads/visit_origin`, `ghl/payloads`
4. `VisitOrigin`, `proxy`, `ghl/ghl_api`
5. `RootLayout`, `ghl/deliver`

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `form_contract/dictionary` | which keys a form may carry, and which of them a visitor types | three enums, a field key is typed by the visitor, a visit origin key is written by the script |
| `gads/kill_switch` | how `GADS_ENABLED` is read | `module_enabled(env?)`, absent means on |
| `gads/config` | what the module reads from the environment | `read_config()` answers `disabled` or the cookie's `Secure` flag |
| `gads/origin_rule` | which URL parameters make a visit origin, the `lnid` fallback, the value bound, how a route becomes a page name | `origin_of_search(search)` returns the canonical query string, `""` for none, and is its own fixed point; `page_name_of(pathname)`; both are self-contained, they run in the browser from their source |
| `gads/origin_cookie` | the name and the lifetime of the server side store | a name and its options |
| `gads/origin_proxy` | when the server side store is written | `origin_proxy(request, response?)` returns the response, with the cookie replaced when the URL carries an origin |
| `gads/origin_script` | how the browser keeps the origin for the visit and places it in the forms, and which events make it look again | `origin_script()` returns the inline script, `undefined` when the module is off |
| `gads/visit_origin` | how the form and the cookie are reconciled at submission | `with_visit_origin(form_data)` returns a new `FormData`, never throws, reads the request cookies and headers, so it runs in a server action or its `after()` |
| `ghl/form_table` | which dictionary key lands on which GHL field | `custom_field_table`, the key is the `fieldKey` shown by GoHighLevel |
| `ghl/payloads` | the body GHL expects | `contact_payload_of(fields, custom_fields, config)` |
| `ghl/ghl_api` | how GHL takes a field addressed by its key, and what it does when one is refused or absent | `upsert_contact(payload, config, overrides?)`, unchanged: a keyed field never fails the contact |
| `ghl/deliver` | the order of the GHL calls | `deliver_to_ghl(form_data)`, unchanged |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| the origin of the visit, in the browser | `sessionStorage.visit_origin` | the inline script | the inline script, on an arrival carrying a parameter, the whole set replaced |
| the origin of the last click, for 90 days | the `visit_origin` cookie, `HttpOnly` | `with_visit_origin` | `origin_proxy`, on an arrival carrying a parameter, the whole set replaced |
| the origin of one submission | the completed `FormData` of `with_visit_origin` | the GHL table | `form_with_origin`, the form value first, the cookie for a blank key |
| the route of the form | `location.pathname` | the inline script, into `source_page` | the browser |
| the last URL the script read | a variable closed over by `keep_origin_in_forms` | the script | the script |

The browser store and the cookie hold the same fact on two sides the brief asks for.
Neither syncs the other: they meet once, at submission, under the rule of the third row.

## Amendments

- 2026-11-24: proven on a real sub-account, `POST /contacts/upsert` answers 201 to `customFields: [{ key, field_value }]` and ignores the field in silence. The upsert body keeps `customFields?: [{ id, fieldValue }]` only: `custom_field_ids(field_keys, config, overrides?)` in `src/lib/ghl/ghl_api.ts` reads `Map<fieldKey, id>` from the list of the location before the upsert, `contact_payload_of(fields, config, keyed?, ids?)` skips a field without id, `upsert_contact` is unchanged.
- 2026-11-24: the dictionary split reaches three existing files: `Field` is typed on `field_key`, the mail table test covers `field_key_schema`, `dispatch_to_whatsapp` skips the entries named by a visit origin key.
- 2026-11-24: `page_key` and `storage_key` are exported constants of `origin_rule.ts` and `origin_script.ts`; `form_without_origin(form_data)` in `visit_origin.ts` is the form of a switched-off module.
- 2026-11-24, patch decided with the human after a real test, the GoHighLevel workflow triggered by Inbound Webhook read the `gclid` of the request and Google Ads answered on it. Shapes: `GHL_FORM_WEBHOOK_URL`, `process.env`, read by `parse_config` in `src/lib/ghl/config.ts` as `form_webhook_url: string`, kept as written like the token; the webhook body, built by `webhook_payload_of(form, contact_id)` in `src/lib/ghl/payloads.ts`, is `Record<string, string>`: `contact_id`, then every key of `dictionary_key_schema.options` with its dashes turned into underscores, a blank key as `""`, so a key added to the dictionary leaves without another change; it forbids a missing key and a `File`. Order: `webhook_table` in `ghl/form_table.ts` (needs `dictionary`), `webhook_payload_of` in `ghl/payloads.ts`, `post_form_webhook(payload, config, overrides?)` in `ghl/ghl_api.ts` returning `Promise<{ ok: true } | delivery_failure>`, then `deliver_lead(form, config, overrides?)` in `ghl/deliver.ts`: ids, upsert, webhook, and no webhook when the upsert fails. Checks: `ghl/ghl_api` now confines how the workflow is reached, no token is sent to the webhook URL and the URL is never logged. Ownership: the opportunity is owned by the GoHighLevel workflow, the module no longer writes it. Removed with the human's decision: `create_opportunity`, `opportunity_result`, `opportunity_response_schema`, `opportunity_payload`, `opportunity_payload_of`, `opportunity_name_of`, `pipeline_id`, `pipeline_stage_id`, `GHL_PIPELINE_ID`, `GHL_PIPELINE_STAGE_ID`, `opportunity_id` of `delivery_outcome`.
- 2026-11-24, patch 003 decided by the human, the earlier rule "no Google tag" is reversed for one use: a call to the number shown on the site, by a visitor come from an ad, counts as a conversion. Shapes: `NEXT_PUBLIC_GADS_TAG_ID`, `NEXT_PUBLIC_GADS_CALL_SEND_TO`, `NEXT_PUBLIC_GADS_CALL_NUMBER`, `process.env`, read by `parse_call_tracking(env)` in `src/lib/gads/config.ts` through a zod schema (`AW-<digits>`, `AW-<digits>/<label>`, a non-blank number), as `{ tag_id, send_to, displayed_number } | undefined`: the three or nothing, none set is silent, a partial or malformed set warns and is nothing; it forbids a tag without its conversion, a value that is not an id reaching the script or the library URL. Order: `parse_call_tracking`, `read_call_tracking` in `gads/config.ts` (needs `kill_switch`); `google_tag()` in `gads/google_tag.ts` (needs `read_call_tracking`) returning `{ library_url, script, displayed_number, tel_href } | undefined`, the script being Google's own snippet with the three values written by `JSON.stringify`; `GoogleTag` in `src/components/google_tag.tsx`, two `next/script`, loaded by `RootLayout`; `CallNumber` in `src/components/call_number.tsx`, the link a page shows the number with. Checks: `gads/google_tag` confines what Google is told and from where the library loads; a caller knows `google_tag()` is `undefined` when a variable is missing or the module is off. Ownership: the number shown on the site is owned by `NEXT_PUBLIC_GADS_CALL_NUMBER` wherever a page renders `CallNumber`; the forwarding number is owned by Google, which writes it over the text and the `tel:` link in the browser.
- 2026-11-25, installation sur maison-matron depuis le commit cbaed82 de s-e-r-n/scaffold-nextjs-meta, les tables et les amendements ci-dessus copiés tels quels. `Field` vit dans `src/app/_components/field.tsx` et prend `field_key` à la place de sa propre liste des huit clés. `proxy` garde l'en-tête `X-Robots-Tag` de `/confirmation`, posé sur la réponse de `origin_proxy(request, identity_proxy(request))`. `RootLayout` garde sa police, ses métadonnées et `<Analytics />`, et charge `<VisitOrigin />` puis `<GoogleTag />` après `<PageView />`. Le numéro de `/` reste écrit dans les huit `CallToAction` de `src/app/page.tsx`, en texte et en lien `tel:`, que Google remplace par correspondance avec `NEXT_PUBLIC_GADS_CALL_NUMBER` : `CallNumber` arrive sans appelant, et le numéro a deux propriétaires qui doivent rester égaux, la page et la variable. Le test de la table mail couvre `field_key_schema`. La redirection de `/refection` quitte `next.config.ts`, rien ne la remplace. Le journal des décisions du site est `decisions.md`.
