import "server-only";
import { z } from "zod";
import type { ghl_config } from "./config";
import type { delivery_failure } from "./delivery_result";
import type { contact_payload, webhook_payload } from "./payloads";

export type transport = {
  fetch: typeof fetch;
  timeout_ms: number;
};

export type contact_result =
  | { ok: true; contact_id: string }
  | delivery_failure;

export type webhook_result = { ok: true } | delivery_failure;

const base_url = "https://services.leadconnectorhq.com";
const api_version = "v3";
const custom_fields_version = "2021-07-28";
const webhook_operation = "form webhook";

const default_transport: transport = {
  fetch: (input, init) => fetch(input, init),
  timeout_ms: 10_000,
};

const upsert_response_schema = z.object({
  contact: z.object({ id: z.string().min(1) }),
});

const custom_fields_response_schema = z.object({
  customFields: z.array(
    z.object({ id: z.string().min(1), fieldKey: z.string().optional() }),
  ),
});

const error_schema = z.object({
  message: z.union([z.string(), z.array(z.string())]),
});

type json_outcome = { ok: true; body: unknown } | delivery_failure;

type json_request = {
  method: "GET" | "POST";
  path: string;
  version: string;
  operation: string;
  payload?: contact_payload;
};

type field_ids_outcome =
  | { ok: true; ids: Map<string, string> }
  | delivery_failure;

const refused = (message: string): delivery_failure => ({
  ok: false,
  code: "refused",
  message,
});

const unreachable = (message: string): delivery_failure => ({
  ok: false,
  code: "unreachable",
  message,
});

const body_json = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

const refusal_message = (body: unknown, status: number, operation: string) => {
  const parsed = error_schema.safeParse(body);
  const detail = parsed.success
    ? [parsed.data.message].flat().join(", ")
    : "an unexpected body";
  return `GHL refused the ${operation}: HTTP ${status}, ${detail}`;
};

const transient = (status: number) => status === 429 || status >= 500;

const outcome_of = async (
  response: Response,
  operation: string,
): Promise<json_outcome> => {
  if (response.ok) return { ok: true, body: await body_json(response) };
  if (transient(response.status)) {
    return unreachable(
      `GHL answered HTTP ${response.status} to the ${operation}`,
    );
  }
  return refused(
    refusal_message(await body_json(response), response.status, operation),
  );
};

const failure_reason = (error: unknown, timeout_ms: number) => {
  if (!(error instanceof Error)) return "network error";
  return error.name === "TimeoutError"
    ? `timeout after ${timeout_ms} ms`
    : `network error: ${error.message}`;
};

const send_json = async (
  request: json_request,
  config: ghl_config,
  transport: transport,
): Promise<json_outcome> => {
  try {
    const response = await transport.fetch(`${base_url}${request.path}`, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${config.api_token}`,
        Version: request.version,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: request.payload && JSON.stringify(request.payload),
      signal: AbortSignal.timeout(transport.timeout_ms),
    });
    return await outcome_of(response, request.operation);
  } catch (error) {
    return unreachable(
      `GHL unreachable for the ${request.operation}: ${failure_reason(error, transport.timeout_ms)}`,
    );
  }
};

const read_field_ids = async (
  config: ghl_config,
  transport: transport,
): Promise<field_ids_outcome> => {
  const outcome = await send_json(
    {
      method: "GET",
      path: `/locations/${encodeURIComponent(config.location_id)}/customFields?model=contact`,
      version: custom_fields_version,
      operation: "custom field list",
    },
    config,
    transport,
  );
  if (!outcome.ok) return outcome;
  const parsed = custom_fields_response_schema.safeParse(outcome.body);
  if (!parsed.success) {
    return refused(
      "GHL answered the custom field list with an unexpected body",
    );
  }
  const ids = new Map<string, string>();
  for (const { id, fieldKey } of parsed.data.customFields) {
    if (fieldKey) ids.set(fieldKey, id);
  }
  return { ok: true, ids };
};

export const custom_field_ids = async (
  field_keys: string[],
  config: ghl_config,
  overrides: Partial<transport> = {},
): Promise<Map<string, string>> => {
  if (field_keys.length === 0) return new Map();
  const read = await read_field_ids(config, {
    ...default_transport,
    ...overrides,
  });
  if (!read.ok) {
    console.warn(`ghl: custom fields ${read.code}: ${read.message}`);
    return new Map();
  }
  const absent = field_keys.filter((field_key) => !read.ids.has(field_key));
  if (absent.length > 0) {
    console.warn(
      `ghl: custom fields absent from the location: ${absent.join(", ")}`,
    );
  }
  return read.ids;
};

export const upsert_contact = async (
  payload: contact_payload,
  config: ghl_config,
  overrides: Partial<transport> = {},
): Promise<contact_result> => {
  const outcome = await send_json(
    {
      method: "POST",
      path: "/contacts/upsert",
      version: api_version,
      operation: "contact upsert",
      payload,
    },
    config,
    { ...default_transport, ...overrides },
  );
  if (!outcome.ok) return outcome;
  const parsed = upsert_response_schema.safeParse(outcome.body);
  return parsed.success
    ? { ok: true, contact_id: parsed.data.contact.id }
    : refused("GHL answered the contact upsert with an unexpected body");
};

export const post_form_webhook = async (
  payload: webhook_payload,
  config: ghl_config,
  overrides: Partial<transport> = {},
): Promise<webhook_result> => {
  if (!URL.canParse(config.form_webhook_url)) {
    return refused("GHL_FORM_WEBHOOK_URL is not a URL");
  }
  const transport = { ...default_transport, ...overrides };
  try {
    const response = await transport.fetch(config.form_webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(transport.timeout_ms),
    });
    const outcome = await outcome_of(response, webhook_operation);
    return outcome.ok ? { ok: true } : outcome;
  } catch (error) {
    return unreachable(
      `GHL unreachable for the ${webhook_operation}: ${failure_reason(error, transport.timeout_ms)}`,
    );
  }
};
