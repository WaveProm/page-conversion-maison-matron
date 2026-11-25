import Script from "next/script";
import { origin_script } from "@/lib/gads/origin_script";

export const VisitOrigin = () => {
  const script = origin_script();
  return script ? <Script id="visit-origin">{script}</Script> : null;
};
