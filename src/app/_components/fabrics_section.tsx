import Image from "next/image";
import type { ReactNode } from "react";
import casal_logo from "../../../public/fabric-logos/casal.svg";
import christian_lacroix_logo from "../../../public/fabric-logos/christian-lacroix.png";
import dedar_logo from "../../../public/fabric-logos/dedar.svg";
import edmond_petit_logo from "../../../public/fabric-logos/edmond-petit.png";
import hermes_logo from "../../../public/fabric-logos/hermes.svg";
import lelievre_logo from "../../../public/fabric-logos/lelievre-paris.svg";
import nobilis_logo from "../../../public/fabric-logos/nobilis.svg";
import pierre_frey_logo from "../../../public/fabric-logos/pierre-frey.svg";
import ralph_lauren_logo from "../../../public/fabric-logos/ralph-lauren.svg";
import { LogoGrid } from "./logo_grid";
import { SideVisualSection } from "./side_visual_section";

type fabrics_section_props = {
  visual?: ReactNode;
  action: ReactNode;
  children: ReactNode;
};

export const FabricsSection = ({
  visual,
  action,
  children,
}: fabrics_section_props) => (
  <SideVisualSection visual={visual} action={action}>
    {children}
    <LogoGrid>
      <Image
        src={hermes_logo}
        alt="Hermès"
        className="w-[54%] brightness-0 invert-[10.6%]"
      />
      <Image
        src={christian_lacroix_logo}
        alt="Christian Lacroix"
        className="w-[69%] brightness-0 invert-[10.6%]"
      />
      <Image
        src={ralph_lauren_logo}
        alt="Ralph Lauren"
        className="w-[85%] brightness-0 invert-[10.6%]"
      />
      <Image
        src={dedar_logo}
        alt="Dedar"
        className="w-[38%] brightness-0 invert-[10.6%]"
      />
      <Image
        src={lelievre_logo}
        alt="Lelièvre"
        className="w-[41%] brightness-0 invert-[10.6%]"
      />
      <Image
        src={nobilis_logo}
        alt="Nobilis"
        className="w-[47%] brightness-0 invert-[10.6%]"
      />
      <Image
        src={edmond_petit_logo}
        alt="Edmond Petit"
        className="w-[68%] brightness-0 invert-[10.6%]"
      />
      <Image src={pierre_frey_logo} alt="Pierre Frey" className="w-[23%]" />
      <Image
        src={casal_logo}
        alt="Casal"
        className="w-[29%] brightness-0 invert-[10.6%]"
      />
    </LogoGrid>
    <p className="italic">Et tant d'autres…</p>
  </SideVisualSection>
);
