import type { ReactNode } from "react";
import { Field } from "./field";
import { LeadSheet } from "./lead_sheet";

type booking_section_props = { form_id: string; children: ReactNode };

export const BookingSection = ({
  form_id,
  children,
}: booking_section_props) => (
  <LeadSheet
    id="booking"
    form_id={form_id}
    title={children}
    send="Je réserve ma visite"
  >
    <Field name="given-name" label="Votre prénom" />
    <Field name="family-name" label="Votre nom de famille" />
    <Field name="tel" label="Votre numéro de téléphone" />
    <Field name="email" label="Votre email" />
    <Field name="postal-code" label="Votre code postal" />
    <Field
      name="freetext"
      label="Votre projet, en quelques mots"
      className="col-span-full mt-3"
    />
  </LeadSheet>
);
