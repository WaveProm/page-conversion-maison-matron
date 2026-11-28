import type { ReactNode } from "react";
import { FabricLogos } from "./fabric_logos";
import { SideVisualSection } from "./side_visual_section";
import { SectionTitle } from "./typography";

type fabrics_section_props = { visual?: ReactNode; action: ReactNode };

export const FabricsSection = ({ visual, action }: fabrics_section_props) => (
  <SideVisualSection visual={visual} action={action}>
    <SectionTitle>Profitez de milliers de tissus</SectionTitle>
    <p>Nos collections voyagent avec nous jusqu'à chez vous.</p>
    <p>Ce que vous voulez, nous l'avons.</p>
    <FabricLogos />
  </SideVisualSection>
);
