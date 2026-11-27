import type { ReactNode } from "react";
import {
  CallToAction,
  CallToActionDetails,
  CallToActions,
} from "./call_to_action";

type expertise_actions_props = {
  tone: "paper" | "secondary";
  children: ReactNode;
};

export const ExpertiseActions = ({
  tone,
  children,
}: expertise_actions_props) => (
  <>
    <CallToActions>
      <CallToAction href="#booking">Votre expertise offerte</CallToAction>
      <CallToAction href="tel:+41215394675" tone={tone}>
        +41 21 539 46 75
      </CallToAction>
    </CallToActions>
    <CallToActionDetails tone={tone === "paper" ? "paper" : "gray"}>
      {children}
    </CallToActionDetails>
  </>
);
