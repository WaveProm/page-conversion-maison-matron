import type { ReactNode } from "react";

type offer_section_props = {
  video: ReactNode;
  action: ReactNode;
  children: ReactNode;
};

export const OfferSection = ({
  video,
  action,
  children,
}: offer_section_props) => (
  <section className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-ink text-paper">
    {video}
    <div aria-hidden className="absolute inset-0 bg-ink/40" />
    <div className="copy-inset relative py-24 md:text-center">
      {children}
      <div className="mt-8 lg:mt-12">{action}</div>
    </div>
  </section>
);

type offer_title_props = { children: ReactNode };

export const OfferTitle = ({ children }: offer_title_props) => (
  <h2 className="font-sans text-[44px] leading-[1.05] font-bold md:text-[64px] lg:text-[88px]">
    {children}
  </h2>
);
