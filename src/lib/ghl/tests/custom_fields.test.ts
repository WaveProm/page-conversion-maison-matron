import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ghl_config } from "../config";

vi.mock("next/server", () => ({ after: () => {} }));
vi.mock("@/lib/gads/visit_origin", () => ({
  with_visit_origin: async (form_data: FormData) => form_data,
}));

const { deliver_lead } = await import("../deliver");

const hook_url =
  "https://services.leadconnectorhq.com/hooks/loc_1/webhook-trigger/hook_1";

const config: ghl_config = {
  api_token: "SECRET-TOKEN",
  location_id: "loc_1",
  form_webhook_url: hook_url,
  freetext_field_id: "field_1",
};

const form_of = (entries: Array<[string, string]>) => {
  const form = new FormData();
  for (const [name, value] of entries) form.append(name, value);
  return form;
};

const visitor: Array<[string, string]> = [
  ["email", "jane@example.com"],
  ["freetext", "Hello"],
];

const tracked = () =>
  form_of([
    ...visitor,
    ["gclid", "TEST-CLIC-001"],
    ["gbraid", "BRAID-G"],
    ["source_page", "accueil"],
  ]);

type call = { url: string; init: RequestInit | undefined };

const answering = (steps: Array<() => Response>) => {
  const calls: call[] = [];
  const fetch_fn: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), init });
    const step = steps[calls.length - 1];
    if (!step) throw new Error("no more responses");
    return step();
  };
  return { calls, fetch: fetch_fn };
};

const body_of = (call: call | undefined) =>
  JSON.parse(String(call?.init?.body));

const headers_of = (call: call | undefined) => new Headers(call?.init?.headers);

const requests_of = (calls: call[]) =>
  calls.map((call) => `${call.init?.method} ${call.url}`);

const field_list = (listed: Array<[string, string]>) => () =>
  Response.json({
    customFields: listed.map(([id, fieldKey]) => ({
      id,
      fieldKey,
      name: fieldKey,
      dataType: "TEXT",
      model: "contact",
    })),
  });

const upserted = () => Response.json({ new: true, contact: { id: "c_1" } });

const received = () => Response.json({ status: "Success: request sent" });

const delivered = { ok: true, contact_id: "c_1" };

const list_url =
  "https://services.leadconnectorhq.com/locations/loc_1/customFields?model=contact";

const upsert_url = "https://services.leadconnectorhq.com/contacts/upsert";

const warn = vi.spyOn(console, "warn");

beforeEach(() => {
  warn.mockReset();
  warn.mockImplementation(() => {});
});

describe("deliver_lead", () => {
  it("reads the id of each fieldKey in the list of the location, and that id is the one leaving in the upsert", async () => {
    const { calls, fetch } = answering([
      field_list([
        ["id_other", "contact.pincode"],
        ["id_page", "contact.page_de_provenance"],
        ["id_gbraid", "contact.gbraid"],
        ["id_gclid", "contact.gclid_google"],
      ]),
      upserted,
      received,
    ]);
    await expect(deliver_lead(tracked(), config, { fetch })).resolves.toEqual(
      delivered,
    );
    expect(calls[0]?.init?.body).toBeUndefined();
    expect(headers_of(calls[0]).get("version")).toBe("2021-07-28");
    expect(headers_of(calls[0]).get("authorization")).toBe(
      "Bearer SECRET-TOKEN",
    );
    expect(body_of(calls[1])).toEqual({
      locationId: "loc_1",
      email: "jane@example.com",
      customFields: [
        { id: "field_1", fieldValue: "Hello" },
        { id: "id_gclid", fieldValue: "TEST-CLIC-001" },
        { id: "id_gbraid", fieldValue: "BRAID-G" },
        { id: "id_page", fieldValue: "accueil" },
      ],
    });
    expect(JSON.stringify(body_of(calls[1]))).not.toContain("contact.");
    expect(warn).not.toHaveBeenCalled();
  });

  it("upserts the contact, then posts the whole form to the webhook with the contact id, a blank key as an empty string, without the token", async () => {
    const { calls, fetch } = answering([field_list([]), upserted, received]);
    await deliver_lead(tracked(), config, { fetch });
    expect(requests_of(calls)).toEqual([
      `GET ${list_url}`,
      `POST ${upsert_url}`,
      `POST ${hook_url}`,
    ]);
    expect(body_of(calls[2])).toEqual({
      contact_id: "c_1",
      given_name: "",
      family_name: "",
      email: "jane@example.com",
      tel: "",
      organization: "",
      postal_code: "",
      address_level2: "",
      freetext: "Hello",
      gclid: "TEST-CLIC-001",
      gbraid: "BRAID-G",
      wbraid: "",
      fbclid: "",
      utm_source: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      source_page: "accueil",
    });
    expect(headers_of(calls[2]).get("content-type")).toBe("application/json");
    expect(headers_of(calls[2]).get("authorization")).toBeNull();
  });

  it("posts no webhook when the upsert is refused or unreachable", async () => {
    for (const status of [422, 503]) {
      const { calls, fetch } = answering([
        field_list([]),
        () => Response.json({ statusCode: status, message: "no" }, { status }),
      ]);
      await expect(
        deliver_lead(tracked(), config, { fetch }),
      ).resolves.toMatchObject({ ok: false });
      expect(requests_of(calls)).toEqual([
        `GET ${list_url}`,
        `POST ${upsert_url}`,
      ]);
    }
  });

  it("skips a field absent from GoHighLevel, names it, and never fails the contact for it", async () => {
    const { calls, fetch } = answering([
      field_list([["id_gclid", "contact.gclid_google"]]),
      upserted,
      received,
    ]);
    await expect(deliver_lead(tracked(), config, { fetch })).resolves.toEqual(
      delivered,
    );
    expect(body_of(calls[1]).customFields).toEqual([
      { id: "field_1", fieldValue: "Hello" },
      { id: "id_gclid", fieldValue: "TEST-CLIC-001" },
    ]);
    expect(body_of(calls[2]).gbraid).toBe("BRAID-G");
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      "ghl: custom fields absent from the location: contact.gbraid, contact.page_de_provenance",
    );
  });

  it("still delivers the contact, without the fields, when the list is refused, unreachable or unreadable", async () => {
    for (const list of [
      () =>
        Response.json(
          { statusCode: 401, message: "The token is not authorized" },
          { status: 401 },
        ),
      () => {
        throw new TypeError("fetch failed");
      },
      () => Response.json({ fields: [] }),
    ]) {
      const { calls, fetch } = answering([list, upserted, received]);
      await expect(deliver_lead(tracked(), config, { fetch })).resolves.toEqual(
        delivered,
      );
      expect(body_of(calls[1]).customFields).toEqual([
        { id: "field_1", fieldValue: "Hello" },
      ]);
    }
    expect(warn.mock.calls.map(([line]) => line)).toEqual([
      "ghl: custom fields refused: GHL refused the custom field list: HTTP 401, The token is not authorized",
      "ghl: custom fields unreachable: GHL unreachable for the custom field list: network error: fetch failed",
      "ghl: custom fields refused: GHL answered the custom field list with an unexpected body",
    ]);
  });

  it("reads no list when the submission carries no custom field", async () => {
    const { calls, fetch } = answering([upserted, received]);
    await expect(
      deliver_lead(form_of(visitor), config, { fetch }),
    ).resolves.toEqual(delivered);
    expect(requests_of(calls)).toEqual([
      `POST ${upsert_url}`,
      `POST ${hook_url}`,
    ]);
  });
});
