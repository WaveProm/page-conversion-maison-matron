import "server-only";
import { read_call_tracking } from "./config";

export type google_tag = {
  library_url: string;
  script: string;
  displayed_number: string;
  tel_href: string;
};

export type call_link = { href: string };

export type call_page = {
  document: {
    querySelectorAll: (selector: string) => Iterable<call_link>;
    createTreeWalker: (
      root: call_link,
      shown: number,
    ) => { nextNode: () => { data: string } | null };
  };
  NodeFilter: { SHOW_TEXT: number };
};

type shown_number = { displayed_number: string; tel_href: string };

const library_base_url = "https://www.googletagmanager.com/gtag/js";

const tel_href_of = (displayed_number: string) =>
  `tel:${displayed_number.replace(/[^\d+]/g, "")}`;

export const forwarding_number_in_links =
  (page: call_page, shown: shown_number) =>
  (formatted_number: string, mobile_number: string) => {
    const links = page.document.querySelectorAll(`a[href="${shown.tel_href}"]`);
    for (const link of links) {
      link.href = `tel:${mobile_number}`;
      const texts = page.document.createTreeWalker(
        link,
        page.NodeFilter.SHOW_TEXT,
      );
      for (let text = texts.nextNode(); text; text = texts.nextNode()) {
        text.data = text.data
          .split(shown.displayed_number)
          .join(formatted_number);
      }
    }
  };

export const google_tag = (): google_tag | undefined => {
  const tracking = read_call_tracking();
  if (!tracking) return undefined;
  const tag_id = JSON.stringify(tracking.tag_id);
  const send_to = JSON.stringify(tracking.send_to);
  const number = JSON.stringify(tracking.displayed_number);
  const tel_href = tel_href_of(tracking.displayed_number);
  const shown: shown_number = {
    displayed_number: tracking.displayed_number,
    tel_href,
  };
  const callback = `(${forwarding_number_in_links.toString()})(window,${JSON.stringify(shown)})`;
  return {
    library_url: `${library_base_url}?id=${encodeURIComponent(tracking.tag_id)}`,
    script: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",${tag_id});gtag("config",${send_to},{phone_conversion_number:${number},phone_conversion_callback:${callback}});`,
    displayed_number: tracking.displayed_number,
    tel_href,
  };
};
