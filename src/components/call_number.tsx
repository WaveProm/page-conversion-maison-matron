import { google_tag } from "@/lib/gads/google_tag";

type call_number_props = {
  className?: string;
};

export const CallNumber = ({ className }: call_number_props) => {
  const tag = google_tag();
  if (!tag) return null;
  return (
    <a href={tag.tel_href} className={className}>
      {tag.displayed_number}
    </a>
  );
};
