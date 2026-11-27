import type { ReactNode } from "react";
import type { service_path } from "@/lib/service_path";
import { SectionTitle } from "./typography";

type service_props = {
  href: service_path;
  current: service_path;
  children: ReactNode;
};

const Service = ({ href, current, children }: service_props) =>
  href === current ? null : (
    <li>
      <a
        href={href}
        className="flex aspect-[4/5] flex-col justify-end bg-ink p-5 text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        {children}
      </a>
    </li>
  );

type service_copy_props = { children: ReactNode };

const ServiceName = ({ children }: service_copy_props) => (
  <span className="block font-display text-[22px] leading-[1.2] italic lg:text-[28px]">
    {children}
  </span>
);

const ServiceLine = ({ children }: service_copy_props) => (
  <span className="mt-2 block text-[15px] leading-[1.35]">{children}</span>
);

type services_section_props = { current: service_path };

export const ServicesSection = ({ current }: services_section_props) => (
  <section className="copy-inset">
    <div className="md:mx-auto md:w-full md:max-w-[600px] lg:max-w-[1100px]">
      <SectionTitle>Découvrez nos autres services</SectionTitle>
      <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        <Service href="/" current={current}>
          <ServiceName>Tapissier décorateur</ServiceName>
          <ServiceLine>Fauteuils, canapés et chaises</ServiceLine>
        </Service>
        <Service href="/fauteuils" current={current}>
          <ServiceName>Fauteuils et chaises</ServiceName>
          <ServiceLine>Du Voltaire au Louis XV</ServiceLine>
        </Service>
        <Service href="/canapes" current={current}>
          <ServiceName>Canapés</ServiceName>
          <ServiceLine>En tissu comme en cuir</ServiceLine>
        </Service>
        <Service href="/restauration-meubles" current={current}>
          <ServiceName>Restauration de meubles</ServiceName>
          <ServiceLine>Meubles anciens en bois</ServiceLine>
        </Service>
        <Service href="/sur-mesure" current={current}>
          <ServiceName>Meubles sur mesure</ServiceName>
          <ServiceLine>Chaque chaise assemblée à l'ancienne</ServiceLine>
        </Service>
        <Service href="/stores-sur-mesure" current={current}>
          <ServiceName>Stores sur mesure</ServiceName>
          <ServiceLine>En tissu et en bois, posés chez vous</ServiceLine>
        </Service>
        <Service href="/rideaux-sur-mesure" current={current}>
          <ServiceName>Rideaux sur mesure</ServiceName>
          <ServiceLine>Cousus à vos mesures, posés chez vous</ServiceLine>
        </Service>
      </ul>
    </div>
  </section>
);
