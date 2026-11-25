import "server-only";
import { cookies, headers } from "next/headers";
import { visit_origin_key_schema } from "@/lib/form_contract/dictionary";
import { read_config } from "./config";
import { origin_cookie_name } from "./origin_cookie";
import {
  origin_of_search,
  page_key,
  page_name_of,
  stored_origin_keys,
} from "./origin_rule";

type submission = {
  form_data: FormData;
  cookie: string | undefined;
  referer: string | null;
};

const submitted = (form_data: FormData, key: string) =>
  form_data
    .getAll(key)
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .find((value) => value.length > 0);

const path_of = (referer: string | null) =>
  referer && URL.canParse(referer) ? new URL(referer).pathname : undefined;

export const form_without_origin = (form_data: FormData) => {
  const stripped = new FormData();
  for (const [name, value] of form_data) {
    if (!visit_origin_key_schema.safeParse(name).success) {
      stripped.append(name, value);
    }
  }
  return stripped;
};

export const form_with_origin = ({
  form_data,
  cookie,
  referer,
}: submission) => {
  const completed = form_without_origin(form_data);
  const stored = new URLSearchParams(origin_of_search(cookie ?? ""));
  for (const key of stored_origin_keys) {
    const value = submitted(form_data, key) ?? stored.get(key);
    if (value) completed.set(key, value);
  }
  const route = submitted(form_data, page_key) ?? path_of(referer);
  if (route !== undefined) completed.set(page_key, page_name_of(route));
  return completed;
};

const read_submission = async (form_data: FormData): Promise<submission> => {
  const [cookie_store, request_headers] = await Promise.all([
    cookies(),
    headers(),
  ]);
  return {
    form_data,
    cookie: cookie_store.get(origin_cookie_name)?.value,
    referer: request_headers.get("referer"),
  };
};

export const with_visit_origin = async (
  form_data: FormData,
): Promise<FormData> => {
  if (!read_config().ok) return form_without_origin(form_data);
  try {
    return form_with_origin(await read_submission(form_data));
  } catch (error) {
    console.warn(`gads: the request could not be read: ${String(error)}`);
    return form_with_origin({ form_data, cookie: undefined, referer: null });
  }
};
