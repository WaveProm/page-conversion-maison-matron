import type { NextRequest } from "next/server";
import { origin_proxy } from "@/lib/gads/origin_proxy";
import { identity_proxy } from "@/lib/meta_capi/identity_proxy";

const unindexed_pathname = "/confirmation";

export const proxy = (request: NextRequest) => {
  const response = origin_proxy(request, identity_proxy(request));
  if (request.nextUrl.pathname === unindexed_pathname)
    response.headers.set("X-Robots-Tag", "noindex");
  return response;
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
