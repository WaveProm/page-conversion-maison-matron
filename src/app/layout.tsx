import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { EB_Garamond } from "next/font/google";
import { Suspense } from "react";
import { GoogleTag } from "@/components/google_tag";
import { PageView } from "@/components/page_view";
import { VisitOrigin } from "@/components/visit_origin";
import { site_origin } from "@/lib/site_origin";
import "./globals.css";

const ebGaramond = EB_Garamond({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  metadataBase: site_origin,
  title: {
    default: "Maison Matron, artisan tapissier & ébéniste depuis 4 générations",
    template: "%s · Maison Matron",
  },
  description:
    "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="fr-CH"
    data-scroll-behavior="smooth"
    className={`${ebGaramond.variable} scroll-smooth`}
  >
    <body className="bg-paper font-sans text-base leading-[1.35] text-ink antialiased">
      {children}
      <Suspense fallback={null}>
        <PageView />
      </Suspense>
      <VisitOrigin />
      <GoogleTag />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
