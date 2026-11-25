import "server-only";
import { read_config } from "./config";
import {
  origin_of_search,
  page_key,
  page_name_of,
  stored_origin_keys,
} from "./origin_rule";

export type hidden_input = {
  type: string;
  name: string;
  value: string;
  remove: () => void;
};

export type page_form = {
  querySelector: (selector: string) => hidden_input | null;
  append: (input: hidden_input) => void;
};

export type browser_page = {
  document: {
    forms: Iterable<page_form>;
    documentElement: unknown;
    createElement: (tag: "input") => hidden_input;
  };
  location: { href: string; search: string; pathname: string };
  sessionStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
  };
  MutationObserver: new (
    callback: () => void,
  ) => {
    observe: (
      target: unknown,
      options: { childList: boolean; subtree: boolean },
    ) => void;
  };
  addEventListener: (
    type: string,
    listener: () => void,
    capture?: boolean,
  ) => void;
};

type script_settings = {
  storage_key: string;
  stored_keys: string[];
  page_key: string;
};

export const storage_key = "visit_origin";

export const keep_origin_in_forms = (
  page: browser_page,
  origin_of: (search: string) => string,
  page_name: (pathname: string) => string,
  settings: script_settings,
) => {
  let read_href: string | undefined;
  let kept = "";
  const attempted = <T>(action: () => T, fallback: T) => {
    try {
      return action();
    } catch {
      return fallback;
    }
  };
  const stored = () =>
    attempted(() => page.sessionStorage.getItem(settings.storage_key), null) ??
    kept;
  const store = (origin: string) => {
    kept = origin;
    attempted(
      () => page.sessionStorage.setItem(settings.storage_key, origin),
      undefined,
    );
  };
  const read_arrival = () => {
    if (page.location.href === read_href) return;
    read_href = page.location.href;
    const arrival = origin_of(page.location.search);
    if (arrival !== "") store(arrival);
  };
  const place = (form: page_form, key: string, value: string | null) => {
    const input = form.querySelector(`input[type="hidden"][name="${key}"]`);
    if (!value) {
      input?.remove();
      return;
    }
    if (input) {
      if (input.value !== value) input.value = value;
      return;
    }
    const created = page.document.createElement("input");
    created.type = "hidden";
    created.name = key;
    created.value = value;
    form.append(created);
  };
  const sync = () => {
    read_arrival();
    const origin = new URLSearchParams(origin_of(stored()));
    const name = page_name(page.location.pathname);
    for (const form of page.document.forms) {
      for (const key of settings.stored_keys) {
        place(form, key, origin.get(key));
      }
      place(form, settings.page_key, name);
    }
  };
  sync();
  new page.MutationObserver(sync).observe(page.document.documentElement, {
    childList: true,
    subtree: true,
  });
  page.addEventListener("popstate", sync);
  page.addEventListener("submit", sync, true);
};

export const origin_script = () => {
  if (!read_config().ok) return undefined;
  const settings: script_settings = {
    storage_key,
    stored_keys: stored_origin_keys,
    page_key,
  };
  return `(${keep_origin_in_forms.toString()})(window,${origin_of_search.toString()},${page_name_of.toString()},${JSON.stringify(settings)})`;
};
