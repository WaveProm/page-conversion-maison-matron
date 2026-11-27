import Image from "next/image";
import type { ReactNode } from "react";
import archival_photo from "../../../public/visuals/archival-photo-man-leading-horse.jpg";
import { SideVisualSection } from "./side_visual_section";
import { Caption, SectionSubtitle, SectionTitle } from "./typography";

type heritage_section_props = { action: ReactNode };

export const HeritageSection = ({ action }: heritage_section_props) => (
  <SideVisualSection
    visual={
      <figure>
        <Image
          src={archival_photo}
          alt="Photographie d'archive en noir et blanc : un homme en gilet et chemise aux manches retroussées tient un cheval par la longe, devant une bâtisse."
          sizes="(min-width: 1024px) 50vw, 100vw"
          preload
        />
        <Caption>Photo d'archive</Caption>
      </figure>
    }
    action={action}
  >
    <SectionTitle>Maison Matron, artisan depuis 4 générations</SectionTitle>
    <p>
      Depuis plus d'un siècle, notre savoir-faire façonne des objets, travaillés
      à la main et habillés des plus beaux tissus.
    </p>
    <p>
      Nos tapissiers, ébénistes et courtepointières sont unis par une unique
      valeur :
    </p>
    <SectionSubtitle>
      Ennoblir chaque pièce qui nous est confiée.
    </SectionSubtitle>
  </SideVisualSection>
);
