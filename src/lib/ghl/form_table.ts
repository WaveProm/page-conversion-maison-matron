import "server-only";
import {
  type dictionary_key,
  dictionary_key_schema,
} from "@/lib/form_contract/dictionary";

export type contact_field =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "companyName"
  | "postalCode"
  | "city"
  | "freetext";

export type contact_fields = Partial<Record<contact_field, string>>;

export const contact_table: Record<contact_field, dictionary_key> = {
  firstName: "given-name",
  lastName: "family-name",
  email: "email",
  phone: "tel",
  companyName: "organization",
  postalCode: "postal-code",
  city: "address-level2",
  freetext: "freetext",
};

export const custom_field_table = {
  "contact.gclid_google": "gclid",
  "contact.gbraid": "gbraid",
  "contact.wbraid": "wbraid",
  "contact.fbclid": "fbclid",
  "contact.utm_source": "utm_source",
  "contact.utm_campaign": "utm_campaign",
  "contact.utm_content": "utm_content",
  "contact.utm_term": "utm_term",
  "contact.page_de_provenance": "source_page",
} satisfies Record<string, dictionary_key>;

export type custom_field_key = keyof typeof custom_field_table;

export type custom_fields = Partial<Record<custom_field_key, string>>;

const snake_case = (key: string) => key.replaceAll("-", "_");

export const webhook_table: Record<string, dictionary_key> = Object.fromEntries(
  dictionary_key_schema.options.map((key) => [snake_case(key), key]),
);
