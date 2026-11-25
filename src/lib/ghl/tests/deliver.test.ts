import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ghl_config } from "../config";
import type { delivery_failure } from "../delivery_result";
import type { contact_payload, webhook_payload } from "../payloads";

const deferred: Array<() => Promise<void>> = [];
const steps: string[] = [];
const upsert_contact =
  vi.fn<
    (
      payload: contact_payload,
      config: ghl_config,
    ) => Promise<{ ok: true; contact_id: string } | delivery_failure>
  >();
const post_form_webhook =
  vi.fn<
    (
      payload: webhook_payload,
      config: ghl_config,
    ) => Promise<{ ok: true } | delivery_failure>
  >();
const custom_field_ids =
  vi.fn<
    (field_keys: string[], config: ghl_config) => Promise<Map<string, string>>
  >();
const read_config = vi.fn();
const with_visit_origin = vi.fn<(form_data: FormData) => Promise<FormData>>();

vi.mock("next/server", () => ({
  after: (task: () => Promise<void>) => {
    deferred.push(task);
  },
}));
vi.mock("../ghl_api", () => ({
  custom_field_ids: (field_keys: string[], config: ghl_config) =>
    custom_field_ids(field_keys, config),
  upsert_contact: (payload: contact_payload, config: ghl_config) =>
    upsert_contact(payload, config),
  post_form_webhook: (payload: webhook_payload, config: ghl_config) =>
    post_form_webhook(payload, config),
}));
vi.mock("../config", () => ({ read_config: () => read_config() }));
vi.mock("@/lib/gads/visit_origin", () => ({
  with_visit_origin: (form_data: FormData) => with_visit_origin(form_data),
}));

const { deliver_to_ghl } = await import("../deliver");

const config: ghl_config = {
  api_token: "SECRET-TOKEN",
  location_id: "loc_1",
  form_webhook_url:
    "https://services.leadconnectorhq.com/hooks/loc_1/webhook-trigger/hook_1",
  freetext_field_id: "field_1",
};

const submission = () => {
  const form_data = new FormData();
  form_data.set("given-name", "Jane");
  form_data.set("family-name", "Doe");
  form_data.set("email", "jane@example.com");
  form_data.set("freetext", "Hello");
  return form_data;
};

const with_origin = async (submitted: FormData) => {
  const completed = new FormData();
  for (const [name, value] of submitted) completed.append(name, value);
  completed.set("gclid", "TEST-CLIC-001");
  completed.set("utm_source", "google");
  completed.set("source_page", "accueil");
  return completed;
};

const run_deferred = async () => {
  for (const task of deferred.splice(0)) await task();
};

beforeEach(() => {
  vi.clearAllMocks();
  deferred.length = 0;
  steps.length = 0;
  read_config.mockReturnValue({ ok: true, config });
  with_visit_origin.mockImplementation(async (form_data) => form_data);
  custom_field_ids.mockImplementation(async () => {
    steps.push("ids");
    return new Map();
  });
  upsert_contact.mockImplementation(async () => {
    steps.push("upsert");
    return { ok: true, contact_id: "contact_1" };
  });
  post_form_webhook.mockImplementation(async () => {
    steps.push("webhook");
    return { ok: true };
  });
});

describe("deliver_to_ghl", () => {
  it("returns disabled and defers nothing when the module is off", () => {
    const disabled = {
      ok: false,
      code: "disabled",
      message: "GHL_ENABLED is false",
    };
    read_config.mockReturnValue(disabled);
    expect(deliver_to_ghl(submission())).toEqual(disabled);
    expect(deferred).toHaveLength(0);
  });

  it("returns at once, then upserts the contact and posts the form webhook with its id, in that order, after the response", async () => {
    expect(deliver_to_ghl(submission())).toEqual({ ok: true });
    expect(upsert_contact).not.toHaveBeenCalled();
    expect(deferred).toHaveLength(1);
    await run_deferred();
    expect(steps).toEqual(["ids", "upsert", "webhook"]);
    expect(upsert_contact).toHaveBeenCalledExactlyOnceWith(
      {
        locationId: "loc_1",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        customFields: [{ id: "field_1", fieldValue: "Hello" }],
      },
      config,
    );
    expect(post_form_webhook).toHaveBeenCalledExactlyOnceWith(
      {
        contact_id: "contact_1",
        given_name: "Jane",
        family_name: "Doe",
        email: "jane@example.com",
        tel: "",
        organization: "",
        postal_code: "",
        address_level2: "",
        freetext: "Hello",
        gclid: "",
        gbraid: "",
        wbraid: "",
        fbclid: "",
        utm_source: "",
        utm_campaign: "",
        utm_content: "",
        utm_term: "",
        source_page: "",
      },
      config,
    );
  });

  it("sends the visit origin in the same upsert as the contact, each value under the id resolved for its fieldKey, and again in the webhook under its own key", async () => {
    const form_data = submission();
    with_visit_origin.mockImplementation(with_origin);
    custom_field_ids.mockResolvedValue(
      new Map([
        ["contact.gclid_google", "id_gclid"],
        ["contact.utm_source", "id_source"],
        ["contact.page_de_provenance", "id_page"],
      ]),
    );
    deliver_to_ghl(form_data);
    await run_deferred();
    expect(with_visit_origin).toHaveBeenCalledExactlyOnceWith(form_data);
    expect(custom_field_ids).toHaveBeenCalledExactlyOnceWith(
      [
        "contact.gclid_google",
        "contact.utm_source",
        "contact.page_de_provenance",
      ],
      config,
    );
    expect(upsert_contact).toHaveBeenCalledExactlyOnceWith(
      {
        locationId: "loc_1",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        customFields: [
          { id: "field_1", fieldValue: "Hello" },
          { id: "id_gclid", fieldValue: "TEST-CLIC-001" },
          { id: "id_source", fieldValue: "google" },
          { id: "id_page", fieldValue: "accueil" },
        ],
      },
      config,
    );
    expect(post_form_webhook.mock.calls[0]?.[0]).toMatchObject({
      contact_id: "contact_1",
      gclid: "TEST-CLIC-001",
      utm_source: "google",
      source_page: "accueil",
      fbclid: "",
    });
  });

  it("posts no webhook when the upsert failed, warns, and the deferred task never rejects", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    upsert_contact.mockResolvedValue({
      ok: false,
      code: "unreachable",
      message: "timeout after 10000 ms",
    });
    deliver_to_ghl(submission());
    await expect(run_deferred()).resolves.toBeUndefined();
    expect(post_form_webhook).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      "ghl: unreachable: timeout after 10000 ms",
    );
    warn.mockRestore();
  });

  it("warns when the webhook failed after the contact was delivered", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    post_form_webhook.mockResolvedValue({
      ok: false,
      code: "refused",
      message: "GHL refused the form webhook: HTTP 404, Workflow not found",
    });
    deliver_to_ghl(submission());
    await expect(run_deferred()).resolves.toBeUndefined();
    expect(upsert_contact).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      "ghl: refused: GHL refused the form webhook: HTTP 404, Workflow not found",
    );
    warn.mockRestore();
  });
});
