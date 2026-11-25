import "server-only";
import type { form_fields } from "@/lib/form_contract/form_fields";
import type { ghl_config } from "./config";
import {
  type contact_fields,
  type custom_fields,
  webhook_table,
} from "./form_table";

export type custom_field_item = { id: string; fieldValue: string };

export type contact_payload = {
  locationId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  postalCode?: string;
  city?: string;
  customFields?: custom_field_item[];
};

export type webhook_payload = Record<string, string>;

const freetext_item = (
  freetext: string | undefined,
  field_id: string | undefined,
): custom_field_item[] =>
  freetext && field_id ? [{ id: field_id, fieldValue: freetext }] : [];

const keyed_items = (
  keyed: custom_fields,
  ids: Map<string, string>,
): custom_field_item[] =>
  Object.entries(keyed).flatMap(([field_key, fieldValue]) => {
    const id = ids.get(field_key);
    return id ? [{ id, fieldValue }] : [];
  });

const custom_field_items = (
  fields: contact_fields,
  config: ghl_config,
  keyed: custom_fields,
  ids: Map<string, string>,
) => {
  const items = [
    ...freetext_item(fields.freetext, config.freetext_field_id),
    ...keyed_items(keyed, ids),
  ];
  return items.length > 0 ? items : undefined;
};

export const contact_payload_of = (
  fields: contact_fields,
  config: ghl_config,
  keyed: custom_fields = {},
  ids: Map<string, string> = new Map(),
): contact_payload => ({
  locationId: config.location_id,
  firstName: fields.firstName,
  lastName: fields.lastName,
  email: fields.email,
  phone: fields.phone,
  companyName: fields.companyName,
  postalCode: fields.postalCode,
  city: fields.city,
  customFields: custom_field_items(fields, config, keyed, ids),
});

export const webhook_payload_of = (
  fields: form_fields<string>,
  contact_id: string,
): webhook_payload => ({
  contact_id,
  ...Object.fromEntries(
    Object.keys(webhook_table).map((key) => [key, fields[key] ?? ""]),
  ),
});
