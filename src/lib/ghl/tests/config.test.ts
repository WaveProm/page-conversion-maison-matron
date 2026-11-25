import { describe, expect, it } from "vitest";
import { parse_config } from "../config";

const complete = {
  GHL_API_TOKEN: "token",
  GHL_LOCATION_ID: "location",
  GHL_FORM_WEBHOOK_URL:
    "https://services.leadconnectorhq.com/hooks/loc_1/webhook-trigger/hook_1",
  GHL_FREETEXT_FIELD_ID: "field",
};

describe("parse_config", () => {
  it("the flag cuts, a complete env maps every field, a blank optional is absent, a blank token and a blank webhook URL are kept as they are", () => {
    expect(parse_config({ GHL_ENABLED: "false" })).toEqual({
      ok: false,
      code: "disabled",
      message: "GHL_ENABLED is false",
    });
    expect(parse_config(complete)).toEqual({
      ok: true,
      config: {
        api_token: "token",
        location_id: "location",
        form_webhook_url:
          "https://services.leadconnectorhq.com/hooks/loc_1/webhook-trigger/hook_1",
        freetext_field_id: "field",
      },
    });
    const blank = parse_config({
      ...complete,
      GHL_API_TOKEN: "",
      GHL_FORM_WEBHOOK_URL: "",
      GHL_FREETEXT_FIELD_ID: "",
    });
    expect(blank.ok && blank.config.freetext_field_id).toBeUndefined();
    expect(blank.ok && blank.config.api_token).toBe("");
    expect(blank.ok && blank.config.form_webhook_url).toBe("");
    expect(parse_config({}).ok && parse_config({})).toMatchObject({
      config: { form_webhook_url: "" },
    });
  });
});
