import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const cookie_value = vi.fn<(name: string) => string | undefined>();
const header_value = vi.fn<(name: string) => string | null>();
const read_cookies = vi.fn(async () => ({
  get: (name: string) => {
    const value = cookie_value(name);
    return value === undefined ? undefined : { name, value };
  },
}));
const read_headers = vi.fn(async () => ({ get: header_value }));

vi.mock("next/headers", () => ({
  cookies: () => read_cookies(),
  headers: () => read_headers(),
}));

const { form_with_origin, with_visit_origin } = await import("../visit_origin");

const submission = (entries: Array<[string, string]>) => {
  const form_data = new FormData();
  for (const [name, value] of entries) form_data.append(name, value);
  return form_data;
};

const entries_of = (form_data: FormData) => Array.from(form_data);

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("GADS_ENABLED", "true");
  cookie_value.mockReturnValue(undefined);
  header_value.mockReturnValue(null);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("form_with_origin", () => {
  it("keeps the value of the form first and fills a key the form leaves blank from the cookie", () => {
    const form_data = submission([
      ["given-name", "Jane"],
      ["gclid", "FROM-FORM"],
      ["utm_source", "  "],
      ["source_page", "contact"],
    ]);
    const completed = form_with_origin({
      form_data,
      cookie: "gclid=FROM-COOKIE&fbclid=TEST-META-001&utm_source=google",
      referer: null,
    });
    expect(entries_of(completed)).toEqual([
      ["given-name", "Jane"],
      ["gclid", "FROM-FORM"],
      ["fbclid", "TEST-META-001"],
      ["utm_source", "google"],
      ["source_page", "contact"],
    ]);
    expect(entries_of(form_data)).toEqual([
      ["given-name", "Jane"],
      ["gclid", "FROM-FORM"],
      ["utm_source", "  "],
      ["source_page", "contact"],
    ]);
  });

  it("reads the cookie with the rule of the URL, so a key outside the eight or an oversized value never leaves", () => {
    const completed = form_with_origin({
      form_data: submission([["email", "jane@example.com"]]),
      cookie: `foo=bar&source_page=elsewhere&utm_term=${"a".repeat(501)}&wbraid=BRAID-W`,
      referer: null,
    });
    expect(entries_of(completed)).toEqual([
      ["email", "jane@example.com"],
      ["wbraid", "BRAID-W"],
    ]);
  });

  it("names source_page from the route the form is sent from: the form value, else the referer, accueil for the home", () => {
    const named = (form_value: string | undefined, referer: string | null) =>
      form_with_origin({
        form_data: submission(form_value ? [["source_page", form_value]] : []),
        cookie: undefined,
        referer,
      }).get("source_page");
    expect(named("/Rénovation/Cuisine/", "https://site.test/other")).toBe(
      "renovation/cuisine",
    );
    expect(named("accueil", null)).toBe("accueil");
    expect(named(undefined, "https://site.test/Contact?utm_source=x")).toBe(
      "contact",
    );
    expect(named(undefined, "https://site.test/")).toBe("accueil");
    expect(named(undefined, "not a url")).toBeNull();
    expect(named(undefined, null)).toBeNull();
  });
});

describe("with_visit_origin", () => {
  it("reads the visit_origin cookie and the referer of the request", async () => {
    cookie_value.mockImplementation((name) =>
      name === "visit_origin" ? "gclid=TEST-CLIC-001" : undefined,
    );
    header_value.mockImplementation((name) =>
      name === "referer" ? "https://site.test/devis" : null,
    );
    const completed = await with_visit_origin(
      submission([["email", "jane@example.com"]]),
    );
    expect(entries_of(completed)).toEqual([
      ["email", "jane@example.com"],
      ["gclid", "TEST-CLIC-001"],
      ["source_page", "devis"],
    ]);
  });

  it("strips the nine keys and reads nothing when the module is off", async () => {
    vi.stubEnv("GADS_ENABLED", "false");
    const completed = await with_visit_origin(
      submission([
        ["email", "jane@example.com"],
        ["gclid", "TEST-CLIC-001"],
        ["source_page", "contact"],
      ]),
    );
    expect(entries_of(completed)).toEqual([["email", "jane@example.com"]]);
    expect(read_cookies).not.toHaveBeenCalled();
    expect(read_headers).not.toHaveBeenCalled();
  });

  it("never throws: a request that cannot be read leaves the values of the form and warns", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    read_cookies.mockRejectedValueOnce(new Error("outside a request scope"));
    const completed = await with_visit_origin(
      submission([["gclid", "FROM-FORM"]]),
    );
    expect(entries_of(completed)).toEqual([["gclid", "FROM-FORM"]]);
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      "gads: the request could not be read: Error: outside a request scope",
    );
    warn.mockRestore();
  });
});
