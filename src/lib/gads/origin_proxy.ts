import "server-only";
import { type NextRequest, NextResponse } from "next/server";
import { read_config } from "./config";
import { origin_cookie_name, origin_cookie_options } from "./origin_cookie";
import { origin_of_search } from "./origin_rule";

export const origin_proxy = (
  request: NextRequest,
  response: NextResponse = NextResponse.next(),
) => {
  const config = read_config();
  if (!config.ok) return response;
  const arrival = origin_of_search(request.nextUrl.search);
  if (arrival === "") return response;
  response.cookies.set(
    origin_cookie_name,
    arrival,
    origin_cookie_options(config.config.secure_cookie),
  );
  return response;
};
