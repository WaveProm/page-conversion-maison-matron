import "server-only";

export const origin_cookie_name = "visit_origin";

const ninety_days_s = 7_776_000;
const same_site: "lax" = "lax";

export const origin_cookie_options = (secure: boolean) => ({
  httpOnly: true,
  secure,
  sameSite: same_site,
  maxAge: ninety_days_s,
  path: "/",
});
