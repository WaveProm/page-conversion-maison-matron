import { describe, expect, it } from "vitest";
import {
  dictionary_key_schema,
  visit_origin_key_schema,
} from "@/lib/form_contract/dictionary";
import type { ghl_config } from "../config";
import { custom_field_table } from "../form_table";
import { contact_payload_of, webhook_payload_of } from "../payloads";

const config: ghl_config = {
  api_token: "t",
  location_id: "loc_1",
  form_webhook_url:
    "https://services.leadconnectorhq.com/hooks/loc_1/webhook-trigger/hook_1",
};

describe("contact_payload_of", () => {
  it("carries the location and the fields, the free text as a custom field only with a field id", () => {
    const fields = {
      firstName: "Jane",
      email: "jane@example.com",
      freetext: "Hi",
    };
    expect(
      JSON.parse(JSON.stringify(contact_payload_of(fields, config))),
    ).toEqual({
      locationId: "loc_1",
      firstName: "Jane",
      email: "jane@example.com",
    });
    expect(
      contact_payload_of(fields, { ...config, freetext_field_id: "field_1" })
        .customFields,
    ).toEqual([{ id: "field_1", fieldValue: "Hi" }]);
  });
});

describe("contact_payload_of with fields addressed by their fieldKey", () => {
  it("adds one item per custom field after the free text, under the id resolved for its fieldKey, and skips a field without id", () => {
    expect(
      contact_payload_of(
        { email: "jane@example.com", freetext: "Hi" },
        { ...config, freetext_field_id: "field_1" },
        {
          "contact.gclid_google": "TEST-CLIC-001",
          "contact.gbraid": "BRAID-G",
          "contact.page_de_provenance": "accueil",
        },
        new Map([
          ["contact.gclid_google", "id_gclid"],
          ["contact.page_de_provenance", "id_page"],
        ]),
      ).customFields,
    ).toEqual([
      { id: "field_1", fieldValue: "Hi" },
      { id: "id_gclid", fieldValue: "TEST-CLIC-001" },
      { id: "id_page", fieldValue: "accueil" },
    ]);
    expect(
      contact_payload_of({}, config, { "contact.gbraid": "BRAID-G" })
        .customFields,
    ).toBeUndefined();
  });
});

describe("custom_field_table", () => {
  it("maps the nine visit origin keys of the dictionary on the nine contact fields, by fieldKey", () => {
    expect(custom_field_table).toEqual({
      "contact.gclid_google": "gclid",
      "contact.gbraid": "gbraid",
      "contact.wbraid": "wbraid",
      "contact.fbclid": "fbclid",
      "contact.utm_source": "utm_source",
      "contact.utm_campaign": "utm_campaign",
      "contact.utm_content": "utm_content",
      "contact.utm_term": "utm_term",
      "contact.page_de_provenance": "source_page",
    });
    expect(new Set(Object.values(custom_field_table))).toEqual(
      new Set(visit_origin_key_schema.options),
    );
  });
});

describe("webhook_payload_of", () => {
  it("carries the contact id, then every key of the dictionary in snake_case, a blank key as an empty string", () => {
    expect(
      webhook_payload_of(
        {
          given_name: "Jane",
          email: "jane@example.com",
          address_level2: "Genève",
          freetext: "first\n\nsecond",
          gclid: "TEST-CLIC-001",
          source_page: "accueil",
        },
        "contact_1",
      ),
    ).toEqual({
      contact_id: "contact_1",
      given_name: "Jane",
      family_name: "",
      email: "jane@example.com",
      tel: "",
      organization: "",
      postal_code: "",
      address_level2: "Genève",
      freetext: "first\n\nsecond",
      gclid: "TEST-CLIC-001",
      gbraid: "",
      wbraid: "",
      fbclid: "",
      utm_source: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      source_page: "accueil",
    });
  });

  it("follows the dictionary: one key per dictionary key, so a key added there leaves without another change", () => {
    expect(Object.keys(webhook_payload_of({}, "contact_1"))).toEqual([
      "contact_id",
      ...dictionary_key_schema.options.map((key) => key.replaceAll("-", "_")),
    ]);
    expect(Object.values(webhook_payload_of({}, "contact_1")).slice(1)).toEqual(
      dictionary_key_schema.options.map(() => ""),
    );
  });
});
