import { describe, expect, it, vi } from "vitest";
import { parse_config } from "../config";

describe("parse_config", () => {
  it("the flag cuts, absent means on, the cookie is secure in production only, any other flag stays off with a warning", () => {
    expect(parse_config({ GADS_ENABLED: "false" })).toEqual({
      ok: false,
      code: "disabled",
      message: "GADS_ENABLED is false",
    });
    expect(parse_config({})).toEqual({
      ok: true,
      config: { secure_cookie: false },
    });
    expect(
      parse_config({ GADS_ENABLED: "true", NODE_ENV: "production" }),
    ).toEqual({ ok: true, config: { secure_cookie: true } });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parse_config({ GADS_ENABLED: "yes" }).ok).toBe(false);
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      'gads: GADS_ENABLED must be "true" or "false", the module stays off',
    );
    warn.mockRestore();
  });
});
