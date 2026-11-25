import { NextRequest, NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { origin_proxy } from "../origin_proxy";

const arrival = (search: string, cookie?: string) =>
  new NextRequest(`http://localhost:3000/${search}`, {
    headers: cookie ? { cookie } : undefined,
  });

const stored = (response: NextResponse) => response.cookies.get("visit_origin");

beforeEach(() => {
  vi.stubEnv("GADS_ENABLED", "true");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("origin_proxy", () => {
  it("sets a first-party cookie of 90 days with the origin the URL carries", () => {
    const response = origin_proxy(
      arrival(
        "?gclid=TEST-CLIC-001&fbclid=TEST-META-001&utm_source=google&utm_campaign=hiver&utm_content=video&utm_term=canape",
      ),
    );
    expect(stored(response)).toMatchObject({
      name: "visit_origin",
      value:
        "gclid=TEST-CLIC-001&fbclid=TEST-META-001&utm_source=google&utm_campaign=hiver&utm_content=video&utm_term=canape",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7_776_000,
      path: "/",
    });
    expect(stored(response)?.domain).toBeUndefined();
    vi.stubEnv("NODE_ENV", "production");
    expect(stored(origin_proxy(arrival("?gclid=TEST-CLIC-001")))?.secure).toBe(
      true,
    );
  });

  it("replaces the whole stored set on an arrival carrying one parameter, and keeps it on an arrival carrying none", () => {
    const kept = "visit_origin=gclid%3DOLD%26utm_source%3Dgoogle";
    expect(
      stored(origin_proxy(arrival("?fbclid=TEST-META-001", kept)))?.value,
    ).toBe("fbclid=TEST-META-001");
    expect(stored(origin_proxy(arrival("", kept)))).toBeUndefined();
    expect(stored(origin_proxy(arrival("?page=2", kept)))).toBeUndefined();
  });

  it("stores lnid as gclid, never under its name", () => {
    expect(stored(origin_proxy(arrival("?lnid=TEST-CLIC-002")))?.value).toBe(
      "gclid=TEST-CLIC-002",
    );
  });

  it("adds its cookie to the response it is handed and touches nothing when the module is off", () => {
    const response = NextResponse.next();
    response.cookies.set("_fbp", "fb.1.1700000000000.42");
    expect(
      origin_proxy(arrival("?gclid=TEST-CLIC-001"), response)
        .cookies.getAll()
        .map((cookie) => cookie.name),
    ).toEqual(["_fbp", "visit_origin"]);
    vi.stubEnv("GADS_ENABLED", "false");
    expect(
      origin_proxy(arrival("?gclid=TEST-CLIC-001")).cookies.getAll(),
    ).toEqual([]);
  });
});
