import Script from "next/script";
import { google_tag } from "@/lib/gads/google_tag";

export const GoogleTag = () => {
  const tag = google_tag();
  if (!tag) return null;
  return (
    <>
      <Script src={tag.library_url} />
      <Script id="google-tag">{tag.script}</Script>
    </>
  );
};
