import "server-only";
import { z } from "zod";
import { module_enabled } from "./kill_switch";

export type gads_config = {
  secure_cookie: boolean;
};

type disabled = { ok: false; code: "disabled"; message: string };

export type config_result = { ok: true; config: gads_config } | disabled;

export const parse_config = (
  env: Record<string, string | undefined>,
): config_result => {
  if (!module_enabled(env)) {
    return { ok: false, code: "disabled", message: "GADS_ENABLED is false" };
  }
  return {
    ok: true,
    config: { secure_cookie: env.NODE_ENV === "production" },
  };
};

export const read_config = () => parse_config(process.env);

const call_tracking_schema = z.object({
  NEXT_PUBLIC_GADS_TAG_ID: z.string().regex(/^AW-\d+$/),
  NEXT_PUBLIC_GADS_CALL_SEND_TO: z.string().regex(/^AW-\d+\/[\w-]+$/),
  NEXT_PUBLIC_GADS_CALL_NUMBER: z.string().trim().min(1),
});

const call_tracking_names = call_tracking_schema.keyof().options;

export type call_tracking = {
  tag_id: string;
  send_to: string;
  displayed_number: string;
};

const non_blank = (value: string | undefined) =>
  value !== undefined && value.trim() !== "";

export const parse_call_tracking = (
  env: Record<string, string | undefined>,
): call_tracking | undefined => {
  if (!module_enabled(env)) return undefined;
  if (!call_tracking_names.some((name) => non_blank(env[name]))) {
    return undefined;
  }
  const parsed = call_tracking_schema.safeParse(env);
  if (!parsed.success) {
    const names = parsed.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ");
    console.warn(
      `gads: no Google tag, invalid or missing environment variables: ${names}`,
    );
    return undefined;
  }
  return {
    tag_id: parsed.data.NEXT_PUBLIC_GADS_TAG_ID,
    send_to: parsed.data.NEXT_PUBLIC_GADS_CALL_SEND_TO,
    displayed_number: parsed.data.NEXT_PUBLIC_GADS_CALL_NUMBER,
  };
};

export const read_call_tracking = () => parse_call_tracking(process.env);
