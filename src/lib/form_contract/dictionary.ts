import { z } from "zod";

export const field_key_schema = z.enum([
  "given-name",
  "family-name",
  "email",
  "tel",
  "organization",
  "postal-code",
  "address-level2",
  "freetext",
]);

export const visit_origin_key_schema = z.enum([
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "utm_source",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "source_page",
]);

export const dictionary_key_schema = z.enum([
  ...field_key_schema.options,
  ...visit_origin_key_schema.options,
]);

export type field_key = z.infer<typeof field_key_schema>;
export type visit_origin_key = z.infer<typeof visit_origin_key_schema>;
export type dictionary_key = z.infer<typeof dictionary_key_schema>;
