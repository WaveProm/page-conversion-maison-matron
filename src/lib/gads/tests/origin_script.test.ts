import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { origin_of_search, page_name_of } from "../origin_rule";
import {
  type browser_page,
  type hidden_input,
  keep_origin_in_forms,
  origin_script,
  type page_form,
} from "../origin_script";

type rendered_form = page_form & { inputs: hidden_input[] };

const settings = {
  storage_key: "visit_origin",
  stored_keys: [
    "gclid",
    "gbraid",
    "wbraid",
    "fbclid",
    "utm_source",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ],
  page_key: "source_page",
};

const opened = (url: string, storage_fails = false) => {
  let current = new URL(url);
  const forms: rendered_form[] = [];
  const storage = new Map<string, string>();
  const listeners: Array<{ type: string; capture: boolean | undefined }> = [];
  const triggers = new Map<string, () => void>();
  const failing = () => {
    throw new Error("the storage is denied");
  };
  const render_form = () => {
    const inputs: hidden_input[] = [];
    const form: rendered_form = {
      inputs,
      querySelector: (selector) =>
        inputs.find(
          (input) => selector === `input[type="hidden"][name="${input.name}"]`,
        ) ?? null,
      append: (input) => {
        inputs.push(input);
      },
    };
    forms.push(form);
    return form;
  };
  const create_input = () => {
    const input: hidden_input = {
      type: "text",
      name: "",
      value: "",
      remove: () => {
        for (const form of forms) {
          const index = form.inputs.indexOf(input);
          if (index >= 0) form.inputs.splice(index, 1);
        }
      },
    };
    return input;
  };
  const page: browser_page = {
    document: { forms, documentElement: "html", createElement: create_input },
    location: {
      get href() {
        return current.href;
      },
      get search() {
        return current.search;
      },
      get pathname() {
        return current.pathname;
      },
    },
    sessionStorage: {
      getItem: storage_fails ? failing : (key) => storage.get(key) ?? null,
      setItem: storage_fails
        ? failing
        : (key, value) => {
            storage.set(key, value);
          },
    },
    MutationObserver: class {
      constructor(callback: () => void) {
        triggers.set("mutation", callback);
      }
      observe(target: unknown) {
        listeners.push({
          type: `observe ${String(target)}`,
          capture: undefined,
        });
      }
    },
    addEventListener: (type, listener, capture) => {
      listeners.push({ type, capture });
      triggers.set(type, listener);
    },
  };
  return {
    page,
    storage,
    listeners,
    render_form,
    navigate: (to: string) => {
      current = new URL(to, current);
    },
    trigger: (type: "mutation" | "popstate" | "submit") =>
      triggers.get(type)?.(),
  };
};

const values_of = (form: rendered_form) =>
  Object.fromEntries(form.inputs.map((input) => [input.name, input.value]));

const keep = (page: browser_page) =>
  keep_origin_in_forms(page, origin_of_search, page_name_of, settings);

const landing =
  "https://site.test/R%C3%A9novation/?gclid=TEST-CLIC-001&fbclid=TEST-META-001&utm_source=google&utm_campaign=hiver&utm_content=video&utm_term=canape";

const landing_values = {
  gclid: "TEST-CLIC-001",
  fbclid: "TEST-META-001",
  utm_source: "google",
  utm_campaign: "hiver",
  utm_content: "video",
  utm_term: "canape",
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("keep_origin_in_forms", () => {
  it("reads the URL at load, keeps the origin in sessionStorage and places it with source_page in every form", () => {
    const browser = opened(landing);
    const [first, second] = [browser.render_form(), browser.render_form()];
    keep(browser.page);
    expect(browser.storage.get("visit_origin")).toBe(
      "gclid=TEST-CLIC-001&fbclid=TEST-META-001&utm_source=google&utm_campaign=hiver&utm_content=video&utm_term=canape",
    );
    for (const form of [first, second]) {
      expect(values_of(form)).toEqual({
        ...landing_values,
        source_page: "renovation",
      });
    }
  });

  it("places nothing but hidden inputs appended to the form, the one node React skips when it hydrates", () => {
    const browser = opened(landing);
    const form = browser.render_form();
    keep(browser.page);
    expect(form.inputs).toHaveLength(7);
    expect(form.inputs.map((input) => input.type)).toEqual(
      Array.from({ length: 7 }, () => "hidden"),
    );
  });

  it("fills a form rendered after the load at the next DOM mutation, without doubling the inputs of the others", () => {
    const browser = opened(landing);
    const first = browser.render_form();
    keep(browser.page);
    const later = browser.render_form();
    expect(later.inputs).toEqual([]);
    browser.trigger("mutation");
    browser.trigger("mutation");
    expect(values_of(later)).toEqual({
      ...landing_values,
      source_page: "renovation",
    });
    expect(first.inputs).toHaveLength(7);
    expect(later.inputs).toHaveLength(7);
    expect(browser.listeners).toContainEqual({
      type: "observe html",
      capture: undefined,
    });
  });

  it("keeps the stored set through a navigation that carries no parameter and renames the page", () => {
    const browser = opened(landing);
    const form = browser.render_form();
    keep(browser.page);
    browser.navigate("/Contact");
    browser.trigger("mutation");
    expect(values_of(form)).toEqual({
      ...landing_values,
      source_page: "contact",
    });
  });

  it("replaces the whole stored set on a navigation that carries one parameter, lnid filling gclid and never placed under its name", () => {
    const browser = opened(landing);
    const form = browser.render_form();
    keep(browser.page);
    browser.navigate("/?lnid=TEST-CLIC-002");
    browser.trigger("mutation");
    expect(values_of(form)).toEqual({
      gclid: "TEST-CLIC-002",
      source_page: "accueil",
    });
    expect(browser.storage.get("visit_origin")).toBe("gclid=TEST-CLIC-002");
    browser.navigate("/?gbraid=BRAID-G&wbraid=BRAID-W");
    browser.trigger("mutation");
    expect(values_of(form)).toEqual({
      gbraid: "BRAID-G",
      wbraid: "BRAID-W",
      source_page: "accueil",
    });
  });

  it("looks at the URL again on popstate and, in the capture phase, right before a submit", () => {
    const browser = opened("https://site.test/");
    const form = browser.render_form();
    keep(browser.page);
    expect(values_of(form)).toEqual({ source_page: "accueil" });
    browser.navigate("/devis?utm_source=newsletter");
    browser.trigger("submit");
    expect(values_of(form)).toEqual({
      utm_source: "newsletter",
      source_page: "devis",
    });
    browser.navigate("/");
    browser.trigger("popstate");
    expect(values_of(form)).toEqual({
      utm_source: "newsletter",
      source_page: "accueil",
    });
    expect(browser.listeners).toContainEqual({ type: "submit", capture: true });
  });

  it("starts a new visit from an empty store, and keeps the page working when sessionStorage is denied", () => {
    const visit = opened("https://site.test/contact");
    const form = visit.render_form();
    keep(visit.page);
    expect(values_of(form)).toEqual({ source_page: "contact" });
    const denied = opened(landing, true);
    const denied_form = denied.render_form();
    keep(denied.page);
    denied.navigate("/Contact");
    denied.trigger("mutation");
    expect(values_of(denied_form)).toEqual({
      ...landing_values,
      source_page: "contact",
    });
  });
});

describe("origin_script", () => {
  it("is one self-contained expression: evaluated with nothing but window, it places the origin like the function it is made of", () => {
    vi.stubEnv("GADS_ENABLED", "true");
    const browser = opened("https://site.test/Devis?lnid=TEST-CLIC-002");
    const form = browser.render_form();
    runInNewContext(String(origin_script()), {
      window: browser.page,
      URLSearchParams,
    });
    expect(values_of(form)).toEqual({
      gclid: "TEST-CLIC-002",
      source_page: "devis",
    });
    expect(browser.storage.get("visit_origin")).toBe("gclid=TEST-CLIC-002");
  });

  it("is absent when the module is off", () => {
    vi.stubEnv("GADS_ENABLED", "false");
    expect(origin_script()).toBeUndefined();
  });
});
