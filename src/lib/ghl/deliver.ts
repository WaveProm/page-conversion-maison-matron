import "server-only";
import { after } from "next/server";
import { form_fields_of } from "@/lib/form_contract/form_fields";
import { with_visit_origin } from "@/lib/gads/visit_origin";
import { type ghl_config, read_config } from "./config";
import type { delivery_outcome, delivery_result } from "./delivery_result";
import { contact_table, custom_field_table, webhook_table } from "./form_table";
import {
  custom_field_ids,
  post_form_webhook,
  type transport,
  upsert_contact,
} from "./ghl_api";
import { contact_payload_of, webhook_payload_of } from "./payloads";

export const deliver_lead = async (
  form: FormData,
  config: ghl_config,
  overrides: Partial<transport> = {},
): Promise<delivery_outcome> => {
  const keyed = form_fields_of(form, custom_field_table);
  const ids = await custom_field_ids(Object.keys(keyed), config, overrides);
  const contact = await upsert_contact(
    contact_payload_of(form_fields_of(form, contact_table), config, keyed, ids),
    config,
    overrides,
  );
  if (!contact.ok) return contact;
  const webhook = await post_form_webhook(
    webhook_payload_of(form_fields_of(form, webhook_table), contact.contact_id),
    config,
    overrides,
  );
  if (!webhook.ok) return webhook;
  return { ok: true, contact_id: contact.contact_id };
};

const report = (outcome: delivery_outcome) => {
  if (!outcome.ok) console.warn(`ghl: ${outcome.code}: ${outcome.message}`);
};

export const deliver_to_ghl = (form_data: FormData): delivery_result => {
  const config = read_config();
  if (!config.ok) return config;
  after(async () => {
    const form = await with_visit_origin(form_data);
    report(await deliver_lead(form, config.config));
  });
  return { ok: true };
};
