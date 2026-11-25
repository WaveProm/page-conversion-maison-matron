import "server-only";
import { module_enabled } from "./kill_switch";

export type ghl_config = {
  api_token: string;
  location_id: string;
  form_webhook_url: string;
  freetext_field_id?: string;
};

type disabled = { ok: false; code: "disabled"; message: string };

export type config_result = { ok: true; config: ghl_config } | disabled;

const non_blank = (value: string | undefined) =>
  value !== undefined && value !== "" ? value : undefined;

export const parse_config = (
  env: Record<string, string | undefined>,
): config_result => {
  if (!module_enabled(env)) {
    return { ok: false, code: "disabled", message: "GHL_ENABLED is false" };
  }
  return {
    ok: true,
    config: {
      api_token: env.GHL_API_TOKEN ?? "",
      location_id: env.GHL_LOCATION_ID ?? "",
      form_webhook_url: env.GHL_FORM_WEBHOOK_URL ?? "",
      freetext_field_id: non_blank(env.GHL_FREETEXT_FIELD_ID),
    },
  };
};

export const read_config = () => parse_config(process.env);
