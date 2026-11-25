import { runInNewContext } from "node:vm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parse_call_tracking } from "../config";
import {
  type call_link,
  type call_page,
  forwarding_number_in_links,
  google_tag,
} from "../google_tag";

const site = {
  NEXT_PUBLIC_GADS_TAG_ID: "AW-000000000",
  NEXT_PUBLIC_GADS_CALL_SEND_TO: "AW-000000000/exemple",
  NEXT_PUBLIC_GADS_CALL_NUMBER: "+41 00 000 00 00",
};

const names = [
  "NEXT_PUBLIC_GADS_TAG_ID",
  "NEXT_PUBLIC_GADS_CALL_SEND_TO",
  "NEXT_PUBLIC_GADS_CALL_NUMBER",
] as const;

const stub_site = (values: Partial<typeof site> = site) => {
  for (const name of names) vi.stubEnv(name, values[name] ?? "");
};

const commands_of = (script: string) => {
  const page: { dataLayer?: ArrayLike<unknown>[]; window?: unknown } = {};
  page.window = page;
  runInNewContext(script, page);
  return (page.dataLayer ?? []).map((command) => Array.from(command));
};

type page_link = call_link & { texts: { data: string }[] };

const page_of = (links: page_link[]): call_page => ({
  document: {
    querySelectorAll: (selector) =>
      links.filter((link) => selector === `a[href="${link.href}"]`),
    createTreeWalker: (root) => {
      const texts = links.find((link) => link === root)?.texts ?? [];
      let next = 0;
      return {
        nextNode: () => {
          const text = texts[next] ?? null;
          next += 1;
          return text;
        },
      };
    },
  },
  NodeFilter: { SHOW_TEXT: 4 },
});

const warn = vi.spyOn(console, "warn");

beforeEach(() => {
  warn.mockReset();
  warn.mockImplementation(() => {});
  vi.stubEnv("GADS_ENABLED", "true");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("google_tag", () => {
  it("is rendered only when the three variables exist: none, any one missing or a blank one means no tag", () => {
    stub_site();
    expect(google_tag()).toBeDefined();
    stub_site({});
    expect(google_tag()).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();
    for (const missing of names) {
      stub_site({ ...site, [missing]: missing === names[2] ? "  " : "" });
      expect(google_tag()).toBeUndefined();
      expect(warn).toHaveBeenLastCalledWith(
        `gads: no Google tag, invalid or missing environment variables: ${missing}`,
      );
    }
    expect(warn).toHaveBeenCalledTimes(3);
  });

  it("loads gtag.js for the tag id, then configures the tag and the call conversion with its send_to and the number as displayed", () => {
    stub_site();
    const tag = google_tag();
    expect(tag?.library_url).toBe(
      "https://www.googletagmanager.com/gtag/js?id=AW-000000000",
    );
    const [started, ...configured] = commands_of(tag?.script ?? "");
    expect(started?.[0]).toBe("js");
    expect(configured).toEqual([
      ["config", "AW-000000000"],
      [
        "config",
        "AW-000000000/exemple",
        {
          phone_conversion_number: "+41 00 000 00 00",
          phone_conversion_callback: expect.any(Function),
        },
      ],
    ]);
  });

  it("hands Google a callback that writes the forwarding number in the text and in the tel: href of every link to the number, and leaves any other link", () => {
    const call = {
      href: "tel:+41000000000",
      texts: [{ data: "+41 00 000 00 00" }],
    };
    const sentence = {
      href: "tel:+41000000000",
      texts: [{ data: "Appelez le " }, { data: "+41 00 000 00 00 dès 8 h" }],
    };
    const other = {
      href: "tel:+41999999999",
      texts: [{ data: "+41 99 999 99 99" }],
    };
    forwarding_number_in_links(page_of([call, sentence, other]), {
      displayed_number: "+41 00 000 00 00",
      tel_href: "tel:+41000000000",
    })("+41 11 111 11 11", "+41111111111");
    expect(call).toEqual({
      href: "tel:+41111111111",
      texts: [{ data: "+41 11 111 11 11" }],
    });
    expect(sentence).toEqual({
      href: "tel:+41111111111",
      texts: [{ data: "Appelez le " }, { data: "+41 11 111 11 11 dès 8 h" }],
    });
    expect(other).toEqual({
      href: "tel:+41999999999",
      texts: [{ data: "+41 99 999 99 99" }],
    });
  });

  it("runs that callback from the inline script itself, with nothing but window", () => {
    stub_site();
    const call = {
      href: "tel:+41000000000",
      texts: [{ data: "+41 00 000 00 00" }],
    };
    const page: call_page & {
      dataLayer?: ArrayLike<unknown>[];
      window?: unknown;
    } = page_of([call]);
    page.window = page;
    runInNewContext(google_tag()?.script ?? "", page);
    const settings = Array.from(page.dataLayer?.[2] ?? [])[2];
    const callback =
      typeof settings === "object" && settings !== null
        ? Reflect.get(settings, "phone_conversion_callback")
        : undefined;
    expect(callback).toBeTypeOf("function");
    if (typeof callback === "function") {
      callback("+41 11 111 11 11", "+41111111111");
    }
    expect(call).toEqual({
      href: "tel:+41111111111",
      texts: [{ data: "+41 11 111 11 11" }],
    });
  });

  it("gives the page the number as displayed and its tel: link, the two forms Google replaces", () => {
    stub_site();
    expect(google_tag()).toMatchObject({
      displayed_number: "+41 00 000 00 00",
      tel_href: "tel:+41000000000",
    });
  });

  it("is absent when the module is off, and never lets a value that is not an id reach the script", () => {
    stub_site();
    vi.stubEnv("GADS_ENABLED", "false");
    expect(google_tag()).toBeUndefined();
    vi.stubEnv("GADS_ENABLED", "true");
    stub_site({ ...site, NEXT_PUBLIC_GADS_TAG_ID: 'AW-1");alert(1);("' });
    expect(google_tag()).toBeUndefined();
    stub_site({ ...site, NEXT_PUBLIC_GADS_CALL_SEND_TO: "AW-000000000" });
    expect(google_tag()).toBeUndefined();
    stub_site({ ...site, NEXT_PUBLIC_GADS_CALL_NUMBER: '+41 "00' });
    expect(commands_of(google_tag()?.script ?? "")[2]).toEqual([
      "config",
      "AW-000000000/exemple",
      {
        phone_conversion_number: '+41 "00',
        phone_conversion_callback: expect.any(Function),
      },
    ]);
  });
});

describe("parse_call_tracking", () => {
  it("maps the three variables, trims the number, and answers nothing for an empty environment or one variable absent", () => {
    expect(
      parse_call_tracking({
        ...site,
        NEXT_PUBLIC_GADS_CALL_NUMBER: " 000 000 00 00 ",
      }),
    ).toEqual({
      tag_id: "AW-000000000",
      send_to: "AW-000000000/exemple",
      displayed_number: "000 000 00 00",
    });
    expect(parse_call_tracking({})).toBeUndefined();
    for (const absent of names) {
      expect(
        parse_call_tracking({ ...site, [absent]: undefined }),
      ).toBeUndefined();
      expect(warn).toHaveBeenLastCalledWith(
        `gads: no Google tag, invalid or missing environment variables: ${absent}`,
      );
    }
  });
});
