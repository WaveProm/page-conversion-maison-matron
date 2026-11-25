import "server-only";
import {
  type visit_origin_key,
  visit_origin_key_schema,
} from "@/lib/form_contract/dictionary";

export const page_key = "source_page" satisfies visit_origin_key;

export type stored_origin_key = Exclude<visit_origin_key, typeof page_key>;

export const stored_origin_keys = visit_origin_key_schema.exclude([page_key])
  .options satisfies stored_origin_key[];

export const origin_of_search = (search: string): string => {
  const max_value_length = 500;
  const arrival = new URLSearchParams(search);
  const carried = (name: string) => {
    const value = (arrival.get(name) ?? "").trim();
    return value.length > 0 && value.length <= max_value_length
      ? value
      : undefined;
  };
  const origin: Record<stored_origin_key, string | undefined> = {
    gclid: carried("gclid") ?? carried("lnid"),
    gbraid: carried("gbraid"),
    wbraid: carried("wbraid"),
    fbclid: carried("fbclid"),
    utm_source: carried("utm_source"),
    utm_campaign: carried("utm_campaign"),
    utm_content: carried("utm_content"),
    utm_term: carried("utm_term"),
  };
  const canonical = new URLSearchParams();
  for (const key of Object.keys(origin)) {
    const value = Reflect.get(origin, key);
    if (typeof value === "string") canonical.set(key, value);
  }
  return canonical.toString();
};

export const page_name_of = (pathname: string): string => {
  const home_name = "accueil";
  const decoded = () => {
    try {
      return decodeURIComponent(pathname);
    } catch {
      return pathname;
    }
  };
  const name = decoded()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
  return name || home_name;
};
